# Course Spec Kit Adaptation

This document describes the adaptation of the original [github/spec-kit](https://github.com/github/spec-kit) for course design and development.

## Overview

Course Spec Kit is a fork of GitHub's Spec Kit, adapted specifically for **Spec-Driven Course Development (SDD)**. While the command structure and workflow remain identical, all content, templates, and guidance have been adapted from software development to educational contexts.

## Key Changes

### 1. Terminology Updates

| Original (Software Dev) | Adapted (Course Dev) |
|------------------------|----------------------|
| Feature specification | Learning module specification |
| Product Requirements Document (PRD) | Course Requirements Document (CRD) |
| User stories | Learning journeys / Student journeys |
| Functional requirements | Learning objectives / outcomes |
| Acceptance criteria | Assessment scenarios |
| Technical implementation plan | Instructional plan |
| Data model | Learning model / Concept model |
| API contracts | Assessment instruments |
| Code generation | Content generation |
| Testing | Assessment |
| Development team | Instructional team |

### 2. Branding Updates

- **Toolkit Name**: "Spec Kit" → "Course Spec Kit"
- **CLI Banner**: "SPECIFY" → "COURSE"
- **Tagline**: "Spec-Driven Development Toolkit" → "Spec-Driven Course Development Toolkit"
- **Repository**: `github/spec-kit` → `daqi/course-spec-kit`

### 3. Template Adaptations

#### Constitution Template (`memory/constitution.md`)
- **Before**: Project principles (Library-First, CLI Interface, Test-First, etc.)
- **After**: Course principles (Hands-On Learning First, Real-World Projects, Assessment-First, Accessibility Standards, etc.)

#### Spec Template (`templates/spec-template.md`)
- **Before**: Feature Specification with User Stories & Testing
- **After**: Learning Module Specification with Student Learning Journeys & Assessment
- **Before**: Functional Requirements (FR-001, FR-002, etc.)
- **After**: Learning Objectives (LO-001, LO-002, etc.)
- **Before**: Key Entities (data model)
- **After**: Key Concepts (learning topics)

#### Command Templates

**`specify.md`**:
- Creates learning module specifications instead of feature specifications
- Focuses on learning outcomes instead of functional requirements
- Validates against assessment criteria instead of test criteria

**`constitution.md`**:
- Creates course constitutions with pedagogical principles
- Focuses on instructional guidelines instead of development practices

**`plan.md`**:
- Creates instructional plans instead of implementation plans
- Generates learning-model.md instead of data-model.md
- Generates assessments/ instead of contracts/
- Generates lesson-plan.md instead of quickstart.md

**`tasks.md`**:
- Organizes tasks by learning journey instead of user story
- Focuses on content development instead of code implementation
- Uses assessment-first approach instead of test-first approach

**`implement.md`**:
- Executes course development instead of software implementation
- Validates against accessibility and engagement checklists instead of UX and security checklists

### 4. Methodology Documentation

**`spec-driven.md`**:
- Adapted from software development to course development
- Changed "The Power Inversion" section to focus on course materials vs. specifications
- Updated workflow to focus on learning outcomes and pedagogical decisions
- Changed examples from software scenarios to educational scenarios
- Updated principles to reflect educational contexts

**`README.md`**:
- Updated all examples to use course development scenarios
- Changed installation examples to reference daqi/course-spec-kit
- Updated Quick Start examples to show JavaScript web development course creation
- Adapted all documentation to educational terminology

### 5. CLI Updates

**`src-js/index.ts`** and **`src-js/config.ts`**:
- Updated CLI branding to reference "course projects" instead of general "projects"
- Modified configuration to support educational use cases
- Updated command descriptions to use educational terminology

## Command Structure (Unchanged)

The commands remain the same for ease of use:

```bash
/course.constitution   # Create or update course governing principles
/course.specify        # Define learning module specifications
/course.plan          # Create instructional plans
/course.tasks         # Generate actionable task lists
/course.implement     # Execute course development
```

## Target Audience

This toolkit is designed for:
- **Instructional designers** creating online courses
- **Subject matter experts** developing course content
- **Educational technologists** implementing learning experiences
- **Course developers** building structured learning programs

## Use Case: JavaScript Web Development Course

Example workflow for creating an interactive JavaScript course module:

```bash
# 1. Initialize course project
specify init my-js-course --ai copilot

# 2. Establish course principles
/course.constitution Create principles focused on learning outcomes, student engagement, accessibility standards, and assessment quality for a JavaScript web development course

# 3. Define a learning module
/course.specify Create a module that teaches students how to build interactive web applications using modern JavaScript. Students should learn asynchronous programming concepts, DOM manipulation, and event handling.

# 4. Create instructional plan
/course.plan The course uses interactive coding exercises with vanilla JavaScript, HTML, and CSS. Students will work on hands-on projects using browser-based development environments.

# 5. Generate tasks
/course.tasks

# 6. Execute development
/course.implement
```

## Technology Focus

While the toolkit is technology-agnostic, this fork emphasizes:
- **JavaScript-focused** course content (as mentioned in the problem statement: "使用js技术栈替代python")
- **Browser-based** development environments
- **Interactive** learning experiences
- **Hands-on** coding exercises

## Compatibility

This fork maintains full compatibility with all AI agents supported by the original Spec Kit:
- Claude Code
- GitHub Copilot
- Gemini CLI
- Cursor
- Windsurf
- And others

## Contributing

When contributing to this fork:
1. Maintain the course development focus
2. Use educational terminology consistently
3. Provide examples from instructional design contexts
4. Ensure templates support diverse learning scenarios

## License

This project maintains the same MIT license as the original github/spec-kit.

## Acknowledgments

This project is a fork of [github/spec-kit](https://github.com/github/spec-kit), created by the GitHub team and influenced by the work of [John Lam](https://github.com/jflam). We are grateful for their pioneering work in Spec-Driven Development.
