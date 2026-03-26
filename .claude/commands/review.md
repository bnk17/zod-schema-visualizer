Perform a portfolio-grade code review of the current git diff.

## Steps

1. Run `git diff HEAD` to see all uncommitted changes. If clean, run `git diff HEAD~1` to review the last commit.
2. Read each changed file in full to understand context.
3. Evaluate through a CTO/senior-lead hiring lens:

**TypeScript**
- Any `any`, unsound casts, or weakened types?
- Are generics used correctly? Is inference leveraged or fought?

**React**
- Controlled vs uncontrolled components correct?
- Unnecessary re-renders, stale closures, misused hooks?
- Accessibility: roles, labels, keyboard nav?

**Core logic (parse-schema.ts / field mappers)**
- Is the Zod type narrowing exhaustive?
- Are error paths handled without silent failures?

**Tests**
- Do tests cover the new code paths?
- Are they testing behavior (not implementation)?

## Output format
- **Files reviewed:** list with line counts
- **Issues:** ranked list — `[CRITICAL]`, `[WARN]`, `[NITPICK]` — each with `file:line` reference
- **Missed test coverage:** specific branches/paths not tested
- **Ready to commit?** YES / NO + one-line reason
