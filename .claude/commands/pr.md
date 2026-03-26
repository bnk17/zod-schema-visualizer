Prepare and open a pull request for the current branch.

## Steps

1. Run `git diff main...HEAD --stat` to understand what changed.
2. Run `bun vitest --run` to verify all unit/integration tests pass.
3. Run `bun run lint` to verify no lint errors.
4. Read `agent_docs/pr_template.md` for the required PR format.
5. Run `git log main...HEAD --oneline` to list commits on this branch.
6. Read each changed file to understand the full scope.
7. Draft the PR using the template from `agent_docs/pr_template.md`. Be specific — reference file names, function names, and the "why" behind each change.
8. Create the PR with: `gh pr create --title "..." --body "..."`

## Rules
- If tests fail: stop, report which tests failed, do NOT open the PR.
- If lint fails: stop, fix the lint errors first, then re-run.
- PR title: conventional commit format — `feat(scope): short description` (max 70 chars)
- Keep the summary factual — no marketing language.
- Target branch: `main`
