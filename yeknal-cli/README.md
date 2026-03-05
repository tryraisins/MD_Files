# yeknal

A CLI tool to instantly fetch project guideline templates (Security, Design, SEO) into any repository.

## Installation

No installation needed — just use `npx`:

```bash
npx yeknal <category>
```

## Usage

Run any of the following commands from the root of your project:

### Security

Fetches the **Security-Master.md** guideline and automatically runs a security audit on your project, saving the results to `security-audit.log`.

```bash
npx yeknal security
```

**Output files:**
- `Security-Master.md` — Security best practices and policies
- `security-audit.log` — Automated audit results for your project

---

### Design

Fetches the **Design.md** guideline with UI/UX design principles and standards.

```bash
npx yeknal design
```

**Output files:**
- `Design.md` — Design system guidelines

---

### SEO

Fetches the **SEO-Prompt.md** guideline with SEO improvement strategies.

```bash
npx yeknal seo
```

**Output files:**
- `SEO-Prompt.md` — SEO checklist and improvement prompts

## Examples

```bash
# Navigate to any project
cd my-project

# Pull security guidelines + run audit
npx yeknal security

# Pull design guidelines
npx yeknal design

# Pull SEO guidelines
npx yeknal seo
```

## How It Works

1. The CLI fetches the requested markdown file from a remote GitHub repository.
2. The file is saved directly into your current working directory.
3. For `security`, it additionally runs `npx secure-repo audit` and logs the results.

## License

ISC
