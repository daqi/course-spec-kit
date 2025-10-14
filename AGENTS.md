# AGENTS.md

## About Spec Kit and Specify

**GitHub Spec Kit** is a comprehensive toolkit for implementing Spec-Driven Development (SDD) - a methodology that emphasizes creating clear specifications before implementation. The toolkit includes templates, scripts, and workflows that guide development teams through a structured approach to building software.

**Specify CLI** is the command-line interface that bootstraps projects with the Spec Kit framework. It sets up the necessary directory structures, templates, and AI agent integrations to support the Spec-Driven Development workflow.

The toolkit supports multiple AI coding assistants, allowing teams to use their preferred tools while maintaining consistent project structure and development practices.

---

## General practices

- Any changes to the Specify CLI require a version rev in `package.json` and addition of entries to `CHANGELOG.md`.
- Scripts are now unified in Node.js (TypeScript compiled to JavaScript) located in `src-js/scripts/`. The old bash and PowerShell scripts in `scripts/bash/` and `scripts/powershell/` are deprecated.
- Template commands now reference unified Node.js scripts: `node .specify/scripts/<script-name>.js`

## Adding New Agent Support

This section explains how to add support for new AI agents/assistants to the Specify CLI. Use this guide as a reference when integrating new AI tools into the Spec-Driven Development workflow.

### Overview

Specify supports multiple AI agents by generating agent-specific command files and directory structures when initializing projects. Each agent has its own conventions for:

- **Command file formats** (Markdown, TOML, etc.)
- **Directory structures** (`.claude/commands/`, `.windsurf/workflows/`, etc.)
- **Command invocation patterns** (slash commands, CLI tools, etc.)
- **Argument passing conventions** (`$ARGUMENTS`, `{{args}}`, etc.)

### Current Supported Agents

| Agent | Directory | Format | CLI Tool | Description |
|-------|-----------|---------|----------|-------------|
| **Claude Code** | `.claude/commands/` | Markdown | `claude` | Anthropic's Claude Code CLI |
| **Gemini CLI** | `.gemini/commands/` | TOML | `gemini` | Google's Gemini CLI |
| **GitHub Copilot** | `.github/prompts/` | Markdown | N/A (IDE-based) | GitHub Copilot in VS Code |
| **Cursor** | `.cursor/commands/` | Markdown | `cursor-agent` | Cursor CLI |
| **Qwen Code** | `.qwen/commands/` | TOML | `qwen` | Alibaba's Qwen Code CLI |
| **opencode** | `.opencode/command/` | Markdown | `opencode` | opencode CLI |
| **Codex CLI** | `.codex/commands/` | Markdown | `codex` | Codex CLI |
| **Windsurf** | `.windsurf/workflows/` | Markdown | N/A (IDE-based) | Windsurf IDE workflows |
| **Kilo Code** | `.kilocode/rules/` | Markdown | N/A (IDE-based) | Kilo Code IDE |
| **Auggie CLI** | `.augment/rules/` | Markdown | `auggie` | Auggie CLI |
| **Roo Code** | `.roo/rules/` | Markdown | N/A (IDE-based) | Roo Code IDE |
| **CodeBuddy** | `.codebuddy/commands/` | Markdown | `codebuddy` | CodeBuddy |
| **Amazon Q Developer CLI** | `.amazonq/prompts/` | Markdown | `q` | Amazon Q Developer CLI |

### Step-by-Step Integration Guide

Follow these steps to add a new agent (using a hypothetical new agent as an example):

#### 1. Add to AGENT_CONFIG

**IMPORTANT**: Use the actual CLI tool name as the key, not a shortened version.

Add the new agent to the `AGENT_CONFIG` dictionary in `src-js/config.ts`. This is the **single source of truth** for all agent metadata:

```typescript
AGENT_CONFIG = {
    // ... existing agents ...
    "new-agent-cli": {  // Use the ACTUAL CLI tool name (what users type in terminal)
        name: "New Agent Display Name",
        folder: ".newagent/",  // Directory for agent files
        installUrl: "https://example.com/install",  // URL for installation docs (or null if IDE-based)
        requiresCli: true,  // true if CLI tool required, false for IDE-based agents
    },
}
```

**Key Design Principle**: The dictionary key should match the actual executable name that users install. For example:
- ✅ Use `"cursor-agent"` because the CLI tool is literally called `cursor-agent`
- ❌ Don't use `"cursor"` as a shortcut if the tool is `cursor-agent`

This eliminates the need for special-case mappings throughout the codebase.

**Field Explanations**:
- `name`: Human-readable display name shown to users
- `folder`: Directory where agent-specific files are stored (relative to project root)
- `installUrl`: Installation documentation URL (set to `null` for IDE-based agents)
- `requiresCli`: Whether the agent requires a CLI tool check during initialization

#### 2. Update CLI Help Text

Update the `--ai` parameter help text in the `init()` command to include the new agent. The command implementation is in `src-js/commands/init.ts`.

Also update any function docstrings, examples, and error messages that list available agents.

#### 3. Update README Documentation

Update the **Supported AI Agents** section in `README.md` to include the new agent:

- Add the new agent to the table with appropriate support level (Full/Partial)
- Include the agent's official website link
- Add any relevant notes about the agent's implementation
- Ensure the table formatting remains aligned and consistent

#### 4. Update Release Package Script

Modify `.github/workflows/scripts/create-release-packages.sh`:

##### Add to ALL_AGENTS array:
```bash
ALL_AGENTS=(claude gemini copilot cursor-agent qwen opencode windsurf q)
```

