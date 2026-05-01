# CREDO Manual QA Checklist

Use this checklist on a real phone before release-candidate review. Do not use it to add features; use it to find usability and readiness issues.

## Sunday Home

- First launch routes through Welcome and onboarding, then lands on Sunday.
- Bottom tabs show only Sunday, Mass, Live.
- Primary CTA matches the current mocked sacred-time state.
- Secondary actions remain reachable without feeling like four equal home choices.
- Text fits on a small phone without clipping.
- One-handed reach feels reasonable for primary action.

## Prepare

- Prepare opens from Sunday.
- Flow has exactly three steps: Readings, What to Notice, Bring this to Mass.
- Back and Continue controls work.
- Final CTA opens Prayer Mode.
- No doctrine maps, source library, or expanded platform features appear.

## Prayer Mode

- Prayer Mode is full screen and hides bottom tabs.
- Exit returns cleanly to the prior app location.
- Guide / Quiet toggle works and is easy to understand.
- Previous / Next controls advance through Mass sections.
- Jump to Section opens, scrolls if needed, and jumps correctly.
- Save for after Mass gives a clear saved state.
- Text remains readable at arm's length in a pew.
- Touch targets are comfortable with one thumb.
- No streaks, premium prompts, social sharing, or clutter appear.

## Receive

- Receive prompt feels gentle and optional.
- User can type and save a reflection.
- Prompt chips can be selected and saved.
- Skip routes to Live without guilt language.
- Saved confirmation appears after saving.

## Live

- Live tab shows This Week, Saved from Mass, and Reflections.
- Saved Mass moments appear after saving from Prayer Mode.
- Saved reflections appear immediately after Receive.
- Reset local test data works for QA without exposing production-only features.
- No duplicate nested Live screen is reachable.

## Offline Behavior

- Launch the app after airplane mode is enabled.
- Sunday, Prepare, Prayer Mode, Receive, and Live still render.
- Prayer Mode content loads from local data.
- Saving Mass moments and reflections works offline.
- Restarting the app preserves saved local state.

## Low-Light Readability

- Prayer Mode is readable in a dim room.
- Contrast is sufficient for section title, main text, responses, and controls.
- Bright UI elements do not feel harsh.
- Controls remain visible without becoming distracting.

## One-Handed Usability

- Primary CTAs can be reached with one thumb.
- Prayer Mode Next, Previous, Save, Jump, and Exit are tappable without precision.
- Long text does not force awkward repeated scrolling during Mass.
- Jump to Section is forgiving if the user gets lost.
