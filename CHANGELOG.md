# Changelog

All notable changes to lcluster will be documented here.

---

## [1.0.2] — Custom Bots & Custom Themes Engine
### Added
- **Custom Themes Engine**: Dynamically load hex-codes from a raw `custom.json` template by selecting the new `< custom >` element selector in the Settings menu. Execute `lcluster theme` to generate a boilerplate for this configuration instantly. 
- **Custom Bot Scaffolding**: Reconfigured the application ecosystem to automatically house and mount a specialized user-defined discord bot via `bots/template.js` bound intrinsically to the standard gateway and node cycle logic. 
- You can now specify an explicit `Discord Token` embedded via a hidden masked field inside the TUI `Settings.jsx` which automatically securely launches the bot logic as an attached background Daemon when the UI boots.

### Changed
- Refactored ESM bindings in the `cli.js` entrypoint router to safely identify absolute `import` paths compared to previous generic `require()` dependencies.
- Added protective bounds targeting global `node_module` installations for beta/local-sandbox builds safely prohibiting live overriding.

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
