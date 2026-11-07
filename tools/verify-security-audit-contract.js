#!/usr/bin/env node
"use strict";

// End-to-end check for the shipped security-audit validators: runs both CLIs on
// generated fixtures that exercise the evidence contract, and asserts the exit
// code and the diagnostic each case must produce. No unit tests, no mocks.

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SKILL = path.join(ROOT, "skills", "yeknal-security-audit");
const FINDINGS_VALIDATOR = path.join(SKILL, "scripts", "validate-findings.cjs");
const LEDGER_VALIDATOR = path.join(SKILL, "scripts", "validate-coverage-ledger.cjs");

function confirmedRecord(overrides = {}) {
  return {
    verdict: "confirmed",
    fingerprint: "authz/orders/get-order-id",
    title: "Any authenticated user can read another tenant's order",
    description: "GET /orders/:id loads the order by primary key and never compares its tenant.",
    root_cause: "Route access is authorized, object-level tenant binding is omitted.",
    intended_behavior: "The order tenant must equal the session tenant before any field is returned.",
    trace: [
      {
        kind: "entrypoint",
        file: "src/routes/orders.js",
        line: 12,
        scope: "router.get('/orders/:id')",
        description: "Authenticated route accepts an attacker-chosen id.",
      },
      {
        kind: "sink",
        file: "src/db/orders.js",
        line: 8,
        scope: "findById",
        description: "The row is selected by id with no tenant predicate.",
      },
    ],
    evidence: [
      { file: "src/routes/orders.js", line: 12, description: "requireAuth only." },
      { file: "src/db/orders.js", line: 8, description: "No tenant clause." },
    ],
    conditions: [
      { kind: "authentication_level", description: "Any authenticated user of any tenant." },
    ],
    execution: {
      method: "source",
      policy: "source-only-no-sandbox",
      attacker_perspective: "An authenticated tenant A user requesting tenant B's order id.",
      instructions: ["Read the traced route and data-layer lines."],
      observed_result:
        "Source-established (not executed): the handler returns the row selected by id with no tenant comparison.",
    },
    remediation: { strategy: "Bind the query to the caller's tenant and add a cross-tenant regression test." },
    severity: {
      likelihood: { score: "high", reason: "Any authenticated user can enumerate ids." },
      impact: { score: "high", reason: "Cross-tenant read of order data." },
      overall_severity: "high",
    },
    confidence: { score: "high", reason: "The path is short and no intervening control exists." },
    ...overrides,
  };
}

function ledgerUnit(overrides = {}) {
  const canonicalRefs = {
    surface: "src/routes/orders.js#GET /orders/:id",
    boundary: "src/authz.js#requireTenant",
    subsystem: "packages/api",
    attack_class: "ATTACK-CLASSES.md#Access control",
  };
  const { canonicalCoverageId } = require(LEDGER_VALIDATOR);
  return {
    coverage_id: canonicalCoverageId(canonicalRefs),
    canonical_refs: canonicalRefs,
    surface: canonicalRefs.surface,
    boundary: canonicalRefs.boundary,
    subsystem: canonicalRefs.subsystem,
    attack_class: canonicalRefs.attack_class,
    starting_paths: ["src/routes/orders.js"],
    ordinary_attack_class_block: "ATTACK-CLASSES.md#Access control",
    selected_companion_blocks: [],
    excluded_blocks: [],
    prior_status: "none",
    attempts: [],
    wave: 1,
    status: "planned",
    agent_id: null,
    reviewed_paths: [],
    local_checks: [],
    result_fingerprints: [],
    unresolved: [],
    ...overrides,
  };
}

