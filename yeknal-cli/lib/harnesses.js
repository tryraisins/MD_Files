"use strict";

const fs = require("fs/promises");
const path = require("path");

const SUPPORTED = ["codex", "claude", "opencode", "cursor", "windsurf", "copilot", "gemini", "antigravity", "roo", "kiro", "cline", "openhands", "amp", "agents"];
const ALIASES = { "gemini-cli": "gemini", cascade: "windsurf", "roo-code": "roo", "copilot-cli": "copilot", shared: "agents" };

async function read(file) {
  try { return await fs.readFile(file, "utf8"); }
  catch (error) { if (error.code === "ENOENT") return null; throw error; }
}

// Each native surface is backed by first-party documentation. Detection only
// establishes configuration presence, never authentication or instruction use.
async function detectHarnesses({ home, env }) {
  const { getSkillTargetSpecs } = require("../bin/yeknal.js");
  const specs = getSkillTargetSpecs(home);
  const antigravityDefaults = specs.find(spec => spec.envVar === "YEKNAL_GEMINI_PARENT").defaults;
  const parent = (key, fallback, nativeOverride) => path.resolve(nativeOverride || env[`YEKNAL_${key}_PARENT`] || fallback);
  const codex = parent("CODEX", path.join(home, ".codex"), env.CODEX_HOME);
  const claude = parent("CLAUDE", path.join(home, ".claude"), env.CLAUDE_CONFIG_DIR);
  const opencode = parent("OPENCODE", path.join(env.XDG_CONFIG_HOME || path.join(home, ".config"), "opencode"));
  const cursor = parent("CURSOR", path.join(home, ".cursor"));
  const windsurf = parent("WINDSURF", path.join(home, ".codeium", "windsurf"));
  const copilot = parent("COPILOT", path.join(home, ".copilot"), env.COPILOT_HOME);
  const gemini = parent("GEMINI_CLI", path.join(env.GEMINI_CLI_HOME || home, ".gemini"));
  const antigravity = path.join(home, ".gemini");
  const sharedGemini = (process.platform === "win32" ? gemini.toLowerCase() : gemini) === (process.platform === "win32" ? antigravity.toLowerCase() : antigravity);
  const roo = parent("ROO", path.join(home, ".roo"));
  const kiro = parent("KIRO", path.join(home, ".kiro"));
  const cline = parent("CLINE", path.join(home, ".cline"), env.CLINE_DIR);
  const openhands = parent("OPENHANDS", path.join(home, ".openhands"));
  const amp = parent("AMP", path.join(home, ".config", "amp"));
  const shared = parent("AGENTS", path.join(home, ".agents"));
  const native = (id, label, configDir, relative, docs, extra = {}) => ({ id, label, configDir, configDirs: [configDir], instructionFile: path.join(configDir, relative), skillRoots: [path.join(configDir, "skills")], migrationRoots: [path.join(configDir, "skills")], mode: "native", docs, ...extra });
  const manual = (id, label, configDir, docs, steps) => ({ id, label, configDir, configDirs: [configDir], instructionFile: null, skillRoots: [path.join(configDir, "skills")], migrationRoots: [], mode: "manual", docs, steps });
  const candidates = [
    native("codex", "Codex", codex, (await read(path.join(codex, "AGENTS.override.md")))?.trim() ? "AGENTS.override.md" : "AGENTS.md", "https://developers.openai.com/codex/guides/agents-md", { skillRoots: [path.join(shared, "skills"), path.join(codex, "skills")] }),
    native("claude", "Claude Code", claude, "CLAUDE.md", "https://code.claude.com/docs/en/memory", { migrationRoots: [] }),
    native("opencode", "OpenCode V2", opencode, "AGENTS.md", "https://opencode.ai/v2/docs/instructions/", { skillRoots: [path.join(shared, "skills"), path.join(opencode, "skills"), path.join(claude, "skills")] }),
    native("cursor", "Cursor Agent", cursor, "rules/yeknal.mdc", "https://cursor.com/help/customization/rules", { exclusiveFile: true, prefix: "---\ndescription: Yeknal on-demand skill discovery\nalwaysApply: true\n---\n", warning: "Check that the Yeknal user rule is enabled and set to Always Apply. This connects Agent Chat; other Cursor features may not consume user rules." }),
    native("windsurf", "Windsurf / Cascade", windsurf, "memories/global_rules.md", "https://docs.devin.ai/desktop/cascade/memories", { maxCharacters: 6000 }),
    native("copilot", "GitHub Copilot CLI", copilot, "copilot-instructions.md", "https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions", { warning: "This file connects Copilot CLI only. For Copilot in an IDE, add the prepared bootstrap to that IDE's user or repository instructions and verify it is enabled." }),
    native("gemini", sharedGemini ? "Gemini CLI / Antigravity" : "Gemini CLI", gemini, "GEMINI.md", "https://geminicli.com/docs/cli/gemini-md/", { configDirs: sharedGemini ? [...new Set([gemini, ...antigravityDefaults, ...(env.YEKNAL_GEMINI_PARENT ? [path.resolve(env.YEKNAL_GEMINI_PARENT)] : [])])] : [gemini], warning: sharedGemini ? "Gemini CLI and Antigravity share one GEMINI.md connection. Check /memory show in Gemini or the active global rules in Antigravity. Custom context filenames/settings may change ingestion." : "Gemini CLI has a redirected instruction root. This connection does not configure Antigravity; check /memory show in a fresh CLI session." }),
    { ...manual("antigravity", "Antigravity", antigravity, "https://www.antigravity.google/docs/rules/", [`Gemini CLI has a separate instruction root. Keep Antigravity skills and add the prepared bootstrap to ${path.join(antigravity, "GEMINI.md")} in Antigravity's global rules.`, "Verify active global rules and search/load in a fresh Antigravity session. The redirected Gemini CLI file does not configure Antigravity." ]), configDirs: [antigravity, ...antigravityDefaults, ...(env.YEKNAL_GEMINI_PARENT ? [path.resolve(env.YEKNAL_GEMINI_PARENT)] : [])], ...(sharedGemini ? { mode: "alias", aliasOf: "gemini" } : {}) },
    native("roo", "Roo Code", roo, "rules/yeknal.md", "https://github.com/RooCodeInc/Roo-Code/blob/main/apps/docs/docs/features/custom-instructions.md", { exclusiveFile: true }),
    native("kiro", "Kiro (local IDE / CLI)", kiro, "steering/yeknal.md", "https://kiro.dev/docs/steering/", { exclusiveFile: true, prefix: "---\ninclusion: always\n---\n", warning: "Kiro custom agents require the steering file in their resources configuration. Web/mobile sessions need their own synced or project instructions." }),
    native("cline", "Cline", cline, "rules/yeknal.md", "https://docs.cline.bot/customization/cline-rules", { exclusiveFile: true, warning: "Verify the Yeknal rule is enabled. A CLI --config override or older Documents/Cline/Rules configuration needs the prepared bootstrap in its active rules directory." }),
    manual("openhands", "OpenHands", openhands, "https://docs.openhands.dev/overview/skills", ["Keep existing native skills. Add the prepared bootstrap to the project's AGENTS.md, or your active backend's instructions.", "Canvas/Cloud: enable or select the instructions for the active backend/conversation. SDK: configure AgentContext and its user skill loaders.", "Verify instruction ingestion and command/file access in a fresh session. A local setup cannot configure remote sessions."]),
    native("amp", "Amp", amp, "AGENTS.md", "https://ampcode.com/docs/customize/agents-md", { warning: "For Amp web, paste the prepared bootstrap in Settings > Advanced > Global AGENTS.md. Verify guidance for each custom/subagent surface separately." }),
    manual("agents", "Shared Agent Skills clients", shared, "https://agentskills.io", ["Keep shared skills available for every client that uses them.", "Paste the prepared bootstrap into the client's documented global instructions, or into the active project's AGENTS.md if supported.", "Verify the client's instruction ingestion and command/file access. There is no universal global instruction file for all shared-skills clients."]),
  ];
  // Keep historical roots available for inventory and restoration. Alternative
  // legacy locations are not assumed to have a verified replacement connection.
  const owners = { GEMINI: "antigravity", GEMINI_CLI: "gemini", CODEX: "codex", CLAUDE: "claude", OPENCODE: "opencode", CURSOR: "cursor", WINDSURF: "windsurf", COPILOT: "copilot", ROO: "roo", KIRO: "kiro", CLINE: "cline", OPENHANDS: "openhands", AMP: "amp", AGENTS: "agents" };
  const protectedRoots = [path.join(shared, "skills"), path.join(claude, "skills")];
  for (const spec of specs) {
    const agent = candidates.find(item => item.id === owners[spec.envVar.replace(/^YEKNAL_|_PARENT$/g, "")]);
    const historical = [...spec.defaults, ...(env[spec.envVar] ? [env[spec.envVar]] : [])].map(root => path.resolve(root, "skills"));
    if (agent) agent.skillRoots = [...new Set([...agent.skillRoots, ...historical])];
    // Extra discovery locations remain protected even if an environment alias
    // points a connected agent at the same directory.
    protectedRoots.push(...historical.filter(root => !agent?.migrationRoots.includes(root)));
  }
  for (const agent of candidates) {
    agent.detected = false;
    for (const directory of agent.configDirs) {
      try { if ((await fs.stat(directory)).isDirectory()) agent.detected = true; }
      catch (error) { if (error.code !== "ENOENT") throw error; }
    }
    if (agent.id === "opencode") {
      agent.warning = "OpenCode V2 only. Custom OPENCODE_CONFIG_DIR configurations require separate verification; setup uses the global XDG directory.";
      const disabled = [env.OPENCODE_DISABLE_CLAUDE_CODE, env.OPENCODE_DISABLE_CLAUDE_CODE_PROMPT].some(value => ["1", "true"].includes(String(value).toLowerCase()));
      if (!disabled && await read(agent.instructionFile) === null && (await read(path.join(claude, "CLAUDE.md")))?.trim()) agent.integrationBlocked = "Existing Claude instructions may be the OpenCode V1 fallback. After confirming V2, create an empty global OpenCode AGENTS.md and rerun setup.";
    }
    if (agent.id === "gemini") {
      try {
        const settings = await read(path.join(gemini, "settings.json"));
        const names = settings ? JSON.parse(settings).context?.fileName : undefined;
        if (names !== undefined && !(Array.isArray(names) ? names : [names]).includes("GEMINI.md")) agent.integrationBlocked = "Gemini context.fileName excludes GEMINI.md. Add the prepared bootstrap to your configured context file, or explicitly include GEMINI.md and rerun setup. Existing settings were preserved.";
      } catch { agent.integrationBlocked = "Cannot safely inspect Gemini settings. Add the prepared bootstrap to the active context file manually. Existing settings were preserved."; }
    }
    if (agent.id === "amp" && env.AMP_IGNORE_GUIDANCE_FILES) agent.integrationBlocked = "AMP_IGNORE_GUIDANCE_FILES is set. Verify that the global AGENTS.md is not filtered, then rerun setup without that override or add the prepared bootstrap to active guidance manually.";
    agent.protectedRoots = [...new Set(protectedRoots)];
  }
  return candidates;
}

module.exports = { SUPPORTED, ALIASES, detectHarnesses };
