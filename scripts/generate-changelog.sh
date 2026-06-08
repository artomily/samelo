#!/usr/bin/env bash
#
# generate-changelog.sh — Auto-generate CHANGELOG.md entries from git history.
#
# Usage:
#   ./scripts/generate-changelog.sh              # Show unreleased entries (since last tag)
#   ./scripts/generate-changelog.sh --release    # Move Unreleased to new version + tag
#   ./scripts/generate-changelog.sh --dry-run    # Preview only, don't modify file
#
# Depends on: git, standard Unix tools

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CHANGELOG="$REPO_ROOT/CHANGELOG.md"
DRY_RUN=false
RELEASE=false

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --release) RELEASE=true ;;
    -h|--help)
      echo "Usage: $0 [--dry-run] [--release]"
      echo "  --dry-run   Preview changelog entries without modifying file"
      echo "  --release   Move [Unreleased] to a new version section and suggest tag"
      exit 0
      ;;
  esac
done

# --- Get commits since last tag ---

LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -z "$LAST_TAG" ]; then
  COMMITS=$(git log --oneline --no-merges)
  FROM_REF="initial commit"
else
  COMMITS=$(git log --oneline --no-merges "${LAST_TAG}..HEAD")
  FROM_REF="$LAST_TAG"
fi

if [ -z "$COMMITS" ]; then
  echo "No commits since $FROM_REF."
  exit 0
fi

# --- Categorize commits ---

ADDED=""
CHANGED=""
FIXED=""
DOCS=""
OTHER=""

while IFS= read -r line; do
  type=$(echo "$line" | sed -n 's/^[a-f0-9]* \(feat\|fix\|refactor\|test\|docs\|chore\|ci\|style\|perf\)\((.*)\)\?: \(.*\)/\1/p')
  msg=$(echo "$line" | sed -n 's/^[a-f0-9]* \(feat\|fix\|refactor\|test\|docs\|chore\|ci\|style\|perf\)\((.*)\)\?: //p' | sed 's/^[a-f0-9]* //')

  if [ -z "$type" ]; then
    OTHER="${OTHER}- $(echo "$line" | sed 's/^[a-f0-9]* //')\n"
    continue
  fi

  case "$type" in
    feat)     ADDED="${ADDED}- $msg\n" ;;
    fix)      FIXED="${FIXED}- $msg\n" ;;
    refactor) CHANGED="${CHANGED}- $msg\n" ;;
    perf)     CHANGED="${CHANGED}- $msg\n" ;;
    docs|test) DOCS="${DOCS}- $msg\n" ;;
    chore|ci|style) OTHER="${OTHER}- $msg\n" ;;
  esac
done <<< "$COMMITS"

# --- Build entry ---

ENTRY=""
[ -n "$ADDED" ]   && ENTRY="${ENTRY}### Added\n${ADDED}\n"
[ -n "$CHANGED" ] && ENTRY="${ENTRY}### Changed\n${CHANGED}\n"
[ -n "$FIXED" ]   && ENTRY="${ENTRY}### Fixed\n${FIXED}\n"
[ -n "$DOCS" ]    && ENTRY="${ENTRY}### Documentation\n${DOCS}\n"
[ -n "$OTHER" ]   && ENTRY="${ENTRY}### Maintenance\n${OTHER}\n"

if [ -z "$ENTRY" ]; then
  echo "No categorized entries to add."
  exit 0
fi

if $RELEASE; then
  CURRENT_VERSION=$(grep -m1 '^## \[' "$CHANGELOG" | sed 's/## \[\(.*\)\].*/\1/' || echo "0.1.0")
  echo "Current version: $CURRENT_VERSION"
  echo ""
  echo "Proposed changelog entry:"
  echo "---"
  echo -e "$ENTRY"
  echo "---"
else
  echo "Changelog entries since $FROM_REF:"
  echo "---"
  echo -e "$ENTRY"
  echo "---"
fi
