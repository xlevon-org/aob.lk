#!/usr/bin/env node
/**
 * SessionStart hook (matcher: compact|resume).
 *
 * stdout is added to Claude's context. It fires when a session restarts after
 * compaction or resume - exactly when summarisation may have dropped facts that
 * are expensive to rediscover, such as which branch is live and whether the
 * working tree is clean.
 *
 * Replaces a Python script written for a different project, which injected
 * "hold/recovery mutations live ONLY in run_engine.py tick-stream exit handler"
 * into every resumed session. None of those files exist here.
 *
 * Design rules, carried over because they were right:
 *  - Only facts read from the live repo. Nothing invented, nothing hardcoded
 *    that could go stale.
 *  - Fail open. Any error prints nothing and exits 0, because a broken context
 *    hook must never stop a session from starting.
 *  - ASCII only. The Windows console is cp1252 and will mangle anything else.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Runs git, returning '' on any failure. Never throws. */
function git(...args) {
  try {
    return execFileSync('git', ['-C', REPO, ...args], {
      encoding: 'utf8',
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

/**
 * Files whose modification changes how the whole site behaves, so an
 * uncommitted edit in one is worth surfacing by name.
 *
 * Chosen from what this repository actually contains: the single source of
 * truth for contact details, the layered-architecture guard, the storefront
 * build config that pins Render's publish directory, and the workspace root.
 */
const HOT_FILES = [
  'apps/web/src/domain/company/CompanyProfile.ts',
  'apps/web/vite.config.ts',
  'apps/web/scripts/check-architecture.mjs',
  'apps/web/scripts/check-responsive.mjs',
  'apps/web/scripts/check-contact-details.mjs',
  'packages/shared/src/index.ts',
  'package.json',
];

function readInvariants() {
  const path = join(REPO, '.claude', 'memory', 'invariants.md');
  if (!existsSync(path)) return [];
  try {
    return readFileSync(path, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => /^\*\*I\d+\*\*/.test(line))
      .slice(0, 8);
  } catch {
    return [];
  }
}

function main() {
  try {
    const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
    if (branch === '') return; // not a repo, or git unavailable: say nothing

    const commit = git('rev-parse', '--short', 'HEAD');
    const subject = git('log', '-1', '--pretty=%s');
    const status = git('status', '--short');
    const changed = status === '' ? [] : status.split('\n');
    const hot = changed.filter((line) => HOT_FILES.some((f) => line.includes(f)));
    const ahead = git('rev-list', '--count', '@{upstream}..HEAD');

    const out = [];
    out.push('=== REPO STATE (re-injected after compact/resume) ===');
    out.push(`Branch: ${branch} @ ${commit} - ${subject}`);
    out.push(`Working tree: ${changed.length} changed file(s)`);
    if (ahead !== '' && ahead !== '0') {
      out.push(`Unpushed commits on this branch: ${ahead}`);
    }
    if (hot.length > 0) {
      out.push('Uncommitted changes in load-bearing files:');
      for (const line of hot.slice(0, 6)) out.push(`  ${line}`);
    }

    const invariants = readInvariants();
    if (invariants.length > 0) {
      out.push('Project invariants (.claude/memory/invariants.md):');
      for (const line of invariants) out.push(`  ${line}`);
    }

    out.push('Before claiming anything works: run `npm run verify` at the repo root.');
    out.push('=== END REPO STATE ===');

    // Force ASCII so a stray character cannot corrupt the injected block.
    process.stdout.write(out.join('\n').replace(/[^\x00-\x7F]/g, '?') + '\n');
  } catch {
    // Deliberately silent.
  }
  process.exit(0);
}

main();
