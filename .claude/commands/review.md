# /review

Perform a code review of the current diff or open PR.

## Instructions

1. Get the diff:
   - If reviewing staged/uncommitted changes: `git diff`
   - If reviewing current branch vs main: `git diff main..HEAD`
   - If PR number provided: `gh pr diff <number>`
2. Review the diff against the criteria below.
3. Output findings grouped by severity: **Critical**, **Warning**, **Suggestion**.
4. For each finding, reference specific lines and explain the issue.
5. Suggest concrete fixes.

## Review Criteria

### Security (Critical)
- No secrets, API keys, or private keys in code
- Input validation on all user-facing endpoints
- Signature verification for oracle-based operations
- Reentrancy protection on value-transferring functions
- Proper access control (admin-only for sensitive operations)
- No `tx.origin` for authorization

### Contracts (Critical)
- UUPS storage layout preserved (no variable reordering, no slot removal)
- ECDSA oracle signatures bind to contract address (cross-contract replay protection)
- Nonce anti-replay mechanism intact
- Cooldown period enforced
- Only admin can call upgrade functions

### Error Handling (Warning)
- All API routes return proper error responses
- Wallet interactions have fallback handlers
- Supabase queries handle null/error states
- Try/catch around external calls (RPC, Supabase, etc.)

### Code Quality (Suggestion)
- Functions are focused (single responsibility)
- No magic numbers — use named constants
- TypeScript strict mode compliance
- No `any` types without explicit justification
- React hooks follow Rules of Hooks

### Testing (Warning)
- New features have corresponding tests
- Integration tests for API routes
- Contract tests for modified Solidity functions
- Edge cases covered (empty states, error states, loading)

### Documentation (Suggestion)
- `.context/sprint.md` updated with progress
- CHANGELOG entry added for user-facing changes
- README or `.context/` docs updated if architecture changed

## Output Format

```markdown
## Code Review — [branch/PR]

### Critical
- **Issue**: [description]
  - **File**: `path/to/file.ts:123`
  - **Fix**: [concrete suggestion]

### Warnings
- **Issue**: [description]
  - **File**: `path/to/file.ts:456`
  - **Fix**: [concrete suggestion]

### Suggestions
- **Issue**: [description]
  - **File**: `path/to/file.ts:789`
  - **Fix**: [concrete suggestion]

### Summary
- Critical: X | Warnings: Y | Suggestions: Z
```
