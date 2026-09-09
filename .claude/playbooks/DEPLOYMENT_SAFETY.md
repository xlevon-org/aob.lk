# Playbook: Deployment Safety

**Use when** shipping anything to the live storefront.

**Commands:** `/deploy` (the gated flow), `/smoke-test` (fast post-deploy check), `/e2e-verify` (deep proof), `/regression`, `/evaluate`.

**Rule zero:** a push to `master` deploys the live site. There is no staging environment and no manual approval step on Render's side   the push *is* the deploy. Nothing goes without `npm run verify` green and explicit approval in the conversation.

---

## The topology, as verified

- Render builds from the **repository root**: `npm install && npm run build`, publishing `dist/`.
- Configured in the Render dashboard, **not** in a `render.yaml` in this repository. Nothing in the repo will remind you of this.
- The root `build` script delegates to `@zovax/web`, whose `vite.config.ts` pins `build.outDir` to the repository root `dist/`.
- Branch: `master`. There is no `main`.

**The trap this encodes:** moving the storefront into `apps/web` would have made the build emit to `apps/web/dist` and left Render publishing a directory that no longer existed. The site would have gone blank on the next push, with every test still green. The output path was pinned instead, and the fix was proven by the post-move build emitting *identical asset hashes* to the pre-move one.

Anything that changes where the build writes is a deployment change, however local it looks.

## Before pushing

1. `npm run verify` at the root   typecheck, three fitness functions, all tests. Paste the counts.
2. `npm run build`   confirm `dist/index.html`, `dist/assets/`, `dist/logo/`, `dist/products/` all exist.
3. Compare asset hashes with the previous build. Unchanged hashes prove a refactor was genuinely a no-op   and are a warning when the change was meant to be visible.
4. `git log --oneline master..HEAD` and `git diff master...HEAD --stat`: know exactly what ships.
5. State it, and get explicit approval. No approval means stop at "prepared".

## Merging

```
git checkout master
git merge --no-ff <branch> -m "<why this ships>"
npm run verify      # again, on the merged tree
npm run build
git push origin master
```

Verify **after** merging as well. A merge that resolves cleanly can still be broken   two changes each correct alone can contradict each other.

Push the feature branch too, so both it and the merge exist on the remote.

## After pushing

Do not report "deployed". Confirm:

- the live URL returns 200 and serves the new asset hashes
- home, catalogue and a product page render, with no console errors and no broken images
- no horizontal scroll at 375 and 1280

## Rollback

Revert the offending commit on `master` and push   a clean redeploy of the previous good state. **Never force-push `master`**; the deploy follows the branch tip, and rewriting history makes the live state ambiguous.

## Secrets

Never committed. `.env*` is gitignored except `.env.example`. Real values live in the Render dashboard and, for the API, in its own environment. Never echo one into a log, a commit message or a chat message.
