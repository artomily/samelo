# /changelog

Update CHANGELOG.md with changes since the last tag.

## Instructions

1. Run `scripts/generate-changelog.sh` to auto-generate entries.
2. If the script fails, manually build entries:
   - Get last version tag: `git describe --tags --abbrev=0 2>/dev/null || echo "no tags"`
   - Get commits since last tag: `git log --oneline <last-tag>..HEAD`
   - Categorize commits by Conventional Commit type
   - Format entries following Keep a Changelog
3. Insert entries under `## [Unreleased]` section in CHANGELOG.md.
4. Show the proposed changelog entry to the user for approval.

## Format

```markdown
### Added
- feat(scope): description

### Changed
- refactor(scope): description

### Deprecated
- description

### Removed
- description

### Fixed
- fix(scope): description

### Security
- description
```

## Move to Version

When releasing, move `[Unreleased]` entries to a new version section:
```bash
# After tagging:
scripts/generate-changelog.sh --release v1.0.0
```
