# Migration Guide: Python to JavaScript/TypeScript CLI

## Overview

Starting from version 0.0.21, the Course Specify CLI has been refactored from Python to JavaScript/TypeScript. This provides better cross-platform compatibility, faster execution, and improved dependency management.

## What Changed?

### Technology Stack

- **Before (v0.0.20 and earlier):**
  - Python 3.11+
  - Dependencies: typer, rich, httpx, platformdirs, readchar, truststore
  - Package manager: uv / pip
  
- **After (v0.0.21+):**
  - Node.js 18.0.0+
  - Dependencies: commander, chalk, @inquirer/prompts, node-fetch, extract-zip, ora
  - Package manager: npm

- **After (v0.0.22+):**
  - CLI command renamed from `specify` to `course-specify`

### Installation

#### Old Method (Python - Deprecated)

```bash
uv tool install course-specify --from git+https://github.com/daqi/course-spec-kit.git
```

#### New Method (Node.js - Recommended)

```bash
npm install -g git+https://github.com/daqi/course-spec-kit.git
```

or for one-time use:

```bash
npx git+https://github.com/daqi/course-spec-kit.git init <project-name>
```

## What Stayed the Same?

All command-line functionality remains **100% identical** (except command name changed from `specify` to `course-specify` in v0.0.22):

- `course-specify init [project-name]` - Initialize a new project (was `specify init` before v0.0.22)
- `course-specify check` - Check system requirements (was `specify check` before v0.0.22)
- All command-line options (`--ai`, `--script`, `--here`, `--force`, etc.)
- All AI agent support (claude, gemini, copilot, cursor-agent, etc.)
- Template downloading and extraction behavior

## Migration Steps

### If You Have Python Version Installed

1. **Uninstall the Python version:**
   ```bash
   uv tool uninstall course-specify
   # or
   pip uninstall course-specify
   ```

2. **Install the Node.js version:**
   ```bash
   npm install -g git+https://github.com/daqi/course-spec-kit.git
   ```

3. **Verify installation:**
   ```bash
   course-specify --version
   course-specify check
   ```

### If You're Starting Fresh

Simply install using npm:

```bash
npm install -g git+https://github.com/daqi/course-spec-kit.git
```

## System Requirements

### New Requirements

- **Node.js 18.0.0 or higher**
- **npm** (comes with Node.js)

### Removed Requirements

- ~~Python 3.11+~~
- ~~uv package manager~~

### Still Required

- **Git** (for repository management)
- **AI coding agent** of your choice

## Benefits of the New CLI

1. **Better Cross-Platform Support**: Works seamlessly on Windows, macOS, and Linux without WSL
2. **Faster Execution**: Quicker startup and execution times
3. **Modern Tooling**: Leverages the JavaScript/TypeScript ecosystem
4. **Improved Error Messages**: Better formatted and more helpful error output
5. **Enhanced Interactivity**: Better prompts and user experience

## Troubleshooting

### "course-specify: command not found" after installation

Make sure npm's global bin directory is in your PATH:

```bash
# Check npm's global bin location
npm config get prefix

# Add to PATH (example for bash/zsh)
echo 'export PATH="$(npm config get prefix)/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### "Node.js version too old"

Update Node.js to version 18 or higher:

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

### Python version still being used

Make sure you've uninstalled the Python version and the npm version is first in your PATH:

```bash
which course-specify  # Should point to npm installation
course-specify --version  # Should show 0.0.22 or higher
```

## For Developers

If you're contributing to the project or building from source:

### Development Setup

```bash
# Clone the repository
git clone https://github.com/daqi/course-spec-kit.git
cd course-spec-kit

# Install dependencies
npm install

# Build TypeScript
npm run build

# Test locally
node dist/index.js --help
```

### Build Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development

### Project Structure

```
course-spec-kit/
├── src-js/              # TypeScript source code
│   ├── commands/        # Command implementations
│   ├── utils/           # Utility functions
│   ├── config.ts        # Configuration and constants
│   └── index.ts         # Main entry point
├── dist/                # Compiled JavaScript (gitignored)
├── package.json         # npm package configuration
├── tsconfig.json        # TypeScript configuration
└── src/                 # Legacy Python code (deprecated)
```

## Support

If you encounter any issues during migration, please:

1. Check this migration guide
2. Review the [README.md](../README.md)
3. Open an issue at https://github.com/daqi/course-spec-kit/issues

## Timeline

- **v0.0.20 and earlier**: Python version (maintained for legacy compatibility)
- **v0.0.21**: JavaScript/TypeScript version introduced (recommended)
- **Future releases**: Python version will be removed

We recommend migrating to the JavaScript/TypeScript version as soon as possible.
