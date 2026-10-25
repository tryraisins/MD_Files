#!/usr/bin/env python3
"""codegraph: zero-dependency code index with graph structure and budgeted output.

Subcommands:
  build   scan a repository, write .codegraph/graph.json (structure + term postings)
  query   return a small ranked answer for a task, symbol, file or impact set
  stats   print index size

Two signals, both static:
  - a term index over file content, so a concept is found without knowing its name
  - a structural graph (imports, defines, routes, tests) for expansion and impact

No model calls at build or query time. Output is capped by a token budget. The
index narrows a search; it is not a source of truth. Confirm with a read.
"""

import argparse
import ast
import hashlib
import json
import math
import os
import re
import sys
from collections import defaultdict, deque

SCHEMA = 2
CODE_EXT = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py"}
IGNORE_DIRS = {
    ".git", "node_modules", "dist", "build", ".next", ".turbo", "vendor",
    ".venv", "venv", "__pycache__", "coverage", ".cache", ".yarn", "out",
    "target", ".pytest_cache", ".mypy_cache", ".ruff_cache", ".wrangler",
    "dev-dist", ".netlify", ".vercel", ".expo", "test-screenshots", "output",
}
IGNORE_FILE = re.compile(r"(\.min\.js$|\.bundle\.js$|\.d\.ts$|lock\.json$)")
TEST_HINT = re.compile(r"(^|/)(tests?|__tests__|spec)/|\.(test|spec)\.[jt]sx?$|-e2e\.|/e2e[-.]")

STOP = set("""the a an and or of to in on for with how does do did is are was what where which when
file files code line lines function functions method methods class classes use used using get set add
change changes update handle handles thing things work works implement implemented implementation
please show find current existing new old need needs want like make makes made from into this that
these those there here about after before then than all any both each more most other some such only
own same so too very can will just should now""".split())
IDENT = re.compile(r"[A-Za-z_][A-Za-z0-9_]{2,}")
CAMEL = re.compile(r"[A-Z]+(?![a-z])|[A-Z]?[a-z]+|\d+")


def rel(root, path):
    return os.path.relpath(path, root).replace(os.sep, "/")


def sha(text):
    return hashlib.sha1(text.encode("utf-8", "surrogatepass")).hexdigest()[:12]


def clamp(text, limit=120):
    text = " ".join(text.split())
    return text if len(text) <= limit else text[: limit - 1] + "\u2026"


# ---------------------------------------------------------------- extraction

TS_IMPORT = re.compile(
    r"""^\s*(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]""",
    re.M,
)
TS_REQUIRE = re.compile(r"""require\(\s*['"]([^'"]+)['"]""")
TS_DYNAMIC = re.compile(r"""\bimport\(\s*['"]([^'"]+)['"]""")
TS_DEF = re.compile(
    r"""^\s*(export\s+)?(?:default\s+)?(?:declare\s+)?(?:async\s+)?"""
    r"""(?:(function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)|"""
    r"""(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=)""",
    re.M,
)
TS_ROUTE = re.compile(r"""<Route\b[^>]*?path=["']([^"']+)["']""", re.S)


def extract_ts(text):
    imports = set(TS_IMPORT.findall(text)) | set(TS_REQUIRE.findall(text)) | set(TS_DYNAMIC.findall(text))
    symbols, routes = [], []
    for m in TS_DEF.finditer(text):
        exported, kind, name_a, name_b = m.groups()
        name = name_a or name_b
        if not name:
            continue
        kind = kind or ("const" if name_b else "symbol")
        line = text.count("\n", 0, m.start()) + 1
        symbols.append({"name": name, "kind": kind, "line": line,
                        "sig": clamp(m.group(0).strip().rstrip("=").strip()),
                        "exported": bool(exported)})
    for m in TS_ROUTE.finditer(text):
        path = m.group(1)
        tag_end = text.find(">", m.end())
        tag = text[m.start(): tag_end if tag_end != -1 else m.end()]
        comp = re.findall(r"element=\{\s*<\s*([A-Z][\w$]*)|<\s*([A-Z][\w$]*)", tag)
        target = next((a or b for a, b in comp if (a or b)), None)
        line = text.count("\n", 0, m.start()) + 1
        routes.append({"path": path, "line": line, "target": target, "kind": "ui"})
    return imports, symbols, routes