##### Add case statement for directory structure:
```bash
case $agent in
  # ... existing cases ...
  windsurf)
    mkdir -p "$base_dir/.windsurf/workflows"
    generate_commands windsurf md "\$ARGUMENTS" "$base_dir/.windsurf/workflows" ;;
esac
```

**Note**: Scripts are now unified to Node.js, so there's no need to specify script variant (sh/ps). The `generate_commands` function no longer takes a script variant parameter.

#### 5. Update GitHub Release Script

Modify `.github/workflows/scripts/create-github-release.sh` to include the new agent's package:

```bash
gh release create "$VERSION" \
  # ... existing packages ...
  .genreleases/spec-kit-template-windsurf-"$VERSION".zip \
  # Add new agent packages here
```

#### 5. Update Agent Context Script

Update `src-js/scripts/update-agent-context.ts` to include the new agent:

Add to AGENT_FILES constant:
```typescript
const AGENT_FILES: Record<string, AgentFileConfig> = {
  // ... existing agents ...
  windsurf: { path: ".windsurf/rules/specify-rules.md", name: "Windsurf" },
};
```

#### 6. Update CLI Tool Checks (Optional)

**Note**: CLI tool checks are now handled automatically based on the `requiresCli` field in AGENT_CONFIG. No additional code changes needed in the `check()` or `init()` commands - they automatically loop through AGENT_CONFIG and check tools as needed.

## Important Design Decisions

### Using Actual CLI Tool Names as Keys

**CRITICAL**: When adding a new agent to AGENT_CONFIG, always use the **actual executable name** as the dictionary key, not a shortened or convenient version.

**Why this matters:**
- The tool checking logic uses the system PATH to find executables
- If the key doesn't match the actual CLI tool name, you'll need special-case mappings throughout the codebase
- This creates unnecessary complexity and maintenance burden

**Example - The Cursor Lesson:**

❌ **Wrong approach** (requires special-case mapping):
```python
AGENT_CONFIG = {
    "cursor": {  # Shorthand that doesn't match the actual tool
        "name": "Cursor",
        # ...
    }
}

# Then you need special cases everywhere:
cli_tool = agent_key
if agent_key == "cursor":
    cli_tool = "cursor-agent"  # Map to the real tool name
```

✅ **Correct approach** (no mapping needed):
```python
AGENT_CONFIG = {
    "cursor-agent": {  # Matches the actual executable name
        "name": "Cursor",
        # ...
    }
}

# No special cases needed - just use agent_key directly!
```

**Benefits of this approach:**
- Eliminates special-case logic scattered throughout the codebase
- Makes the code more maintainable and easier to understand
- Reduces the chance of bugs when adding new agents
- Tool checking "just works" without additional mappings

## Agent Categories

### CLI-Based Agents

Require a command-line tool to be installed:
- **Claude Code**: `claude` CLI
- **Gemini CLI**: `gemini` CLI  
- **Cursor**: `cursor-agent` CLI
- **Qwen Code**: `qwen` CLI
- **opencode**: `opencode` CLI
- **CodeBuddy**: `codebuddy` CLI

### IDE-Based Agents
Work within integrated development environments:
- **GitHub Copilot**: Built into VS Code/compatible editors
- **Windsurf**: Built into Windsurf IDE

## Command File Formats

### Markdown Format
Used by: Claude, Cursor, opencode, Windsurf, Amazon Q Developer

```markdown
---
description: "Command description"
---

Command content with {SCRIPT} and $ARGUMENTS placeholders.
```

### TOML Format
Used by: Gemini, Qwen

```toml
description = "Command description"

prompt = """
Command content with {SCRIPT} and {{args}} placeholders.
"""
```

## Directory Conventions

- **CLI agents**: Usually `.<agent-name>/commands/`
- **IDE agents**: Follow IDE-specific patterns:
  - Copilot: `.github/prompts/`
  - Cursor: `.cursor/commands/`
  - Windsurf: `.windsurf/workflows/`

## Argument Patterns

Different agents use different argument placeholders:
- **Markdown/prompt-based**: `$ARGUMENTS`
- **TOML-based**: `{{args}}`
- **Script placeholders**: `{SCRIPT}` (replaced with actual script path)
- **Agent placeholders**: `__AGENT__` (replaced with agent name)

## Testing New Agent Integration

1. **Build test**: Run package creation script locally
2. **CLI test**: Test `specify init --ai <agent>` command
3. **File generation**: Verify correct directory structure and files
4. **Command validation**: Ensure generated commands work with the agent
5. **Context update**: Test agent context update scripts

## Common Pitfalls

1. **Using shorthand keys instead of actual CLI tool names**: Always use the actual executable name as the AGENT_CONFIG key (e.g., `"cursor-agent"` not `"cursor"`). This prevents the need for special-case mappings throughout the codebase.
2. **Forgetting update scripts**: Both bash and PowerShell scripts must be updated when adding new agents.
3. **Incorrect `requires_cli` value**: Set to `True` only for agents that actually have CLI tools to check; set to `False` for IDE-based agents.
4. **Wrong argument format**: Use correct placeholder format for each agent type (`$ARGUMENTS` for Markdown, `{{args}}` for TOML).
5. **Directory naming**: Follow agent-specific conventions exactly (check existing agents for patterns).
6. **Help text inconsistency**: Update all user-facing text consistently (help strings, docstrings, README, error messages).

## Future Considerations

When adding new agents:

- Consider the agent's native command/workflow patterns
- Ensure compatibility with the Spec-Driven Development process
- Document any special requirements or limitations
- Update this guide with lessons learned
- Verify the actual CLI tool name before adding to AGENT_CONFIG

---

*This documentation should be updated whenever new agents are added to maintain accuracy and completeness.*
