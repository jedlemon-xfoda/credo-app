# Attend Mockup Reference Pack

Drop this folder into your project root. Recommended location:

```text
docs/mockups/
```

This pack contains paired current-app screenshots and canonical mockup references for screen-by-screen fidelity work.

Use it with Claude for visual analysis and asset direction, then with Codex for implementation.

## Suggested workflow

1. Pick one folder/screen.
2. Give Claude `current.png`, `mockup.*`, and `notes.md`.
3. Ask Claude for forensic visual deltas only.
4. Give Codex the same files plus Claude's deltas.
5. Ask Codex for the smallest safe implementation patch.
6. Re-run the app and replace `current.png` with the new screenshot.
7. Repeat until the screen matches.

## Important rule

Do not ask for a broad redesign. Work screen-by-screen.
