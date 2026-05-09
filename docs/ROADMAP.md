# Roadmap

Current version: `v0.4.0`

Final target: `v1.0.0` no later than `2026-05-10`

## Version Plan

| Version | Target Date | Focus |
| --- | --- | --- |
| `v0.1.0` | `2026-05-08` | Project setup |
| `v0.2.0` | `2026-05-08` | Database foundation |
| `v0.3.0` | `2026-05-09` | Category management |
| `v0.4.0` | `2026-05-09` | Item management |
| `v0.5.0` | `2026-05-09` | Dashboard summary |
| `v0.6.0` | `2026-05-09` | Photo upload |
| `v0.7.0` | `2026-05-10` | Help and demo polish |
| `v0.8.0` | `2026-05-10` | CI and deployment |
| `v1.0.0` | `2026-05-10` | Demo release |

## Work Tracking Flow

```text
Roadmap -> GitHub Milestone -> GitHub Issue -> feature branch -> dev -> main -> release tag
```

## Immediate Next Steps

- [x] Scaffold the Next.js application.
- [x] Add database schema foundation.
- [x] Add database migration and seed script.
- [ ] Configure a real `DATABASE_URL`.
- [ ] Run database migration and seed against the target database.
- [ ] Add GitHub Actions CI after the database foundation is verified.
