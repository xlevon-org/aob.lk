#!/usr/bin/env node
/**
 * Tests for the hook scripts.
 *
 * These run on every tool call once wired, so they are tested against the
 * failure paths rather than the happy one. A gate that blocks a legitimate
 * write is worse than no gate at all: it stops work and its output looks
 * authoritative while being wrong.
 *
 * Run: node --test .claude/scripts/hooks.test.mjs
 */
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..');
const PREWRITE = join(HERE, 'verify-prewrite.mjs');
const INJECTOR = join(HERE, 'state-injector.mjs');

const ALLOW = 0;
const BLOCK = 2;

/** Runs a hook with the given stdin, returning { status, stdout, stderr }. */
function runHook(script, stdin, cwd = REPO) {
  const result = spawnSync(process.execPath, [script], {
    input: stdin,
    encoding: 'utf8',
    cwd,
    timeout: 15000,
  });
  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

const write = (file_path, content) =>
  JSON.stringify({ tool_name: 'Write', tool_input: { file_path, content } });

// ---------------------------------------------------------------------------

describe('verify-prewrite: JSON validity', () => {
  test('valid JSON is allowed', () => {
    const r = runHook(PREWRITE, write('package.json', '{"name":"x","version":"1.0.0"}'));
    assert.equal(r.status, ALLOW);
    assert.equal(r.stderr, '');
  });

  test('pretty-printed valid JSON is allowed', () => {
    const r = runHook(PREWRITE, write('tsconfig.json', '{\n  "compilerOptions": {\n    "strict": true\n  }\n}'));
    assert.equal(r.status, ALLOW);
  });

  test('a trailing comma is blocked', () => {
    const r = runHook(PREWRITE, write('package.json', '{"name":"x",}'));
    assert.equal(r.status, BLOCK);
    assert.match(r.stderr, /not valid JSON/);
    assert.match(r.stderr, /package\.json/);
  });

  test('an unterminated object is blocked', () => {
    const r = runHook(PREWRITE, write('a.json', '{"name": "x"'));
    assert.equal(r.status, BLOCK);
  });

  test('a bare word is blocked', () => {
    const r = runHook(PREWRITE, write('a.json', 'not json at all'));
    assert.equal(r.status, BLOCK);
  });

  test('empty content is allowed - an empty file is legitimate', () => {
    assert.equal(runHook(PREWRITE, write('a.json', '')).status, ALLOW);
    assert.equal(runHook(PREWRITE, write('a.json', '   \n  ')).status, ALLOW);
  });

  test('a JSON array at the top level is allowed', () => {
    assert.equal(runHook(PREWRITE, write('a.json', '[1,2,3]')).status, ALLOW);
  });

  test('a non-.json file with broken JSON inside is allowed', () => {
    // The rule is about the file's format, not its contents.
    const r = runHook(PREWRITE, write('notes.md', 'Here is broken json: {"a":'));
    assert.equal(r.status, ALLOW);
  });
});

describe('verify-prewrite: literal undefined in JSX attributes', () => {
  test('a double-quoted undefined attribute is blocked', () => {
    const r = runHook(PREWRITE, write('C.tsx', '<div className="undefined" />'));
    assert.equal(r.status, BLOCK);
    assert.match(r.stderr, /className/);
  });

  test('a braced undefined attribute is blocked', () => {
    const r = runHook(PREWRITE, write('C.tsx', '<div className={undefined} />'));
    assert.equal(r.status, BLOCK);
  });

  test('the reported line number is correct', () => {
    const content = 'line1\nline2\n<div id="undefined" />\n';
    const r = runHook(PREWRITE, write('C.tsx', content));
    assert.equal(r.status, BLOCK);
    assert.match(r.stderr, /line 3/);
  });

  test('a legitimate component is allowed', () => {
    const content = 'export function C() {\n  return <div className="p-4">hi</div>;\n}\n';
    assert.equal(runHook(PREWRITE, write('C.tsx', content)).status, ALLOW);
  });

  test('the word undefined in ordinary code is allowed', () => {
    // `x === undefined` and `let y = undefined` are normal TypeScript.
    const content = 'const a = undefined;\nif (b === undefined) return;\n';
    assert.equal(runHook(PREWRITE, write('C.tsx', content)).status, ALLOW);
  });

  test('undefined inside a string that is not an attribute is allowed', () => {
    const content = 'const message = "value is undefined";\n';
    assert.equal(runHook(PREWRITE, write('C.tsx', content)).status, ALLOW);
  });

  test('the check does not apply to .ts files', () => {
    // Not JSX, so the pattern cannot mean what it means in a component.
    assert.equal(runHook(PREWRITE, write('a.ts', 'const x = {className:"undefined"};')).status, ALLOW);
  });
});

describe('verify-prewrite: fails open on everything unexpected', () => {
  const allowCases = [
    ['a non-Write tool', JSON.stringify({ tool_name: 'Edit', tool_input: { file_path: 'a.json', content: '{' } })],
    ['a Read', JSON.stringify({ tool_name: 'Read', tool_input: { file_path: 'a.json' } })],
    ['missing tool_input', JSON.stringify({ tool_name: 'Write' })],
    ['null tool_input', JSON.stringify({ tool_name: 'Write', tool_input: null })],
    ['missing file_path', JSON.stringify({ tool_name: 'Write', tool_input: { content: '{' } })],
    ['non-string file_path', JSON.stringify({ tool_name: 'Write', tool_input: { file_path: 42, content: '{' } })],
    ['non-string content', JSON.stringify({ tool_name: 'Write', tool_input: { file_path: 'a.json', content: 42 } })],
    ['missing content', JSON.stringify({ tool_name: 'Write', tool_input: { file_path: 'a.json' } })],
    ['empty object', '{}'],
    ['a JSON array payload', '[]'],
    ['stdin that is not JSON', 'this is not json'],
    ['empty stdin', ''],
    ['whitespace stdin', '   \n\t '],
    ['a JSON null payload', 'null'],
  ];

  for (const [name, stdin] of allowCases) {
    test(`${name} is allowed`, () => {
      const r = runHook(PREWRITE, stdin);
      assert.equal(r.status, ALLOW, `blocked with: ${r.stderr}`);
    });
  }

  test('a very large valid payload is still handled', () => {
    const big = JSON.stringify({ data: 'x'.repeat(500_000) });
    const r = runHook(PREWRITE, write('big.json', big));
    assert.equal(r.status, ALLOW);
  });

  test('a very large INVALID payload is blocked, not hung', () => {
    const r = runHook(PREWRITE, write('big.json', '{"a":' + '"x",'.repeat(50_000)));
    assert.equal(r.status, BLOCK);
  });
});

// ---------------------------------------------------------------------------

describe('state-injector', () => {
  test('exits 0 and reports the real branch inside the repo', () => {
    const r = runHook(INJECTOR, '');
    assert.equal(r.status, 0);
    assert.match(r.stdout, /=== REPO STATE/);
    assert.match(r.stdout, /Branch: /);
    assert.match(r.stdout, /=== END REPO STATE ===/);
  });

  test('the branch it reports matches git', () => {
    const actual = spawnSync('git', ['-C', REPO, 'rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
    }).stdout.trim();
    const r = runHook(INJECTOR, '');
    assert.match(r.stdout, new RegExp(`Branch: ${actual.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} @`));
  });

  test('output is pure ASCII, so a cp1252 console cannot mangle it', () => {
    const r = runHook(INJECTOR, '');
    // eslint-disable-next-line no-control-regex
    assert.ok(!/[^\x00-\x7F]/.test(r.stdout), 'non-ASCII byte in injected context');
  });

  test('it is cwd-independent - it reports the repo it lives in', () => {
    // The hook resolves the repository from its own location rather than the
    // working directory, so it cannot be fooled by being invoked from
    // elsewhere. That is the property worth locking in.
    const here = runHook(INJECTOR, '', REPO);
    const elsewhere = runHook(INJECTOR, '', process.env.TEMP || '/tmp');
    assert.equal(elsewhere.status, 0);
    assert.equal(
      elsewhere.stdout.split(String.fromCharCode(10))[1],
      here.stdout.split(String.fromCharCode(10))[1],
      'reported a different branch when run from another directory',
    );
  });

  test('copied outside any repository it prints nothing and still exits 0', () => {
    // The fail-open path: git returns nothing, so the hook must stay silent
    // rather than emit a half-built block or crash the session start.
    const sandbox = mkdtempSync(join(tmpdir(), 'zovax-hook-'));
    try {
      const nested = join(sandbox, 'a', 'b');
      mkdirSync(nested, { recursive: true });
      const copy = join(nested, 'state-injector.mjs');
      copyFileSync(INJECTOR, copy);
      const r = runHook(copy, '', sandbox);
      assert.equal(r.status, 0);
      assert.equal(r.stdout.trim(), '');
    } finally {
      rmSync(sandbox, { recursive: true, force: true });
    }
  });

  test('it ignores stdin entirely', () => {
    const r = runHook(INJECTOR, 'garbage that is not json');
    assert.equal(r.status, 0);
    assert.match(r.stdout, /=== REPO STATE/);
  });

  test('it never mentions the previous project', () => {
    // The script it replaces injected run_engine.py and tick-stream facts.
    const r = runHook(INJECTOR, '');
    for (const stale of ['run_engine', 'parity_predictor', 'prime-app-1', 'tick-stream']) {
      assert.ok(!r.stdout.includes(stale), `injected stale reference: ${stale}`);
    }
  });
});
