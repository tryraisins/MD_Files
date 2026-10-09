# Discovery verification failure modes

Recorded before implementing the isolated verification harness. Run the complete
flow with `node tools/verify-discovery.js`. Reports and command logs are written
under the operating system temporary directory, outside user configuration.

- Setup chooses the wrong configuration root or modifies unrelated configuration.
- Repeated setup duplicates routers or instruction blocks; removal deletes a user
  skill or a router that the user customized after setup.
- A previously installed legacy router creates duplicate routing instructions.
- Discovery reads complete skill bodies, returns unlimited metadata, or retrieves
  every resource when a user selects only one skill or supporting file.
- Project skills lose precedence to installed user skills or remote cached copies;
  an installed customized skill is silently replaced.
- A fresh download combines metadata and resources from different revisions,
  leaves a partial destination on failure, or accepts bytes with a wrong hash.
- Remote or resource paths escape the cache through traversal, absolute paths,
  encoded separators, or symlinked parent directories.
- A valid cached load performs unnecessary network requests or stops working when
  offline, catalog metadata expires, a request fails, or GitHub rate limits apply.
- Catalog refresh corrupts the last usable catalog on a failed request.
- References and scripts become inaccessible after loading instructions, or their
  bytes do not match the catalog version.
- Existing `skills` argument handling and project `--add`/sync behavior regress.
- A CLI-only verification is mistaken for proof of actual agent task-time routing.

## Minimal bootstrap and repository scope migration

Recorded before extending the flow verification for this migration:

- An old globally registered router survives setup alongside the new instruction
  block, or a second global router is created.
- Cleanup overlooks shared or agent-specific discovery roots, follows a junction
  outside known roots, or removes a project-local, personal, third-party, or
  merely prefix-matching skill without ownership evidence.
- A canonical folder with mismatched frontmatter is mistaken for catalog content.
- Windows short-name aliases hide a backup/cache root inside a discovery root
  or cause the same discovery directory to be counted or migrated twice.
- Customized catalog instructions or supporting files are lost, backup content
  differs from the original, or removal proceeds after a backup write failure.
- Setup repeats backup entries unnecessarily, loses restoration metadata, or
  restore overwrites a new folder, follows a link, or accepts tampered backups.
- Setup removal deletes customized instruction blocks or deletes migration
  backups needed for an explicit restore.
- Registered metadata measurements count the cache as an active directory or
  report unsupported token savings instead of measured counts and characters.
- One repository's overrides or materialized resources affect another repository,
  or ancestor traversal crosses the actual repository boundary.
- MCP loads against its startup directory instead of a verified client root or
  validated explicit project context.
- Instruction/reference retrieval writes project files outside a repository,
  automatically installs skills, or executable assets cannot use relative files.
- Managed asset cleanup removes customized files or manual installations.
- A simple greeting causes actual agent search/load, or the substantive agent
  demonstration only succeeds because its prompt explicitly forces discovery.

The extended harness uses two actual isolated Git repositories and records
registered metadata before/after migration. Actual agent runs use natural task
prompts with the setup-generated bootstrap copied into an isolated project;
this proves task-time behavior for that controlled setup, not ingestion of the
real user's global configuration or behavior of untested agents.

The harness exercises actual CLI processes for setup, bounded search, cached load,
local precedence, update/cache commands, and legacy argument handling. A local
HTTP fixture is injected into the discovery module's request dependency to prove
fresh transfer and network failure/recovery boundaries without changing the
production GitHub source or accessing real agent configuration. This is isolated
dependency verification, not a claim about public GitHub availability or automatic
behavior inside an installed agent. An actual agent demonstration must be reported
separately.

The default run also verifies the legacy CLI against the public GitHub source,
installing one skill into an isolated temporary Git project. For deterministic CI
or offline fixture runs, use `node tools/verify-discovery.js --skip-live-legacy`.
The report marks that live boundary as skipped and records the exact rerun command.
