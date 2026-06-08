# /commit

Generate a Conventional Commit message from staged changes.

## Instructions

1. Run `git diff --staged` to inspect what's changed.
2. If no files are staged, run `git add .` to stage all changes first (excluding any files in `.gitignore`).
3. If still nothing to commit, respond "No changes to commit."
4. Generate a commit message following **Conventional Commits** format: `type(scope): description`
5. Include a body with bullet points of key changes (max 5 bullets).
6. Show the proposed message to the user for approval.
7. Upon approval, run `git commit -m "..."`.

## Type Rules

- `feat:` — New feature or functionality
- `fix:` — Bug fix
- `refactor:` — Code restructuring (no behavior change)
- `test:` — Tests added or updated
- `docs:` — Documentation only
- `chore:` — Maintenance (deps, build, config)
- `ci:` — CI/CD changes
- `style:` — Formatting, whitespace (rarely used)

## Scope Rules

Use short, lowercase scope matching the area changed:
- `contracts` — Solidity contracts
- `api` — API routes
- `ui` — Frontend components
- `db` — Supabase migrations/queries
- `wallet` — Web3/wallet integration
- `i18n` — Translations
- `config` — Configuration files

## Examples

```
feat(api): add leaderboard endpoint with pagination

- Return top 100 users sorted by total points
- Add cursor-based pagination
- Include user rank in response
```

```
fix(wallet): resolve Celo network switch rejection

- Add explicit chain ID validation before switch
- Handle user rejection with friendly error toast
- Fallback to MiniPay if MetaMask unavailable
```

## Anti-patterns (NEVER use)

- `update`, `wip`, `fix typo`, `changes`, `tidy up`, `cleanup`
- Commits that bundle unrelated changes (split instead)
