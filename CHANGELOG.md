# Changelog

All notable changes to lcluster will be documented here.

---

## [1.0.1] — Bug Fixes & Pre-built Templates
### Fixed
- Fixed a devastating `ERR_MODULE_NOT_FOUND` bug preventing the CLI (`cli.js`) from correctly booting up via `tsx` when installed as a global package by enforcing absolute `import.meta.resolve` references.

### Added
- Created Github Actions `publish.yml` workload.
- Created `bug_report.md` and `feature_request.md` Issue templates, and a Pull Request template.
- Introduced 3 completely new natively available templates: `robust.yml`, `youtube-only.yml`, and `all-filters.yml`.
- Expanded the TUI "Templates" view to allow the creation of new templates natively from the dashboard or safely delete custom ones.
- Designed 3 brand new terminal styling themes available in `Settings`: `Cyberpunk`, `Hacker`, and `Deep Ocean`.

---

## [1.0.0] — Initial Release

### Added
- Full-screen TUI dashboard built with Ink
- Single gateway endpoint — standard Lavalink v4 protocol
- Multi-node support — process mode and Docker mode
- External node auto-connect mode
- Session map and guild map for O(1) session routing
- Automatic failover and session migration
- Health check system with degraded and offline states
- Load balancing strategies — least players, lowest CPU, round robin
- Template system — built-in and custom application.yml support
- Discord webhook alerts for node events
- Desktop notifications for node events
- CPU threshold monitoring
- Init wizard with system checks, theme picker, gateway setup
- Ubuntu systemd auto-start installer
- 3 built-in themes — Cyberpunk Neon, Clean Minimal, Retro Amber
- CLI commands — init, ps, start, stop, restart, logs
- Full documentation site built with Nextra
