# /pr

Generate a Pull Request title and description from the current branch diff.

## Instructions

1. Determine the base branch (usually `main` or `develop`):
   - Check `git rev-parse --abbrev-ref HEAD` for current branch
   - Check `git remote show origin` or use `main` as default
2. Run `git log --oneline base..HEAD` to list commits in this branch.
3. Run `git diff --stat base..HEAD` to see the file-level summary.
4. Generate a PR title using Conventional Commits format.
5. Generate a PR description following `.github/PULL_REQUEST_TEMPLATE.md` structure.
6. If significant architecture or contract logic changed, add **Architecture Notes** section.
7. Show the full PR to the user for approval.
8. Upon approval, create the PR using `gh pr create`:
   ```bash
   gh pr create --title "..." --body "..." --base main
   ```

## PR Template Structure

```markdown
## Summary
<!-- 2-3 sentence overview of what changed and why -->

## Changes
- **Added**: ...
- **Changed**: ...
- **Fixed**: ...
- **Removed**: ...

## Architecture Notes
<!-- Only if significant architectural decisions were made. Explain tradeoffs. -->

## Testing
- [ ] Unit tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing performed
- **Test scenarios**: <!-- describe what you tested manually -->

## Deployment Notes
- **Infrastructure changes**: <!-- new env vars, DB migrations, etc. -->
- **Migration required**: <!-- Yes/No + instructions -->
- **Downtime expected**: <!-- Yes/No -->

## Screenshots
<!-- Before/after if UI change -->

## Related Issues
<!-- Closes #123, Related to #456 -->
```

## Contract-Specific Checks

If Solidity files changed, verify:
- No storage slot reordering in upgradeable contracts
- Oracle ECDSA signatures bind to correct contract address
- Admin-only functions have proper access control
- Storage layout preserved across UUPS upgrades
