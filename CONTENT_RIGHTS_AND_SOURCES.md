# CREDO Content Rights and Sources

This file tracks source, permission status, text status, and licensing notes for v1 validation. It is not a legal approval record.

| Source | Permission Status | textStatus | Licensing Notes |
| --- | --- | --- | --- |
| Local MockProvider Mass companion data | Internal placeholder only | `placeholder-license-pending` | Current Mass companion entries are local mock/paraphrase content. Exact liturgical prayers and responses must be verified before production release. |
| Vatican website / GIRM references | Reference linking only | `reference-metadata-only` | Current app uses source references and citations, not copied long-form Vatican text. Verify citation accuracy and permitted excerpt rules before adding more text. |
| USCCB | Not integrated | `licensed-pending-verification` | `USCCBProvider` is a prototype adapter only. Do not ship exact readings, psalms, or liturgical texts until permissions and attribution requirements are confirmed. |
| Universalis | Not integrated | `licensed-pending-verification` | `UniversalisProvider` is a stub only. Do not ship content from this source until API/data access and license terms are confirmed. |
| Evangelizo | Not integrated | `licensed-pending-verification` | `EvangelizoProvider` is a stub only. Do not ship content from this source until API/data access, attribution, and license terms are confirmed. |
| CREDO original devotional copy | Internal authored copy | `original-app-copy` | Short explanations, meaning lines, and UX copy are app-authored unless otherwise marked. Maintain source metadata when any external wording is introduced. |

## Current Rule

All liturgical companion sections must include:

- `sourceProvider`
- `textStatus`
- `licensingNote` when permissions are pending or uncertain

## Production Gate

Before release, replace placeholders with licensed text, public-domain text, or keep placeholders removed from user-facing screens. Any exact prayer, response, reading, or official document excerpt needs a confirmed source and rights note.
