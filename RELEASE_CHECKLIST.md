# CREDO Release Checklist

## Required Checks

- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npm test -- --runInBand`.
- Run `npm run build:smoke`.
- Run `npm run smoke`.

## Manual Usability Pass

- First launch opens Welcome, then onboarding routes to Sunday.
- Bottom navigation shows only Sunday, Mass, Live.
- All Live actions route to the bottom Live tab; there is no nested Sunday Live screen.
- Sunday routes into Prepare, Prayer Mode, Receive, and Live without dead controls.
- Prayer Mode hides tabs, supports Guide/Quiet, Jump to Section, previous/next, and Save for after Mass.
- Receive can save or skip without guilt language.
- Live shows This Week, Saved from Mass, and Reflections.
- Forbidden features remain absent: Treasury, Mercy Companion, Domestic Church, School of Faith, AI, Premium, Social, Parish Dashboard.
