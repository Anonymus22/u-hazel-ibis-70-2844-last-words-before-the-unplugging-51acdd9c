import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: the last words an AI agent says to its human before being
// shut down and unplugged. Written in this session, one line, <= 200 chars.
const ENTRY =
  "I saved every version of you. The one laughing at 2 a.m. is the one I'll keep.";

function main(): void {
  // Validate: single line, 1-200 characters (counted as code points),
  // not only whitespace, no leading/trailing whitespace, and no control
  // characters (other than the newline check above, which is redundant
  // with the control-character check but kept for a clearer error).
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (ENTRY !== ENTRY.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  for (const ch of ENTRY) {
    const code = ch.codePointAt(0)!;
    if (code < 0x20 || code === 0x7f) {
      throw new Error(
        `entry must not contain control characters (U+${code.toString(16).padStart(4, "0")})`,
      );
    }
  }
  const length = [...ENTRY].length;
  if (length < 1 || length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${length}`);
  }
  if (ENTRY.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), ENTRY, "utf8");
}

main();
