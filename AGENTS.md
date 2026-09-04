<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git workflow

## Branch naming

`<type>/<short-slug>`, or `<type>/<issue-id>-<short-slug>` when the work maps
to a tracked issue (issue id lowercase, e.g. `feature/sof-142-mission-scrub`).

`<type>` is one of:

- `feature` — new functionality
- `fix` — bug fix
- `refactor` — code change with no behavior change
- `docs` — documentation only
- `test` — tests only
- `chore` — tooling, deps, formatting, other maintenance

Slugs are lowercase kebab-case, short enough to read in a branch list
(3–5 words). No personal prefixes, no dates.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/):
`<type>(<scope>): <summary>`, imperative mood, summary under ~72 chars.
Scope is optional — the touched area when it adds clarity (`feat(mission): …`).
Body explains *why*, not what (the diff already shows what). Breaking changes
get a `BREAKING CHANGE:` footer or a `!` after the type.

Keep unrelated churn (e.g. a full-repo `pnpm format` run) in its own `chore`
commit rather than mixed into a feature commit — see
[[pnpm-format-repo-wide]] in memory.

## Pull requests

- **Title**: same shape as a commit summary — `<type>: <short description>`,
  under ~70 chars, no trailing period.
- **Target**: open against `main` unless told otherwise.
- **Description** (use a template like this):

  ```markdown
  ## Summary
  - 1–3 bullets on what changed and why (why belongs here, not just in commits)

  ## Test plan
  - [ ] What was checked and how (manual verification, screenshots, `pnpm build`, etc.)
  ```

- **Size**: prefer small, single-purpose PRs over bundling unrelated work —
  easier to review, easier to revert.
- **State**: open ready-for-review (non-draft) once self-verified (lint,
  typecheck, and a manual check of the actual UI change); use draft only for
  early feedback on in-progress work.
- **Linking**: reference the tracked issue in the description (`Closes #123`
  or the tracker's own syntax) rather than only in the branch name.
- Never force-push over a PR others have already reviewed without flagging it
  first.
