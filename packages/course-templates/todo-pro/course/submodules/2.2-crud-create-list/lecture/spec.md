# Lecture Spec — 2.2 CRUD: Create + List

## Learning objectives
- Explain why we validate at the boundary of the system.
- Implement Create + List in a service layer (not in the controller).
- Describe DTO vs DB model and why separation helps.

## Concepts to teach
- Validation boundaries: never trust input
- DTO vs persistence model
- Service layer responsibilities
- Error handling contract (AppError)

## Example (must be DIFFERENT from assignment)
Use a different domain object than "todo" (e.g., "notes").
Show:
- Zod schema for note input
- A service function that validates and returns a DTO

## Common pitfalls
- DB calls inside controllers
- Returning raw DB rows directly
- Not scoping list results to userId

## Check-for-understanding questions
1. Where should validation happen and why?
2. Why avoid DB logic inside controllers?
3. Difference between DTO and DB model?
