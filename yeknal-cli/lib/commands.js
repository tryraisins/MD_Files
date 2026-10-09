"use strict";

const { createDiscovery } = require("./discovery");

function parseOptions(args, allowed) {
  const values = [];
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith("--")) { values.push(arg); continue; }
    const [name, inline] = arg.slice(2).split(/=(.*)/s);
    if (!Object.hasOwn(allowed, name)) throw new Error(`Unknown option --${name}.`);
    if (allowed[name] === "boolean") {
      if (inline !== undefined) throw new Error(`--${name} does not take a value.`);
      options[name] = true;
    } else {
      const value = inline === undefined ? args[++i] : inline;
      if (!value || value.startsWith("--")) throw new Error(`--${name} requires a value.`);
      options[name] = value;
    }
  }
  return { values, options };
}

async function runDiscoveryCommand(command, args) {
  const allowed = { json: "boolean", offline: "boolean" };
  if (command === "search") allowed.limit = "value";
  if (command === "load") {
    allowed["all-resources"] = "boolean";
    allowed.materialize = "boolean";
    allowed.revision = "value";
  }
  const { values, options } = parseOptions(args, allowed);
  const discovery = createDiscovery({ offline: options.offline || process.env.YEKNAL_OFFLINE === "1" });
  let result;
  if (command === "search") {
    if (!values.length) throw new Error("Usage: yeknal search <query> [--limit 8] [--json] [--offline]");
    const limit = options.limit === undefined ? 8 : Number(options.limit);
    if (!Number.isInteger(limit) || limit < 1 || limit > 20) throw new Error("--limit must be an integer between 1 and 20.");
    result = await discovery.search(values.join(" "), { limit });
    const status = await discovery.status();
    if (status.lastError) console.error(`Notice: using available skill metadata. ${status.lastError}`);
  } else if (command === "load") {
    if (!values.length || values.length > 2) throw new Error("Usage: yeknal load <name> [resource] [--materialize | --all-resources] [--revision SHA] [--json] [--offline]");
    if (options.revision && !/^[a-f0-9]{40}$/.test(options.revision)) throw new Error("--revision must be a full immutable Git commit SHA.");
    result = options.materialize || options["all-resources"]
      ? await discovery.materialize(values[0], { revision: options.revision, resource: values[1] || "SKILL.md" })
      : await discovery.load(values[0], values[1], { revision: options.revision });
    if (result.warning) console.error(`Notice: ${result.warning}`);
  } else if (command === "resources") {
    if (values.length !== 1 || values[0] !== "clean") throw new Error("Usage: yeknal resources clean [--json]");
    result = await discovery.cleanResources();
  } else if (command === "update") {
    if (values.length) throw new Error("Usage: yeknal update [--json]");
    result = await discovery.update();
  } else {
    if (values.length && (values.length !== 1 || values[0] !== "status")) throw new Error("Usage: yeknal cache [status] [--json]");
    result = await discovery.status();
  }
  if (options.json) console.log(JSON.stringify(result, null, 2));
  else if (command === "load") {
    console.log(`Skill: ${result.name}\nSource: ${result.source}\nPath: ${result.path}`);
    if (result.sourceRevision) console.log(`Revision: ${result.sourceRevision}`);
    console.log(result.content);
    if (result.resources?.length) console.log(`\nResources: ${result.resources.join(", ")}`);
  } else console.log(JSON.stringify(result, null, 2));
}

module.exports = { runDiscoveryCommand };
