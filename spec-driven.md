# Specification-Driven Course Development (SDD)

## The Power Inversion

For decades, course materials have been king. Course outlines served materials—they were the rough sketches we built and then refined endlessly during actual delivery. We wrote learning objectives to guide development, created syllabi to inform instruction, drew lesson plans to visualize structure. But these were always subordinate to the materials themselves. Course materials were truth. Everything else was, at best, good intentions. Materials were the source of truth, and as they evolved forward, outlines rarely kept pace. As the asset (materials) and the delivery are one, it's not easy to have parallel implementations without trying to rebuild from the materials.

Spec-Driven Course Development (SDD) inverts this power structure. Specifications don't serve materials—materials serve specifications. The Course Requirements Document (CRD) isn't a guide for content creation; it's the source that generates content. Instructional plans aren't documents that inform teaching; they're precise definitions that produce learning experiences. This isn't an incremental improvement to how we build courses. It's a fundamental rethinking of what drives course development.

The gap between specification and delivery has plagued course development since its inception. We've tried to bridge it with better documentation, more detailed learning objectives, stricter alignment processes. These approaches fail because they accept the gap as inevitable. They try to narrow it but never eliminate it. SDD eliminates the gap by making course specifications and their concrete instructional plans born from the specification executable. When specifications and instructional plans generate content, there is no gap—only transformation.

This transformation is now possible because AI can understand and implement complex educational specifications, and create detailed instructional plans. But raw AI generation without structure produces chaos. SDD provides that structure through specifications and subsequent instructional plans that are precise, complete, and unambiguous enough to generate working learning modules. The specification becomes the primary artifact. Course materials become its expression (as an implementation from the instructional plan) in a particular format and delivery method.

In this new world, maintaining courses means evolving specifications. The intent of the instructional team is expressed in natural language ("**learning outcome-driven design**"), learning design assets, core pedagogical principles and other guidelines. The **lingua franca** of course development moves to a higher level, and course materials are the last-mile approach.