const cases = [
  {
    name: "source-established confirmed record is accepted",
    validator: FINDINGS_VALIDATOR,
    value: [confirmedRecord()],
    exit: 0,
    expect: "PASS",
  },
  {
    name: "executed confirmed record is accepted",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        fingerprint: "session/fixation/regenerate",
        execution: {
          method: "local",
          policy: "trusted-local-opt-in",
          attacker_perspective: "An attacker who planted a session id before login.",
          payloads: ["node --test test/session.test.js"],
          instructions: ["Run the repository's existing test suite."],
          observed_result: "The session id was identical before and after a successful login.",
        },
      }),
    ],
    exit: 0,
    expect: "PASS",
  },
  {
    name: "source record cannot claim an executed payload",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "source",
          policy: "source-only-no-sandbox",
          attacker_perspective: "Attacker.",
          payloads: ["curl /orders/123"],
          instructions: ["Trace the handler."],
          observed_result: "Source-established (not executed): trace only.",
        },
      }),
    ],
    exit: 1,
    expect: "must not claim an executed payload",
  },
  {
    name: "source record cannot invent an observed runtime result",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "source",
          policy: "source-only-no-sandbox",
          attacker_perspective: "Attacker.",
          instructions: ["Trace the handler."],
          observed_result: "I ran the app and got another tenant's order back.",
        },
      }),
    ],
    exit: 1,
    expect: "a source-established record must start with",
  },
  {
    name: "source record cannot use an execution policy",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "source",
          policy: "trusted-local-opt-in",
          attacker_perspective: "Attacker.",
          instructions: ["Trace the handler."],
          observed_result: "Source-established (not executed): trace only.",
        },
      }),
    ],
    exit: 1,
    expect: 'a source-established record requires policy "source-only-no-sandbox"',
  },
  {
    name: "executed record cannot use the source-only policy",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "local",
          policy: "source-only-no-sandbox",
          attacker_perspective: "Attacker.",
          payloads: ["node --test"],
          instructions: ["Run the test."],
          observed_result: "Same session id.",
        },
      }),
    ],
    exit: 1,
    expect: 'cannot use policy "source-only-no-sandbox"',
  },
  {
    name: "executed record requires a payload or command",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "local",
          policy: "trusted-local-opt-in",
          attacker_perspective: "Attacker.",
          payloads: [],
          instructions: ["Run the test."],
          observed_result: "Same session id.",
        },
      }),
    ],
    exit: 1,
    expect: "requires at least one payload",
  },
  {
    name: "executed record cannot use the source-only prefix",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "local",
          policy: "trusted-local-opt-in",
          attacker_perspective: "Attacker.",
          payloads: ["node --test"],
          instructions: ["Run the test."],
          observed_result: "Source-established (not executed): trace only.",
        },
      }),
    ],
    exit: 1,
    expect: "an executed record must not use the source-only prefix",
  },
  {
    name: "record without a method or policy is rejected",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          attacker_perspective: "Attacker.",
          payloads: ["node --test"],
          instructions: ["Trace the handler."],
          observed_result: "Same session id.",
        },
      }),
    ],
    exit: 1,
    expect: "missing required field",
  },
  {
    name: "executed record contradicts a source-only run",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "local",
          policy: "trusted-local-opt-in",
          attacker_perspective: "Attacker.",
          payloads: ["node --test"],
          instructions: ["Run the test."],
          observed_result: "Same session id.",
        },
      }),
    ],
    metadata: { execution_policy: "source-only-no-sandbox" },
    exit: 1,
    expect: 'a run declared "source-only-no-sandbox" cannot contain an executed record',
  },
  {
    name: "source record in a source-only run is accepted",
    validator: FINDINGS_VALIDATOR,
    value: [confirmedRecord()],
    metadata: { execution_policy: "source-only-no-sandbox" },
    exit: 0,
    expect: "PASS",
  },
  {
    name: "source record inside an execution-authorized run is accepted",
    validator: FINDINGS_VALIDATOR,
    value: [confirmedRecord()],
    metadata: { execution_policy: "trusted-local-opt-in" },
    exit: 0,
    expect: "PASS",
  },
  {
    name: "executed record matching a trusted-local run is accepted",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "local",
          policy: "trusted-local-opt-in",
          attacker_perspective: "Attacker.",
          payloads: ["node --test"],
          instructions: ["Run the test."],
          observed_result: "Same session id.",
        },
      }),
    ],
    metadata: { execution_policy: "trusted-local-opt-in" },
    exit: 0,
    expect: "PASS",
  },
  {
    name: "executed record cannot misstate the run policy",
    validator: FINDINGS_VALIDATOR,
    value: [
      confirmedRecord({
        execution: {
          method: "local",
          policy: "trusted-local-opt-in",
          attacker_perspective: "Attacker.",
          payloads: ["node --test"],
          instructions: ["Run the test."],
          observed_result: "Same session id.",
        },
      }),
    ],
    metadata: { execution_policy: "sandboxed-local-only" },
    exit: 1,
    expect: "must equal the run policy",
  },
  {
    name: "unknown run policy is rejected",
    validator: FINDINGS_VALIDATOR,
    value: [confirmedRecord()],
    metadata: { execution_policy: "sandboxed-please" },
    exit: 1,
    expect: "execution_policy must be one of",
  },
  {
    name: "non-array findings fail cleanly even with run metadata",
    validator: FINDINGS_VALIDATOR,
    value: { not: "an array" },
    metadata: { execution_policy: "source-only-no-sandbox" },
    exit: 1,
    expect: "expected array",
  },
  {
    name: "planned coverage unit is accepted",
    validator: LEDGER_VALIDATOR,
    value: [ledgerUnit()],
    exit: 0,
    expect: "PASS",
  },
  {
    name: "unknown ledger status is rejected",
    validator: LEDGER_VALIDATOR,
    value: [ledgerUnit({ status: "finished" })],
    exit: 1,
    expect: 'invalid value "finished"',
  },
];

function run(testCase) {
  const args = [testCase.validator, testCase.path];
  if (testCase.metadataPath) args.push(testCase.metadataPath);
  return spawnSync(process.execPath, args, { encoding: "utf8" });
}

function main() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "security-audit-contract-"));
  let failures = 0;
  try {
    cases.forEach((testCase, index) => {
      const filePath = path.join(dir, `case-${index}.json`);
      fs.writeFileSync(filePath, JSON.stringify(testCase.value, null, 2));
      let metadataPath;
      if (testCase.metadata) {
        metadataPath = path.join(dir, `case-${index}-metadata.json`);
        fs.writeFileSync(metadataPath, JSON.stringify(testCase.metadata, null, 2));
      }
      const result = run({ validator: testCase.validator, path: filePath, metadataPath });
      const output = `${result.stdout || ""}${result.stderr || ""}`;
      const exitOk = result.status === testCase.exit;
      const outputOk = output.includes(testCase.expect);
      if (!exitOk || !outputOk) {
        failures += 1;
        console.error(`FAIL ${testCase.name}`);
        console.error(`  exit ${result.status}, expected ${testCase.exit}`);
        console.error(`  output: ${output.trim().split("\n").join(" | ")}`);
      } else {
        console.log(`PASS ${testCase.name}`);
      }
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }

  if (failures > 0) {
    console.error(`\n${failures} of ${cases.length} contract cases failed`);
    process.exit(1);
  }
  console.log(`\nAll ${cases.length} security-audit contract cases passed`);
}

main();
