---
description: Ship to Render through the gates - verify, merge to master, confirm the deploy.
argument-hint: "[prepare|deploy|verify|rollback] (default: prepare - run gates, do not push)"
---

Invoke the `deploy` skill for: `$ARGUMENTS`

A push to `master` deploys the live site. Default to prepare; never push without explicit approval in this conversation.
