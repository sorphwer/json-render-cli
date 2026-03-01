# Use Case: Ticket Table

Use this when rows follow ticket/issue semantics: `ID`, `Priority`, `Status`, `Assignee`, `Updated`, `Topic/Subject`.

## Load These Files

For a single row:
1. `references/compact-ticket-template.md`
2. `references/compact-ticket-spec.template.json`

For multiple rows (default when row count > 1):
1. `references/compact-ticket-list-template.md`
2. `references/compact-ticket-list-spec.template.json`

## Layout Guidance

- Keep six standard columns in a stable order.
- Use `Badge` for `Priority` and `Status`.
- Keep deterministic widths for consistent snapshots.
- Enable `screenshot.fullPage=true` if row count or wrapping is variable.
- Accept field aliases such as `Subject/Topic` and `Updated/Updated (UTC)`, but validate missing required fields before rendering.
