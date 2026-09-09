---
name: deploy
description: Ship ZOVAX to Render through the gates - verify, get explicit approval, merge to master, re-verify the merged tree, push, then confirm the live site. Use only when shipping; a push to master deploys the live storefront and there is no staging environment.
---

# Deploy

**A push to `master` deploys the live storefront.** Render builds from the repository root and publishes `dist/`, configured in the Render dashboard rather than in a `render.yaml` here. There is no staging environment and no manual approval on Render's side: the push *is* the deploy.

Default action is **prepare** - run the gates and stop. Never push without explicit approval in the current conversation.

## The topology, as verified

- Render builds from the **repository root**: `npm install && npm run build`, publishing `dist/`.
- The root `build` script delegates to `@zovax/web`, whose `vite.config.ts` pins `build.outDir` to the repository root `dist/`.
- Branch: `master`. There is no `main`. Feature work merges with `--no-ff`.

**The trap this encodes:** moving the storefront into `apps/web` would have made the build emit to `apps/web/dist`, leaving Render publishing a directory that no longer existed. The site would have gone blank on the next push with every test still green. Anything that changes where the build writes is a deployment change, however local it looks.

## 1. Prepare

```
npm run verify        # all workspaces
npm run build         # must emit dist/index.html, assets/, logo/, products/
git log --oneline master..HEAD
git diff master...HEAD --stat
```

Compare asset hashes with the previous build. Unchanged hashes prove a refactor was a no-op - and are a warning when the change was meant to be visible.

## 2. Approval

State the branch, the commit range, and a one-line summary of what changes for a visitor. Wait for a clear go-ahead. No approval means stop at "prepared".

## 3. Deploy

```
git checkout master
git merge --no-ff <branch> -m "<why this ships>"
npm run verify        # again, on the MERGED tree
npm run build
git push origin master
```

Verify after merging as well: a merge that resolves cleanly can still be broken, because two changes each correct alone can contradict each other.

Push the feature branch too, so both it and the merge exist on the remote.

## 4. Confirm

Do not report "deployed". Confirm it:

- the live URL returns 200 and serves the new asset hashes
- home, catalogue and a product page render, with no console errors and no broken images
- no horizontal scroll at 375 and 1280

## 5. Rollback

Revert the offending commit on `master` and push - a clean redeploy of the previous good state. **Never force-push `master`**; the deploy follows the branch tip, and rewriting history makes the live state ambiguous.

## Rules

- Never push unverified code. A red gate blocks the deploy, no exceptions.
- Never commit or echo a secret. `.env*` is gitignored except `.env.example`.
- If the build output goes anywhere other than the root `dist/`, the deploy is broken even though every test passed.
