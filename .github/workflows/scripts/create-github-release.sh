#!/usr/bin/env bash
set -euo pipefail

# create-github-release.sh
# Create a GitHub release with all template zip files
# Usage: create-github-release.sh <version>

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <version>" >&2
  exit 1
fi

VERSION="$1"

# Remove 'v' prefix from version for release title
VERSION_NO_V=${VERSION#v}

gh release create "$VERSION" \
  .genreleases/spec-kit-template-copilot-"$VERSION".zip \
  .genreleases/spec-kit-template-claude-"$VERSION".zip \
  .genreleases/spec-kit-template-gemini-"$VERSION".zip \
  .genreleases/spec-kit-template-cursor-agent-"$VERSION".zip \
  .genreleases/spec-kit-template-opencode-"$VERSION".zip \
  .genreleases/spec-kit-template-qwen-"$VERSION".zip \
  .genreleases/spec-kit-template-windsurf-"$VERSION".zip \
  .genreleases/spec-kit-template-codex-"$VERSION".zip \
  .genreleases/spec-kit-template-kilocode-"$VERSION".zip \
  .genreleases/spec-kit-template-auggie-"$VERSION".zip \
  .genreleases/spec-kit-template-roo-"$VERSION".zip \
  .genreleases/spec-kit-template-codebuddy-"$VERSION".zip \
  .genreleases/spec-kit-template-q-"$VERSION".zip \
  --title "Spec Kit Templates - $VERSION_NO_V" \
  --notes-file release_notes.md