PY_DECOR_ROUTE = re.compile(
    r"""@\s*([\w.]+)\.(route|get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]""",
    re.M,
)


def extract_py(text, path):
    imports, symbols, routes = set(), [], []
    for m in PY_DECOR_ROUTE.finditer(text):
        routes.append({"path": m.group(3), "line": text.count("\n", 0, m.start()) + 1,
                       "target": None, "kind": "api:" + m.group(2), "owner": m.group(1)})
    try:
        tree = ast.parse(text)
    except SyntaxError:
        return imports, symbols, routes
    defs_by_line = {}

    def walk(node, depth):
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.Import, ast.ImportFrom)):
                if isinstance(child, ast.Import):
                    for a in child.names:
                        imports.add(a.name)
                elif child.module and child.level == 0:
                    imports.add(child.module)
            elif isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                args = ", ".join(a.arg for a in child.args.args[:6])
                sig = f"{'async ' if isinstance(child, ast.AsyncFunctionDef) else ''}def {child.name}({args})"
                defs_by_line[child.lineno] = child.name
                if depth <= 1:
                    symbols.append({"name": child.name, "kind": "function",
                                    "line": child.lineno, "sig": sig,
                                    "exported": not child.name.startswith("_")})
                for dec in child.decorator_list:
                    src = ast.unparse(dec) if hasattr(ast, "unparse") else ""
                    if "route(" in src or re.search(r"\.(get|post|put|patch|delete)\(", src):
                        for r in routes:
                            if r["target"] is None and r["line"] - 1 <= child.lineno <= r["line"] + 2:
                                r["target"] = child.name
            elif isinstance(child, ast.ClassDef):
                bases = ",".join(ast.unparse(b) for b in child.bases) if hasattr(ast, "unparse") else ""
                if depth <= 1:
                    symbols.append({"name": child.name, "kind": "class", "line": child.lineno,
                                    "sig": clamp(f"class {child.name}({bases})"),
                                    "exported": not child.name.startswith("_")})
                walk(child, depth + 1)
                continue
            walk(child, depth + 1)

    walk(tree, 0)
    for r in routes:
        if r["target"] is None:
            near = [ln for ln in defs_by_line if ln >= r["line"]]
            if near:
                r["target"] = defs_by_line[min(near)]
    return imports, symbols, routes


# ---------------------------------------------------------------- resolution

def read_tsconfig_paths(root):
    aliases = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for name in filenames:
            if not re.match(r"tsconfig.*\.json$", name):
                continue
            try:
                raw = open(os.path.join(dirpath, name), encoding="utf-8").read()
                raw = re.sub(r"/\*.*?\*/", "", raw, flags=re.S)
                raw = re.sub(r"^\s*//.*$", "", raw, flags=re.M)
                data = json.loads(raw)
            except Exception:
                continue
            opts = data.get("compilerOptions") or {}
            paths = opts.get("paths") or {}
            if not paths:
                continue
            base_abs = os.path.normpath(os.path.join(dirpath, opts.get("baseUrl", ".")))
            for pattern, targets in paths.items():
                for target in targets:
                    aliases.append({"pattern": pattern, "target": os.path.normpath(
                        os.path.join(base_abs, target.replace("*", "")))})
    return aliases


def resolve(spec, from_file, root, fileset, aliases):
    if spec.startswith("."):
        base = os.path.normpath(os.path.join(os.path.dirname(from_file), spec))
        stem, ext = os.path.splitext(base)
        cands = [stem] if ext in CODE_EXT else [base]
        for c in list(cands):
            for e in (".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"):
                cands.append(c + e)
            for e in (".ts", ".tsx", ".js", ".jsx"):
                cands.append(os.path.join(c, "index" + e))
        for c in cands:
            if c in fileset:
                return c
        return None
    for alias in aliases:
        pat = alias["pattern"]
        if "*" in pat:
            pre, post = pat.split("*", 1)
            if spec.startswith(pre) and spec.endswith(post):
                mid = spec[len(pre): len(spec) - len(post) if post else len(spec)]
                base = os.path.normpath(os.path.join(alias["target"], mid))
                for c in [base] + [base + e for e in (".ts", ".tsx", ".js", ".jsx")] + \
                         [os.path.join(base, "index" + e) for e in (".ts", ".tsx", ".js")]:
                    if c in fileset:
                        return c
        elif spec == pat and alias["target"] in fileset:
            return alias["target"]
    for prefix in ("", "frontend/", "src/", "backend/"):
        base = os.path.normpath(os.path.join(root, prefix + spec.replace(".", "/")))
        for c in [base + ".py", os.path.join(base, "__init__.py"), base + ".ts", base + ".js"]:
            if c in fileset:
                return c
    return None


