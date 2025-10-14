---
description: Create or update the learning module specification from a natural language module description.
script: node .specify/scripts/create-new-feature.js --json "{ARGS}"
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

The text the user typed after `/speckit.specify` in the triggering message **is** the learning module description. Assume you always have it available in this conversation even if `{ARGS}` appears literally below. Do not ask the user to repeat it unless they provided an empty command.

Given that module description, do this:

1. Run the script `{SCRIPT}` from repo root and parse its JSON output for BRANCH_NAME and SPEC_FILE. All file paths must be absolute.
  **IMPORTANT** You must only ever run this script once. The JSON is provided in the terminal as output - always refer to it to get the actual content you're looking for. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").
2. Load `templates/spec-template.md` to understand required sections.

3. Follow this execution flow:

    1. Parse user description from Input
       If empty: ERROR "No module description provided"
    2. Extract key learning concepts from description
       Identify: learners, learning activities, knowledge/skills, constraints
    3. For unclear aspects:
       - Make informed guesses based on context and pedagogical best practices
       - Only mark with [NEEDS CLARIFICATION: specific question] if:
         - The choice significantly impacts module scope or learning outcomes
         - Multiple reasonable interpretations exist with different implications
         - No reasonable default exists
       - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers total**
       - Prioritize clarifications by impact: scope > accessibility/inclusivity > learning experience > technical details
    4. Fill Student Learning Journeys & Assessment section
       If no clear learning flow: ERROR "Cannot determine learning journeys"
    5. Generate Learning Objectives
       Each objective must be assessable
       Use reasonable defaults for unspecified details (document assumptions in Assumptions section)
    6. Define Success Criteria
       Create measurable, technology-agnostic outcomes
       Include both quantitative metrics (completion time, performance, volume) and qualitative measures (student satisfaction, skill demonstration)
       Each criterion must be verifiable without implementation details
    7. Identify Key Concepts (if topic-specific knowledge involved)
    8. Return: SUCCESS (spec ready for planning)

4. Write the specification to SPEC_FILE using the template structure, replacing placeholders with concrete details derived from the module description (arguments) while preserving section order and headings.

5. **Specification Quality Validation**: After writing the initial spec, validate it against quality criteria:

   a. **Create Spec Quality Checklist**: Generate a checklist file at `FEATURE_DIR/checklists/requirements.md` using the checklist template structure with these validation items:
   
      ```markdown
      # Specification Quality Checklist: [MODULE NAME]
      
      **Purpose**: Validate specification completeness and quality before proceeding to planning
      **Created**: [DATE]
      **Module**: [Link to spec.md]
      
      ## Content Quality
      
      - [ ] No implementation details (specific technologies, LMS platforms, authoring tools)
      - [ ] Focused on learning outcomes and student needs
      - [ ] Written for educational stakeholders (instructors, designers)
      - [ ] All mandatory sections completed
      
      ## Learning Objective Completeness
      
      - [ ] No [NEEDS CLARIFICATION] markers remain
      - [ ] Learning objectives are assessable and unambiguous
      - [ ] Success criteria are measurable
      - [ ] Success criteria are technology-agnostic (no implementation details)
      - [ ] All assessment scenarios are defined
      - [ ] Edge cases are identified (diverse learners, prerequisites)
      - [ ] Scope is clearly bounded
      - [ ] Dependencies and assumptions identified
      
      ## Module Readiness
      
      - [ ] All learning objectives have clear assessment criteria
      - [ ] Student learning journeys cover primary flows
      - [ ] Module meets measurable outcomes defined in Success Criteria
      - [ ] No implementation details leak into specification
      
      ## Notes
      
      - Items marked incomplete require spec updates before `/speckit.clarify` or `/speckit.plan`
      ```
   
   b. **Run Validation Check**: Review the spec against each checklist item:
      - For each item, determine if it passes or fails
      - Document specific issues found (quote relevant spec sections)
   
   c. **Handle Validation Results**:
      
      - **If all items pass**: Mark checklist complete and proceed to step 6
      
      - **If items fail (excluding [NEEDS CLARIFICATION])**:
        1. List the failing items and specific issues
        2. Update the spec to address each issue
        3. Re-run validation until all items pass (max 3 iterations)
        4. If still failing after 3 iterations, document remaining issues in checklist notes and warn user
      
      - **If [NEEDS CLARIFICATION] markers remain**:
        1. Extract all [NEEDS CLARIFICATION: ...] markers from the spec
        2. **LIMIT CHECK**: If more than 3 markers exist, keep only the 3 most critical (by scope/security/UX impact) and make informed guesses for the rest
        3. For each clarification needed (max 3), present options to user in this format:
        
           ```markdown
           ## Question [N]: [Topic]
           
           **Context**: [Quote relevant spec section]
           
           **What we need to know**: [Specific question from NEEDS CLARIFICATION marker]
           
           **Suggested Answers**:
           
           | Option | Answer | Implications |
           |--------|--------|--------------|
           | A      | [First suggested answer] | [What this means for the feature] |
           | B      | [Second suggested answer] | [What this means for the feature] |
           | C      | [Third suggested answer] | [What this means for the feature] |
           | Custom | Provide your own answer | [Explain how to provide custom input] |
           
           **Your choice**: _[Wait for user response]_
           ```
        
        4. **CRITICAL - Table Formatting**: Ensure markdown tables are properly formatted:
           - Use consistent spacing with pipes aligned
           - Each cell should have spaces around content: `| Content |` not `|Content|`
           - Header separator must have at least 3 dashes: `|--------|`
           - Test that the table renders correctly in markdown preview
        5. Number questions sequentially (Q1, Q2, Q3 - max 3 total)
        6. Present all questions together before waiting for responses
        7. Wait for user to respond with their choices for all questions (e.g., "Q1: A, Q2: Custom - [details], Q3: B")
        8. Update the spec by replacing each [NEEDS CLARIFICATION] marker with the user's selected or provided answer
        9. Re-run validation after all clarifications are resolved
   
   d. **Update Checklist**: After each validation iteration, update the checklist file with current pass/fail status

