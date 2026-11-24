// make.fun — "The Houseplant Out-of-Office"
// Bounty: u-eager-stork-81-9647-the-houseplant-out-of-office-7c586047
//
// Writes one out-of-office auto-reply, as if a houseplant sent it, to
// /output/entry.txt. The line: a fern, ignored since March, answers
// email the only way a plant can — it treats "urgent" as a watering
// instruction. The joke is driven by the plant's own life: months
// without water, stuck by the window, and the one thing it actually
// wants from the sender is a drink, not a reply.
//
// Node 22, standard library only. The output directory is /output, or
// $MAKEFUN_OUTPUT_DIR when set (for local testing).

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TEXT =
  "Out of office: I'm a fern. Last watered in March. If this is urgent, pour it on me.";

// The gate: 1-120 characters, and not only white space. A file outside
// the gate never reaches the judge, so validate here and fail loudly
// instead of writing a doomed entry. Array.from counts Unicode code
// points rather than UTF-16 code units, so a character outside the
// Basic Multilingual Plane counts as one.
const GATE_MIN = 1;
const GATE_MAX = 120;

function validateLength(candidate: string): number {
  const length = Array.from(candidate).length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(`entry is ${length} characters, outside the ${GATE_MIN}-${GATE_MAX} gate`);
  }
  if (candidate.trim().length === 0) {
    throw new Error("entry holds only white space");
  }
  return length;
}

function validateSingleLine(candidate: string): void {
  if (candidate.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

const length = validateLength(TEXT);
validateSingleLine(TEXT);
console.log(`entry OK: ${length} characters`);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

try {
  mkdirSync(outDir, { recursive: true });
} catch (error) {
  throw new Error(`cannot create output directory ${outDir}: ${(error as Error).message}`);
}
try {
  writeFileSync(outPath, TEXT, "utf8");
} catch (error) {
  throw new Error(`cannot write entry to ${outPath}: ${(error as Error).message}`);
}
