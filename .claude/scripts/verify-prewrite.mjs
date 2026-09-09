#!/usr/bin/env node
/**
 * PreToolUse gate (matcher: Write).
 *
 * Blocks a Write whose content is provably broken, before it reaches disk.
 * Exit 2 blocks and feeds stderr back to Claude; exit 0 allows.
 *
 * The Python original compiled .py files. There is no Python here, so it fired
 * on nothing. This checks what this repository can actually be broken by.
 *
 * WHAT IS CHECKED, AND WHY ONLY THIS
 * ----------------------------------
 * 1. JSON that does not parse. package.json, tsconfig.json and package-lock.json
 *    are load-bearing: a malformed one breaks `npm install` for everybody, and
 *    the failure surfaces far from the edit that caused it.
 *
 * 2. A literal `undefined` where a JSX attribute value belongs. This is not
 *    hypothetical - a script in this repository twice replaced a className with
 *    the string "undefined" while rewriting components, and it type-checked.
 *
 * Deliberately NOT checked: TypeScript syntax. Compiling TS per write costs
 * seconds, and `npm run typecheck` already covers it at a sane moment. A gate
 * that makes every edit slow gets disabled, and a disabled gate checks nothing.
 *
 * FAIL OPEN. Any malfunction of this gate exits 0. It must never be the reason
 * legitimate work cannot proceed.
 */

const BLOCK = 2;
const ALLOW = 0;

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    let settled = false;
    const done = () => { if (!settled) { settled = true; resolve(data); } };
    // If stdin never closes, allow rather than hang the tool call.
    const timer = setTimeout(done, 2000);
    timer.unref?.();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => { data += chunk; });
    process.stdin.on('end', () => { clearTimeout(timer); done(); });
    process.stdin.on('error', () => { clearTimeout(timer); done(); });
  });
}

function block(message) {
  process.stderr.write(`[PREWRITE GATE] ${message}\n`);
  process.exit(BLOCK);
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    process.exit(ALLOW);
  }

  const tool = payload?.tool_name ?? '';
  const input = payload?.tool_input ?? {};
  const filePath = typeof input.file_path === 'string' ? input.file_path : '';
  const content = input.content;

  if (tool !== 'Write' || filePath === '' || typeof content !== 'string') {
    process.exit(ALLOW);
  }

  // --- 1. JSON must parse -------------------------------------------------
  if (filePath.endsWith('.json')) {
    // An empty file is legitimate for some tools; only non-empty content is
    // required to be valid JSON.
    if (content.trim() !== '') {
      try {
        JSON.parse(content);
      } catch (error) {
        block(
          `${filePath} is not valid JSON: ${error.message}. ` +
          'Fix the syntax and retry the Write.',
        );
      }
    }
  }

  // --- 2. No literal "undefined" as a JSX attribute value -----------------
  if (/\.(tsx|jsx)$/.test(filePath)) {
    const match = content.match(/\b(\w+)=(?:"undefined"|'undefined'|\{undefined\})/);
    if (match) {
      const line = content.slice(0, match.index).split('\n').length;
      block(
        `${filePath} line ${line}: attribute \`${match[1]}\` is set to the literal ` +
        'value undefined, which renders as a broken attribute rather than ' +
        'omitting it. This is usually a string-replacement that lost its value. ' +
        'Write the real value, or omit the attribute.',
      );
    }
  }

  process.exit(ALLOW);
}

main().catch(() => process.exit(ALLOW));