Debugging means fixing specifications and their instructional plans that generate ineffective content. Refactoring means restructuring for clarity. The entire course development workflow reorganizes around specifications as the central source of truth, with instructional plans and materials as the continuously regenerated output. Updating courses with new modules or creating a new parallel implementation because we are creative educators, means revisiting the specification and creating new instructional plans. This process is therefore a 0 -> 1, (1', ..), 2, 3, N.

The instructional team focuses in on their creativity, experimentation, their critical thinking.

## The SDD Workflow in Practice

The workflow begins with an idea—often vague and incomplete. Through iterative dialogue with AI, this idea becomes a comprehensive Course Requirements Document (CRD). The AI asks clarifying questions, identifies edge cases, and helps define precise learning objectives. What might take days of meetings and documentation in traditional course development happens in hours of focused specification work. This transforms the traditional instructional design process—requirements and design become continuous activities rather than discrete phases. This is supportive of a **team process**, where team-reviewed specifications are expressed and versioned, created in branches, and merged.

When an instructional designer updates learning objectives, instructional plans automatically flag affected pedagogical decisions. When a subject matter expert discovers a better teaching approach, the CRD updates to reflect new possibilities.

Throughout this specification process, research agents gather critical context. They investigate content resources, pedagogical approaches, and accessibility implications. Organizational constraints are discovered and applied automatically—your institution's LMS requirements, assessment standards, and delivery policies seamlessly integrate into every specification.

From the CRD, AI generates instructional plans that map learning outcomes to pedagogical decisions. Every content choice has documented rationale. Every instructional decision traces back to specific learning objectives. Throughout this process, consistency validation continuously improves quality. AI analyzes specifications for ambiguity, contradictions, and gaps—not as a one-time gate, but as an ongoing refinement.

Content generation begins as soon as specifications and their instructional plans are stable enough, but they do not have to be "complete." Early generations might be exploratory—testing whether the specification makes sense in practice. Learning concepts become content modules. Student journeys become learning activities. Assessment scenarios become quizzes and projects. This merges course development and assessment through specification—assessment scenarios aren't written after content, they're part of the specification that generates both materials and assessments.

The feedback loop extends beyond initial development. Student performance metrics and feedback don't just trigger content revisions—they update specifications for the next regeneration. Engagement bottlenecks become new instructional requirements. Accessibility issues become constraints that affect all future generations. This iterative dance between specification, content, and learning reality is where true understanding emerges and where the traditional instructional design process transforms into a continuous evolution.

## Why SDD Matters Now for Course Development

Three trends make SDD not just possible but necessary for course creation:

First, AI capabilities have reached a threshold where natural language specifications can reliably generate working course content. This isn't about replacing instructional designers—it's about amplifying their effectiveness by automating the mechanical translation from specification to materials. It can amplify pedagogical exploration and creativity, support "start-over" easily, and support addition, subtraction, and critical thinking.

Second, course complexity continues to grow exponentially. Modern courses integrate dozens of resources, platforms, and delivery methods. Keeping all these pieces aligned with original learning objectives through manual processes becomes increasingly difficult. SDD provides systematic alignment through specification-driven generation. Learning platforms may evolve to provide AI-first support, not human-first support, or architect around reusable learning components.

Third, the pace of change in education accelerates. Learning objectives change far more rapidly today than ever before. Pivoting is no longer exceptional—it's expected. Modern course development demands rapid iteration based on student feedback, industry changes, and pedagogical innovations. Traditional course development treats these changes as disruptions. Each pivot requires manually propagating changes through documentation, design, and content. The result is either slow, careful updates that limit responsiveness, or fast, reckless changes that accumulate instructional debt.

SDD can support what-if/simulation experiments: "If we need to re-implement or change the course to focus on a different JavaScript framework, how would we adapt and experiment for that?"

SDD transforms learning objective changes from obstacles into normal workflow. When specifications drive content creation, pivots become systematic regenerations rather than manual rewrites. Change a core learning objective in the CRD, and affected instructional plans update automatically. Modify a student journey, and corresponding learning activities regenerate. This isn't just about initial course development—it's about maintaining instructional velocity through inevitable changes.

## Core Principles

**Specifications as the Lingua Franca**: The specification becomes the primary artifact. Course materials become its expression in a particular format and delivery method. Maintaining courses means evolving specifications.

**Executable Specifications**: Specifications must be precise, complete, and unambiguous enough to generate working learning modules. This eliminates the gap between learning intent and delivery.

**Continuous Refinement**: Consistency validation happens continuously, not as a one-time gate. AI analyzes specifications for ambiguity, contradictions, and gaps as an ongoing process.

**Research-Driven Context**: Research agents gather critical educational context throughout the specification process, investigating pedagogical options, accessibility implications, and institutional constraints.

**Bidirectional Feedback**: Student learning reality informs specification evolution. Metrics, feedback, and learning outcomes become inputs for specification refinement.

**Branching for Exploration**: Generate multiple instructional approaches from the same specification to explore different optimization targets—engagement, accessibility, learning effectiveness, resource efficiency.

## Implementation Approaches

Today, practicing SDD for course development requires assembling existing tools and maintaining discipline throughout the process. The methodology can be practiced with:

- AI assistants for iterative course specification development
- Research agents for gathering pedagogical and content context
- Content generation tools for translating specifications to learning materials
- Version control systems adapted for specification-first workflows
- Consistency checking through AI analysis of course specification documents

The key is treating course specifications as the source of truth, with materials as the generated output that serves the specification rather than the other way around.

## Streamlining SDD with Commands

The SDD methodology is significantly enhanced through three powerful commands that automate the specification → planning → tasking workflow:

### The `/speckit.specify` Command

This command transforms a simple feature description (the user-prompt) into a complete, structured specification with automatic repository management:

1. **Automatic Feature Numbering**: Scans existing specs to determine the next feature number (e.g., 001, 002, 003)
2. **Branch Creation**: Generates a semantic branch name from your description and creates it automatically
3. **Template-Based Generation**: Copies and customizes the feature specification template with your requirements
4. **Directory Structure**: Creates the proper `specs/[branch-name]/` structure for all related documents

### The `/speckit.plan` Command

Once a feature specification exists, this command creates a comprehensive implementation plan:

1. **Specification Analysis**: Reads and understands the feature requirements, user stories, and acceptance criteria
2. **Constitutional Compliance**: Ensures alignment with project constitution and architectural principles
3. **Technical Translation**: Converts business requirements into technical architecture and implementation details
4. **Detailed Documentation**: Generates supporting documents for data models, API contracts, and test scenarios
5. **Quickstart Validation**: Produces a quickstart guide capturing key validation scenarios

### The `/speckit.tasks` Command

After a plan is created, this command analyzes the plan and related design documents to generate an executable task list:

1. **Inputs**: Reads `plan.md` (required) and, if present, `data-model.md`, `contracts/`, and `research.md`
2. **Task Derivation**: Converts contracts, entities, and scenarios into specific tasks
3. **Parallelization**: Marks independent tasks `[P]` and outlines safe parallel groups
4. **Output**: Writes `tasks.md` in the feature directory, ready for execution by a Task agent

### Example: Building a Chat Feature

Here's how these commands transform the traditional development workflow:

**Traditional Approach:**

```text
1. Write a PRD in a document (2-3 hours)
2. Create design documents (2-3 hours)
3. Set up project structure manually (30 minutes)
4. Write technical specifications (3-4 hours)
5. Create test plans (2 hours)
Total: ~12 hours of documentation work
```

**SDD with Commands Approach:**

```bash
# Step 1: Create the feature specification (5 minutes)
/speckit.specify Real-time chat system with message history and user presence

# This automatically:
# - Creates branch "003-chat-system"
# - Generates specs/003-chat-system/spec.md
# - Populates it with structured requirements

# Step 2: Generate implementation plan (5 minutes)
/speckit.plan WebSocket for real-time messaging, PostgreSQL for history, Redis for presence

# Step 3: Generate executable tasks (5 minutes)
/speckit.tasks

# This automatically creates:
# - specs/003-chat-system/plan.md
# - specs/003-chat-system/research.md (WebSocket library comparisons)
# - specs/003-chat-system/data-model.md (Message and User schemas)
# - specs/003-chat-system/contracts/ (WebSocket events, REST endpoints)
# - specs/003-chat-system/quickstart.md (Key validation scenarios)
# - specs/003-chat-system/tasks.md (Task list derived from the plan)
```

In 15 minutes, you have:

- A complete feature specification with user stories and acceptance criteria
- A detailed implementation plan with technology choices and rationale
- API contracts and data models ready for code generation
- Comprehensive test scenarios for both automated and manual testing
- All documents properly versioned in a feature branch

### The Power of Structured Automation

These commands don't just save time—they enforce consistency and completeness:

1. **No Forgotten Details**: Templates ensure every aspect is considered, from non-functional requirements to error handling
2. **Traceable Decisions**: Every technical choice links back to specific requirements
3. **Living Documentation**: Specifications stay in sync with code because they generate it
4. **Rapid Iteration**: Change requirements and regenerate plans in minutes, not days

The commands embody SDD principles by treating specifications as executable artifacts rather than static documents. They transform the specification process from a necessary evil into the driving force of development.

### Template-Driven Quality: How Structure Constrains LLMs for Better Outcomes

The true power of these commands lies not just in automation, but in how the templates guide LLM behavior toward higher-quality specifications. The templates act as sophisticated prompts that constrain the LLM's output in productive ways:

#### 1. **Preventing Premature Implementation Details**

The feature specification template explicitly instructs:

```text
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
```

This constraint forces the LLM to maintain proper abstraction levels. When an LLM might naturally jump to "implement using React with Redux," the template keeps it focused on "users need real-time updates of their data." This separation ensures specifications remain stable even as implementation technologies change.

#### 2. **Forcing Explicit Uncertainty Markers**

Both templates mandate the use of `[NEEDS CLARIFICATION]` markers:

```text
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question]
2. **Don't guess**: If the prompt doesn't specify something, mark it
```

This prevents the common LLM behavior of making plausible but potentially incorrect assumptions. Instead of guessing that a "login system" uses email/password authentication, the LLM must mark it as `[NEEDS CLARIFICATION: auth method not specified - email/password, SSO, OAuth?]`.

#### 3. **Structured Thinking Through Checklists**

The templates include comprehensive checklists that act as "unit tests" for the specification:

```markdown
### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
```

These checklists force the LLM to self-review its output systematically, catching gaps that might otherwise slip through. It's like giving the LLM a quality assurance framework.

#### 4. **Constitutional Compliance Through Gates**

The implementation plan template enforces architectural principles through phase gates:

```markdown
### Phase -1: Pre-Implementation Gates
#### Simplicity Gate (Article VII)
- [ ] Using ≤3 projects?
- [ ] No future-proofing?
#### Anti-Abstraction Gate (Article VIII)
- [ ] Using framework directly?
- [ ] Single model representation?
```

These gates prevent over-engineering by making the LLM explicitly justify any complexity. If a gate fails, the LLM must document why in the "Complexity Tracking" section, creating accountability for architectural decisions.

#### 5. **Hierarchical Detail Management**

The templates enforce proper information architecture:

```text
**IMPORTANT**: This implementation plan should remain high-level and readable.
Any code samples, detailed algorithms, or extensive technical specifications
must be placed in the appropriate `implementation-details/` file
```

This prevents the common problem of specifications becoming unreadable code dumps. The LLM learns to maintain appropriate detail levels, extracting complexity to separate files while keeping the main document navigable.

#### 6. **Test-First Thinking**

The implementation template enforces test-first development:

```text
### File Creation Order
1. Create `contracts/` with API specifications
2. Create test files in order: contract → integration → e2e → unit
3. Create source files to make tests pass
```

This ordering constraint ensures the LLM thinks about testability and contracts before implementation, leading to more robust and verifiable specifications.

#### 7. **Preventing Speculative Features**

Templates explicitly discourage speculation:

```text
- [ ] No speculative or "might need" features
- [ ] All phases have clear prerequisites and deliverables
```

This stops the LLM from adding "nice to have" features that complicate implementation. Every feature must trace back to a concrete user story with clear acceptance criteria.

### The Compound Effect

These constraints work together to produce specifications that are:

- **Complete**: Checklists ensure nothing is forgotten
- **Unambiguous**: Forced clarification markers highlight uncertainties
- **Testable**: Test-first thinking baked into the process
- **Maintainable**: Proper abstraction levels and information hierarchy
- **Implementable**: Clear phases with concrete deliverables

The templates transform the LLM from a creative writer into a disciplined specification engineer, channeling its capabilities toward producing consistently high-quality, executable specifications that truly drive development.

## The Constitutional Foundation: Enforcing Architectural Discipline

At the heart of SDD lies a constitution—a set of immutable principles that govern how specifications become code. The constitution (`memory/constitution.md`) acts as the architectural DNA of the system, ensuring that every generated implementation maintains consistency, simplicity, and quality.

### The Nine Articles of Development

The constitution defines nine articles that shape every aspect of the development process:

#### Article I: Library-First Principle

Every feature must begin as a standalone library—no exceptions. This forces modular design from the start:

```text
Every feature in Specify MUST begin its existence as a standalone library.
No feature shall be implemented directly within application code without
first being abstracted into a reusable library component.
```

This principle ensures that specifications generate modular, reusable code rather than monolithic applications. When the LLM generates an implementation plan, it must structure features as libraries with clear boundaries and minimal dependencies.

#### Article II: CLI Interface Mandate

Every library must expose its functionality through a command-line interface:

```text
All CLI interfaces MUST:
- Accept text as input (via stdin, arguments, or files)
- Produce text as output (via stdout)
- Support JSON format for structured data exchange
```

This enforces observability and testability. The LLM cannot hide functionality inside opaque classes—everything must be accessible and verifiable through text-based interfaces.

#### Article III: Test-First Imperative

The most transformative article—no code before tests:

```text
This is NON-NEGOTIABLE: All implementation MUST follow strict Test-Driven Development.
No implementation code shall be written before:
1. Unit tests are written
2. Tests are validated and approved by the user
3. Tests are confirmed to FAIL (Red phase)
```

This completely inverts traditional AI code generation. Instead of generating code and hoping it works, the LLM must first generate comprehensive tests that define behavior, get them approved, and only then generate implementation.

#### Articles VII & VIII: Simplicity and Anti-Abstraction

These paired articles combat over-engineering:

```text
Section 7.3: Minimal Project Structure
- Maximum 3 projects for initial implementation
- Additional projects require documented justification

Section 8.1: Framework Trust
- Use framework features directly rather than wrapping them
```

When an LLM might naturally create elaborate abstractions, these articles force it to justify every layer of complexity. The implementation plan template's "Phase -1 Gates" directly enforce these principles.

#### Article IX: Integration-First Testing

Prioritizes real-world testing over isolated unit tests:

```text
Tests MUST use realistic environments:
- Prefer real databases over mocks
- Use actual service instances over stubs
- Contract tests mandatory before implementation
```

This ensures generated code works in practice, not just in theory.

### Constitutional Enforcement Through Templates

The implementation plan template operationalizes these articles through concrete checkpoints:

```markdown
### Phase -1: Pre-Implementation Gates
#### Simplicity Gate (Article VII)
- [ ] Using ≤3 projects?
- [ ] No future-proofing?

#### Anti-Abstraction Gate (Article VIII)
- [ ] Using framework directly?
- [ ] Single model representation?

#### Integration-First Gate (Article IX)
- [ ] Contracts defined?
- [ ] Contract tests written?
```

These gates act as compile-time checks for architectural principles. The LLM cannot proceed without either passing the gates or documenting justified exceptions in the "Complexity Tracking" section.

### The Power of Immutable Principles

The constitution's power lies in its immutability. While implementation details can evolve, the core principles remain constant. This provides:

1. **Consistency Across Time**: Code generated today follows the same principles as code generated next year
2. **Consistency Across LLMs**: Different AI models produce architecturally compatible code
3. **Architectural Integrity**: Every feature reinforces rather than undermines the system design
4. **Quality Guarantees**: Test-first, library-first, and simplicity principles ensure maintainable code

### Constitutional Evolution

While principles are immutable, their application can evolve:

```text
Section 4.2: Amendment Process
Modifications to this constitution require:
- Explicit documentation of the rationale for change
- Review and approval by project maintainers
- Backwards compatibility assessment
```

This allows the methodology to learn and improve while maintaining stability. The constitution shows its own evolution with dated amendments, demonstrating how principles can be refined based on real-world experience.

### Beyond Rules: A Development Philosophy

The constitution isn't just a rulebook—it's a philosophy that shapes how LLMs think about code generation:

- **Observability Over Opacity**: Everything must be inspectable through CLI interfaces
- **Simplicity Over Cleverness**: Start simple, add complexity only when proven necessary
- **Integration Over Isolation**: Test in real environments, not artificial ones
- **Modularity Over Monoliths**: Every feature is a library with clear boundaries

By embedding these principles into the specification and planning process, SDD ensures that generated code isn't just functional—it's maintainable, testable, and architecturally sound. The constitution transforms AI from a code generator into an architectural partner that respects and reinforces system design principles.

## The Transformation

This isn't about replacing developers or automating creativity. It's about amplifying human capability by automating mechanical translation. It's about creating a tight feedback loop where specifications, research, and code evolve together, each iteration bringing deeper understanding and better alignment between intent and implementation.

Software development needs better tools for maintaining alignment between intent and implementation. SDD provides the methodology for achieving this alignment through executable specifications that generate code rather than merely guiding it.
