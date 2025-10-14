---
description: Execute the instructional planning workflow using the plan template to generate instructional design artifacts.
scripts:
  sh: scripts/bash/setup-plan.sh --json
  ps: scripts/powershell/setup-plan.ps1 -Json
agent_scripts:
  sh: scripts/bash/update-agent-context.sh __AGENT__
  ps: scripts/powershell/update-agent-context.ps1 -AgentType __AGENT__
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `{SCRIPT}` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Instructional Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate learning-model.md, assessments/, lesson-plan.md
   - Phase 1: Update agent context by running the agent script
   - Re-evaluate Constitution Check post-design

4. **Stop and report**: Command ends after Phase 2 planning. Report branch, IMPL_PLAN path, and generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Instructional Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each pedagogical dependency → best practices task
   - For each content integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Instructional Context:
     Task: "Research {unknown} for {module context}"
   For each delivery technology choice:
     Task: "Find best practices for {tech} in {learning domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Assessments

**Prerequisites:** `research.md` complete

1. **Extract learning concepts from module spec** → `learning-model.md`:
   - Concept name, key components, relationships
   - Prerequisite knowledge from objectives
   - Learning progression if applicable

2. **Generate assessment instruments** from learning objectives:
   - For each student journey → assessment activity
   - Use standard formative/summative patterns
   - Output assessment rubrics/templates to `/assessments/`

3. **Agent context update**:
   - Run `{AGENT_SCRIPT}`
   - These scripts detect which AI agent is in use
   - Update the appropriate agent-specific context file
   - Add only new delivery technology from current plan
   - Preserve manual additions between markers

**Output**: learning-model.md, /assessments/*, lesson-plan.md, agent-specific file

## Key rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications
