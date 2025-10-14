#!/usr/bin/env bash
set -euo pipefail

# update-version.sh
# Update version in package.json (for release artifacts only)
# Usage: update-version.sh <version>

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <version>" >&2
  exit 1
fi

VERSION="$1"

# Remove 'v' prefix for npm versioning
NPM_VERSION=${VERSION#v}

if [ -f "package.json" ]; then
  # Prefer Node.js for safe JSON editing, fall back to jq, then sed
  if command -v node >/dev/null 2>&1; then
    node -e "const fs=require('fs');const p='package.json';const v=process.argv[1];const j=JSON.parse(fs.readFileSync(p,'utf8'));j.version=v;fs.writeFileSync(p,JSON.stringify(j,null,2)+'\n');console.log('Updated package.json version to '+v+' (for release artifacts only)');" "$NPM_VERSION"
  elif command -v jq >/dev/null 2>&1; then
    jq ".version = \"$NPM_VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json
    echo "Updated package.json version to $NPM_VERSION (for release artifacts only)"
  else
    # sed fallback: anchor to the top-level version line
    sed -i -E '/^[[:space:]]*"version"[[:space:]]*:/ s/"version"[[:space:]]*:[[:space:]]*"[^"]*"/"version": "'$NPM_VERSION'"/' package.json
    echo "Updated package.json version to $NPM_VERSION (for release artifacts only)"
  fi
else
  echo "Warning: package.json not found, skipping version update"
fi