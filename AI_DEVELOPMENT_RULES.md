# SustainOpt — AI Development Rules

## Project Objective

SustainOpt is a sustainability decision-support platform that combines:

* Sustainability metrics
* Sustainability Health Index
* Sustainability scoring
* Recommendations
* Decision optimization
* Action interaction analysis
* Feedback
* Scenario simulation
* Digital-twin-style sustainability state modeling
* Analytics
* Sustainability reporting

The existing implementation must be preserved and improved incrementally.

---

## Critical Development Rules

1. NEVER rebuild SustainOpt from scratch.

2. ALWAYS inspect existing code before modifying it.

3. Preserve working functionality.

4. Do not redesign the architecture unless there is a demonstrable technical reason.

5. Do not replace working implementations with mock implementations.

6. Do not create duplicate services, controllers, entities, APIs, or frontend pages.

7. Before creating a new class/component, search the repository to determine whether an equivalent already exists.

8. Keep frontend and backend API contracts synchronized.

9. Do not use hardcoded organization IDs, user IDs, or business data where dynamic values are expected.

10. Never use `any` to hide TypeScript problems.

11. Never disable compiler/linter rules simply to make the build pass.

12. Never remove functionality simply to eliminate an error.

13. Do not modify unrelated modules while completing a specific task.

14. After every implementation:

    * compile/build
    * test the affected functionality
    * report errors
    * report files changed

15. If an issue is discovered outside the current task, document it instead of silently modifying unrelated code.

16. Do not claim a feature is complete unless its implementation has actually been verified.

17. Distinguish clearly between:

    * Implemented
    * Partially implemented
    * Mock/static
    * Broken
    * Missing

18. Do not describe rule-based logic as AI/ML unless an actual AI/ML implementation exists.

19. Do not describe a snapshot system as a complete digital twin unless the required state, simulation, prediction, and feedback capabilities are actually implemented.

20. Do not claim research-grade optimization or algorithmic validity without evidence.

---

## Development Workflow

For every task:

### STEP 1 — Inspect

Understand the existing implementation.

### STEP 2 — Plan

Identify the minimum files that need modification.

### STEP 3 — Implement

Make the smallest correct changes.

### STEP 4 — Verify

Run appropriate builds/tests.

### STEP 5 — Report

Provide:

* Files changed
* What changed
* Why it changed
* Tests/build executed
* Result
* Remaining issues

Then STOP.

Do not automatically begin the next task.

---

## Code Quality

Prefer:

* Clean architecture
* Strong typing
* DTOs
* Validation
* Proper exception handling
* REST conventions
* Secure authentication
* Maintainable services
* Reusable frontend components
* Meaningful naming
* Separation of concerns

Avoid:

* duplicated code
* unnecessary abstractions
* hardcoded business values
* silent failures
* placeholder implementations
* fake data presented as real data

---

## Security

Never commit:

* passwords
* JWT secrets
* API keys
* database credentials

Use environment variables/configuration for secrets.

---

## Final Principle

SustainOpt must become a genuinely working application.

Correctness is more important than claiming feature completeness.