def is_test(path):
    return bool(TEST_HINT.search("/" + path))


def content_terms(text):
    counts = defaultdict(int)
    for raw in IDENT.findall(text):
        low = raw.lower()
        if low in STOP or len(low) > 40:
            continue
        counts[low] += 1
        for part in CAMEL.findall(raw):
            p = part.lower()
            if len(p) > 3 and p not in STOP:
                counts[p] += 1
    return counts


def build(root, out_path, max_terms=2500):
    files, skipped = [], 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if d not in IGNORE_DIRS and not d.startswith("."))
        for name in sorted(filenames):
            ext = os.path.splitext(name)[1].lower()
            if ext not in CODE_EXT or IGNORE_FILE.search(name):
                continue
            full = os.path.normpath(os.path.join(dirpath, name))
            try:
                text = open(full, encoding="utf-8", errors="replace").read()
            except OSError:
                skipped += 1
                continue
            if len(text) > 400_000:
                skipped += 1
                continue
            files.append({"path": full, "rel": rel(root, full), "text": text})

    fileset = {f["path"] for f in files}
    aliases = read_tsconfig_paths(root)
    nodes, edges = [], []
    postings = defaultdict(list)

    for idx, f in enumerate(files):
        ext = os.path.splitext(f["path"])[1].lower()
        imports, symbols, routes = (extract_py(f["text"], f["path"]) if ext == ".py"
                                   else extract_ts(f["text"]))
        loc = f["text"].count("\n") + 1
        nodes.append({"id": f["rel"], "type": "test" if is_test(f["rel"]) else "file",
                      "loc": loc, "hash": sha(f["text"])})
        for s in symbols:
            nodes.append({"id": f"{f['rel']}#{s['name']}", "type": "symbol",
                          "name": s["name"], "kind": s["kind"], "line": s["line"],
                          "sig": s["sig"], "exported": s["exported"]})
            edges.append({"from": f["rel"], "to": f"{f['rel']}#{s['name']}", "type": "defines"})
        seen = set()
        for r in routes:
            rid = f"{f['rel']}#route:{r['path']}"
            if rid in seen:
                continue
            seen.add(rid)
            nodes.append({"id": rid, "type": "route", "path": r["path"],
                          "line": r["line"], "kind": r["kind"]})
            edges.append({"from": f["rel"], "to": rid, "type": "handles"})
            if r.get("target"):
                edges.append({"from": rid, "to": f"{f['rel']}#{r['target']}", "type": "handler"})
        f["_imports"] = imports
        for term, tf in content_terms(f["text"]).items():
            postings[term].append([idx, min(tf, 40)])

    for f in files:
        for spec in f["_imports"]:
            target = resolve(spec, f["path"], root, fileset, aliases)
            if target:
                edges.append({"from": f["rel"], "to": rel(root, target), "type": "imports"})

    route_index = [(n["id"], n["path"]) for n in nodes if n["type"] == "route"]
    for f in files:
        if not is_test(f["rel"]):
            continue
        for rid, rpath in route_index:
            if len(rpath) > 4 and rpath in f["text"]:
                edges.append({"from": f["rel"], "to": rid, "type": "exercises"})

    keep = sorted(postings.items(), key=lambda kv: (-len(kv[1]), kv[0]))[:max_terms]
    graph = {
        "schema": SCHEMA,
        "root": os.path.abspath(root),
        "files": [f["rel"] for f in files],
        "stats": {
            "files": len(files),
            "tests": sum(1 for f in files if is_test(f["rel"])),
            "symbols": sum(1 for n in nodes if n["type"] == "symbol"),
            "routes": sum(1 for n in nodes if n["type"] == "route"),
            "edges": len(edges),
            "import_edges": sum(1 for e in edges if e["type"] == "imports"),
            "terms": len(keep),
            "skipped": skipped,
        },
        "nodes": sorted(nodes, key=lambda n: n["id"]),
        "edges": sorted(edges, key=lambda e: (e["from"], e["type"], e["to"])),
        "postings": {t: v for t, v in keep},
    }
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(graph, fh, indent=0, sort_keys=True)
        fh.write("\n")
    return graph


