# Changelog

All notable changes to lcluster will be documented here.

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

### Coming in v1.0.1
- Custom Discord bot integration with token support
- Rich customizable bot messages and commands