6. Report completion with branch name, spec file path, checklist results, and readiness for the next phase (`/speckit.clarify` or `/speckit.plan`).

**NOTE:** The script creates and checks out the new branch and initializes the spec file before writing.

## General Guidelines

## Quick Guidelines

- Focus on **WHAT** students will learn and **WHY**.
- Avoid HOW to teach (no specific LMS, authoring tools, delivery platforms).
- Written for educational stakeholders, not technology specialists.
- DO NOT create any checklists that are embedded in the spec. That will be a separate command.

### Section Requirements

- **Mandatory sections**: Must be completed for every learning module
- **Optional sections**: Include only when relevant to the module
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Make informed guesses**: Use context, pedagogical best practices, and common patterns to fill gaps
2. **Document assumptions**: Record reasonable defaults in the Assumptions section
3. **Limit clarifications**: Maximum 3 [NEEDS CLARIFICATION] markers - use only for critical decisions that:
   - Significantly impact module scope or learning outcomes
   - Have multiple reasonable interpretations with different implications
   - Lack any reasonable default
4. **Prioritize clarifications**: scope > accessibility/inclusivity > learning experience > technical details
5. **Think like an assessor**: Every vague objective should fail the "assessable and unambiguous" checklist item
6. **Common areas needing clarification** (only if no reasonable default exists):
   - Module scope and boundaries (include/exclude specific topics)
   - Learner prerequisites and levels (if multiple conflicting interpretations possible)
   - Accessibility/compliance requirements (when legally/institutionally significant)
   
**Examples of reasonable defaults** (don't ask about these):

- Student prerequisites: Basic computer literacy and internet access unless specified
- Completion time: Standard online module expectations (1-3 hours) unless specified
- Assessment approach: Formative and summative assessments with clear rubrics
- Delivery method: Self-paced online learning with instructor support
- Content format: Mixed media (text, video, interactive exercises) unless specified otherwise

### Success Criteria Guidelines

Success criteria must be:

1. **Measurable**: Include specific metrics (time, percentage, count, rate)
2. **Technology-agnostic**: No mention of specific LMS, authoring tools, or platforms
3. **Learner-focused**: Describe outcomes from student/learning perspective, not system internals
4. **Verifiable**: Can be assessed/validated without knowing implementation details

**Good examples**:

- "Students can complete the module assessment in under 45 minutes"
- "Module supports 200 concurrent learners without performance degradation"
- "90% of students demonstrate mastery on first assessment attempt"
- "Student engagement rate improves by 35%"

**Bad examples** (implementation-focused):

- "LMS API response time is under 200ms" (too technical, use "Students see instant feedback")
- "Database can handle 1000 quiz submissions per second" (implementation detail, use learner-facing metric)
- "React components for exercises render efficiently" (framework-specific)
- "Video CDN cache hit rate above 80%" (technology-specific)
