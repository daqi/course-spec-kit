---
description: Generate an actionable, dependency-ordered tasks.md for the learning module based on available instructional design artifacts.
scripts:
  sh: scripts/bash/check-prerequisites.sh --json
  ps: scripts/powershell/check-prerequisites.ps1 -Json
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

1. **Setup**: Run `{SCRIPT}` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load design documents**: Read from FEATURE_DIR:
   - **Required**: plan.md (delivery approach, technologies, structure), spec.md (learning journeys with priorities)
   - **Optional**: learning-model.md (concepts), assessments/ (rubrics/instruments), research.md (decisions), lesson-plan.md (teaching scenarios)
   - Note: Not all courses have all documents. Generate tasks based on what's available.

3. **Execute task generation workflow** (follow the template structure):
   - Load plan.md and extract delivery technologies, resources, course structure
   - **Load spec.md and extract learning journeys with their priorities (P1, P2, P3, etc.)**
   - If learning-model.md exists: Extract concepts → map to learning journeys
   - If assessments/ exists: Each file → map assessment to learning journeys
   - If research.md exists: Extract decisions → generate setup tasks
   - **Generate tasks ORGANIZED BY LEARNING JOURNEY**:
     - Setup tasks (shared infrastructure needed by all journeys)
     - **Foundational tasks (prerequisites that must complete before ANY learning journey can start)**
     - For each learning journey (in priority order P1, P2, P3...):
       - Group all tasks needed to complete JUST that journey
       - Include content, activities, assessments, resources specific to that journey
       - Mark which tasks are [P] parallelizable
       - If assessments requested: Include assessment development specific to that journey
     - Polish/Integration tasks (cross-cutting concerns)
   - **Assessments are OPTIONAL**: Only generate assessment tasks if explicitly requested in the module spec or user asks for assessment-first approach
   - Apply task rules:
     - Different content files = mark [P] for parallel
     - Same file = sequential (no [P])
     - If assessments requested: Assessments before content (backward design order)
   - Number tasks sequentially (T001, T002...)
   - Generate dependency graph showing learning journey completion order
   - Create parallel execution examples per journey
   - Validate task completeness (each journey has all needed tasks, independently assessable)

4. **Generate tasks.md**: Use `.specify/templates/tasks-template.md` as structure, fill with:
   - Correct module name from plan.md
   - Phase 1: Setup tasks (course initialization)
   - Phase 2: Foundational tasks (blocking prerequisites for all learning journeys)
   - Phase 3+: One phase per learning journey (in priority order from spec.md)
     - Each phase includes: journey goal, independent assessment criteria, assessments (if requested), content development tasks
     - Clear [Journey] labels (LJ1, LJ2, LJ3...) for each task
     - [P] markers for parallelizable tasks within each journey
     - Checkpoint markers after each journey phase
   - Final Phase: Polish & cross-cutting concerns
   - Numbered tasks (T001, T002...) in execution order
   - Clear file paths for each task
   - Dependencies section showing journey completion order
   - Parallel execution examples per journey
   - Implementation strategy section (MVP first, incremental delivery)

5. **Report**: Output path to generated tasks.md and summary:
   - Total task count
   - Task count per learning journey
   - Parallel opportunities identified
   - Independent assessment criteria for each journey
   - Suggested MVP scope (typically just Learning Journey 1)

Context for task generation: {ARGS}

The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

## Task Generation Rules

**IMPORTANT**: Assessments are optional. Only generate assessment tasks if the user explicitly requested assessment or backward design approach in the module specification.

**CRITICAL**: Tasks MUST be organized by learning journey to enable independent development and assessment.

1. **From Learning Journeys (spec.md)** - PRIMARY ORGANIZATION:
   - Each learning journey (P1, P2, P3...) gets its own phase
   - Map all related components to their journey:
     - Concepts needed for that journey
     - Activities needed for that journey
     - Resources/content needed for that journey
     - If assessments requested: Assessments specific to that journey
   - Mark journey dependencies (most journeys should be independent)
   
2. **From Assessments**:
   - Map each assessment/instrument → to the learning journey it serves
   - If assessments requested: Each assessment → assessment development task [P] before content in that journey's phase
   
3. **From Learning Model**:
   - Map each concept → to the learning journey(ies) that need it
   - If concept serves multiple journeys: Put in earliest journey or Setup phase
   - Relationships → content development tasks in appropriate journey phase
   
4. **From Setup/Infrastructure**:
   - Shared infrastructure → Setup phase (Phase 1)
   - Foundational/blocking tasks → Foundational phase (Phase 2)
     - Examples: LMS setup, course structure creation, base resources, common templates
     - These MUST complete before any learning journey can be developed
   - Journey-specific setup → within that journey's phase

5. **Ordering**:
   - Phase 1: Setup (course initialization)
   - Phase 2: Foundational (blocking prerequisites - must complete before learning journeys)
   - Phase 3+: Learning Journeys in priority order (P1, P2, P3...)
     - Within each journey: Assessments (if requested) → Concepts → Activities → Resources → Integration
   - Final Phase: Polish & Cross-Cutting Concerns
   - Each learning journey phase should be a complete, independently assessable increment