# ---------------------------------------------------------------- retrieval

def tokenize(text):
    out = []
    for chunk in re.split(r"[^A-Za-z0-9]+", text):
        if not chunk:
            continue
        out.append(chunk.lower())
        out.extend(p.lower() for p in CAMEL.findall(chunk) if len(p) > 2)
    return [t for t in dict.fromkeys(out) if len(t) > 2 and t not in STOP]


def score_files(graph, task, limit=10):
    terms = tokenize(task)
    if not terms:
        return []
    files, post = graph["files"], graph["postings"]
    n = max(1, len(files))
    scores, matched = defaultdict(float), defaultdict(list)
    for t in terms:
        plist = post.get(t)
        if not plist:
            continue
        idf = math.log(1 + n / (1 + len(plist)))
        for idx, tf in plist:
            scores[idx] += idf * (1 + math.log(tf))
            matched[idx].append(t)
    for idx in list(scores):
        base = os.path.basename(files[idx]).lower()
        scores[idx] *= 1 + 0.15 * len(set(matched[idx]))
        if any(t in base for t in terms):
            scores[idx] *= 1.8
        if TEST_HINT.search("/" + files[idx]):
            scores[idx] *= 0.8
    ranked = sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))
    return [(files[i], s, sorted(set(matched[i]))) for i, s in ranked[:limit]]


def structural_related(graph, relpath):
    """Files reached by one import or exercise hop, either direction."""
    out = []
    for e in graph["edges"]:
        if e["type"] not in ("imports", "exercises"):
            continue
        if e["from"] == relpath:
            out.append((e["to"], e["type"]))
        elif e["to"] == relpath:
            out.append((e["from"], "imported-by" if e["type"] == "imports" else "exercised-by"))
    return out


def snippets(root, relpath, terms, weights, want=4):
    full = os.path.join(root, relpath)
    try:
        lines = open(full, encoding="utf-8", errors="replace").read().split("\n")
    except OSError:
        return []
    scored = []
    for i, line in enumerate(lines, 1):
        low = line.lower()
        w = sum(weights.get(t, 0) for t in terms if t in low)
        strip = line.strip()
        if w <= 0 or len(strip) < 4:
            continue
        if line.lstrip().startswith(("import ", "from ", "require(", "//", "#!")):
            continue
        if re.fullmatch(r"[\w.$]+[,;]?", strip) or (strip.endswith(",") and len(strip) < 24):
            continue
        scored.append((w, i))
    scored.sort(key=lambda x: (-x[0], x[1]))
    chosen = []
    for _, i in scored:
        if any(abs(i - j) <= 2 for j in chosen):
            continue
        chosen.append(i)
        if len(chosen) >= want:
            break
    return [(i, clamp(lines[i - 1])) for i in sorted(chosen)]


def render(graph, root, results, budget_tokens, note=None, include_tests=False):
    budget_chars = budget_tokens * 4
    files = graph["files"]
    weights = {t: 1.0 / (1 + len(v)) for t, v in graph["postings"].items()}
    rare = {t for t, v in graph["postings"].items() if len(v) <= max(3, len(files) * 0.03)}
    out = [note] if note else []
    used = len(out[0]) if out else 0
    shown, truncated = 0, False
    for relpath, score, terms in results:
        node = next((n for n in graph["nodes"] if n["id"] == relpath), None)
        if not node:
            continue
        if node["type"] == "test" and not include_tests:
            continue
        block = [f"{relpath}  [{node['type']}, {node['loc']} loc, {score:.0f}]  {','.join(terms[:5])}"]
        for line_no, text in snippets(root, relpath, terms, weights):
            block.append(f"  {line_no:>5}  {text}")
        routes = [n for n in graph["nodes"]
                  if n["type"] == "route" and n["id"].startswith(relpath + "#route:")]
        hit_routes = [r for r in routes if any(t in r["path"].lower() for t in terms if t in rare)]
        for r in hit_routes[:3]:
            block.append(f"  route {r['path']}  L{r['line']}")
        related = [p for p, kind in structural_related(graph, relpath) if kind in
                   ("imports", "imported-by", "exercised-by")][:3]
        if related:
            block.append("  related: " + ", ".join(related))
        text = "\n".join(block) + "\n"
        if used + len(text) > budget_chars:
            truncated = True
            break
        out.append(text.rstrip("\n"))
        used += len(text)
        shown += 1
    header = (f"codegraph: {shown} files shown (~{used // 4} tokens, budget {budget_tokens})")
    body = header + "\n" + "\n".join(out)
    if truncated:
        body += "\n(truncated: narrow the task or raise --budget)"
    if shown == 0:
        body += "\n(no match: fall back to grep)"
    return body


def load(root, out_path):
    path = out_path or os.path.join(root, ".codegraph", "graph.json")
    if not os.path.exists(path):
        sys.exit(f"no index at {path}; run: codegraph.py build --root {root}")
    return json.load(open(path, encoding="utf-8"))


def main(argv=None):
    ap = argparse.ArgumentParser(prog="codegraph")
    sub = ap.add_subparsers(dest="cmd", required=True)

    b = sub.add_parser("build")
    b.add_argument("--root", default=".")
    b.add_argument("--out")
    b.add_argument("--max-terms", type=int, default=2500)

    q = sub.add_parser("query")
    q.add_argument("--root", default=".")
    q.add_argument("--graph")
    q.add_argument("--task")
    q.add_argument("--symbol")
    q.add_argument("--file")
    q.add_argument("--impact", help="show files that import the given file")
    q.add_argument("--budget", type=int, default=1200)
    q.add_argument("--tests", action="store_true")
    q.add_argument("--json", action="store_true")

    s = sub.add_parser("stats")
    s.add_argument("--root", default=".")
    s.add_argument("--graph")

    args = ap.parse_args(argv)
    root = os.path.abspath(args.root)

    if args.cmd == "build":
        out = args.out or os.path.join(root, ".codegraph", "graph.json")
        g = build(root, out, args.max_terms)
        print(json.dumps(g["stats"], indent=1))
        print(f"wrote {out} ({os.path.getsize(out) / 1024:.0f} KB)")
        return

    g = load(root, getattr(args, "graph", None))
    if args.cmd == "stats":
        print(json.dumps(g["stats"], indent=1))
        return

    if args.impact:
        target = args.impact.replace(os.sep, "/")
        users = [e["from"] for e in g["edges"] if e["to"] == target and e["type"] == "imports"]
        results = [(target, 100.0, [os.path.basename(target)])]
        results += [(u, 60.0, ["imports"]) for u in users]
        print(render(g, root, results, args.budget,
                     f"impact({target}): {len(users)} direct importers", args.tests))
        return

    if args.file:
        target = args.file.replace(os.sep, "/")
        base = [t for t in tokenize(os.path.basename(target)) if t not in STOP]
        results = [(target, 100.0, base)]
        results += [(p, 50.0, [os.path.basename(p)]) for p, _ in structural_related(g, target)[:6]]
        print(render(g, root, results, args.budget, f"file({target})", args.tests))
        return

    if args.symbol:
        hits = [n for n in g["nodes"] if n["type"] == "symbol"
                and n["name"].lower() == args.symbol.lower()]
        if not hits:
            hits = [n for n in g["nodes"] if n["type"] == "symbol"
                    and args.symbol.lower() in n["name"].lower()][:8]
        if not hits:
            sys.exit(f"symbol not found: {args.symbol}")
        results = []
        for n in hits:
            frel = n["id"].split("#", 1)[0]
            results.append((frel, 100.0, [args.symbol.lower()]))
        print(render(g, root, results, args.budget, f"symbol({args.symbol})", args.tests))
        return

    if not args.task:
        sys.exit("give --task, --symbol, --file or --impact")
    results = score_files(g, args.task)
    if args.json:
        print(json.dumps([{"file": f, "score": round(s, 1), "terms": t} for f, s, t in results], indent=1))
    else:
        print(render(g, root, results, args.budget, f'task("{args.task}")', args.tests))


if __name__ == "__main__":
    main()
