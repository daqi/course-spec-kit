# Deprecated Scripts

**Notice**: These bash and PowerShell scripts are deprecated as of v0.0.22.

All scripts have been unified and migrated to Node.js (TypeScript). The new scripts are located in `src-js/scripts/` and are compiled to `dist/scripts/`.

## Migration

The functionality provided by these scripts is now available through unified Node.js implementations:

- `scripts/bash/check-prerequisites.sh` → `node .specify/scripts/check-prerequisites.js`
- `scripts/bash/create-new-feature.sh` → `node .specify/scripts/create-new-feature.js`  
- `scripts/bash/setup-plan.sh` → `node .specify/scripts/setup-plan.js`
- `scripts/bash/update-agent-context.sh` → `node .specify/scripts/update-agent-context.js`
- `scripts/bash/common.sh` → Utility functions moved to `src-js/utils/feature.ts` and `src-js/utils/files.ts`

The same applies to PowerShell scripts in `scripts/powershell/`.

## Why This Change?

1. **Cross-platform compatibility**: Node.js runs on Windows, macOS, and Linux without needing separate script variants
2. **Maintainability**: Single codebase instead of maintaining parallel bash and PowerShell implementations
3. **Type safety**: TypeScript provides better error checking and IDE support
4. **Consistency**: Same language as the main CLI tool

## Timeline

- These scripts will remain in the repository for backwards compatibility
- They will be removed in a future major version release
- New projects initialized with `specify init` will only receive the Node.js scripts

## For Existing Projects

If your project uses these scripts, you can continue using them, but we recommend migrating to the new Node.js scripts by:

1. Ensuring Node.js is installed (Node.js 18+ required)
2. Updating your template command references to use `node .specify/scripts/<script-name>.js` instead of the bash/PowerShell variants
3. Installing the latest Specify release which includes the compiled JavaScript files
