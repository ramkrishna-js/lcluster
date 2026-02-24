<div align="center">
  <img src="docs/public/logo.svg" height="80" alt="lcluster logo" />
  <h1>lcluster</h1>
  <p>A powerful Lavalink cluster manager for your terminal.</p>

  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue" />
    <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-green" />
    <img src="https://img.shields.io/badge/license-GPLv3-purple" />
    <img src="https://img.shields.io/badge/built%20with-Claude%20AI-orange" />
  </p>
</div>

---

## What is lcluster

lcluster is a terminal-based Lavalink cluster manager. Run multiple
Lavalink nodes — via Docker or Java process — and manage them all
from one beautiful full-screen TUI dashboard.

Your Discord bot connects to one single gateway address. lcluster
handles routing, load balancing, session tracking, and failover
behind the scenes. Your bot never knows there is a cluster.

---

## Features

- 🖥  Full-screen terminal dashboard (built with Ink)
- ⬡  Single gateway endpoint for your Discord bot
- 🐋  Docker and Java process node support
- 🔌  External node auto-connect (bring your own Lavalink)
- 🔀  Smart load balancing — least players, lowest CPU, round robin
- ♻️  Automatic failover and session migration
- 🔔  Discord webhook alerts for node events
- 🖥  Ubuntu systemd auto-start support
- 🎨  3 built-in themes — Neon, Minimal, Amber
- ⚡  Tiny RAM footprint — built to be lean

---

## Requirements

- Node.js 18 or higher
- Java 17 or higher (for process mode nodes)
- Docker (optional, for Docker mode nodes)

---

## Installation

```bash
npm install -g lcluster
```

Or install from source:

```bash
git clone https://github.com/yourname/lcluster.git
cd lcluster
npm install
npm link
```

---

## Quick Start

```bash
# Run the setup wizard
lcluster init

# Open the dashboard
lcluster
```

---

## CLI Commands

| Command | Description |
|---|---|
| `lcluster` | Open the TUI dashboard |
| `lcluster init` | Run the setup wizard |
| `lcluster ps` | List all nodes in terminal |
| `lcluster start <name>` | Start a node |
| `lcluster stop <name>` | Stop a node |
| `lcluster restart <name>` | Restart a node |
| `lcluster logs <name>` | Tail logs for a node |

---

## Connecting Your Bot

Point your Lavalink client at lcluster instead of a raw Lavalink node.
No changes needed in your bot code — lcluster speaks standard Lavalink v4.

```js
// Riffy example
const nodes = [{
  host: "localhost",
  port: 2333,          // your lcluster gateway port
  password: "yourpassword",
  secure: false
}]
```

Works with Riffy, Shoukaku, Moonlink, Vulkava, and any other
Lavalink v4 compatible client.

---

## Dashboard Preview

```
╔═════════════════════════════════════════════════════════════════════╗
║  ⬡ lcluster v1.0.0    ● 2 online  ⚠ 1 warn    gateway :2333  ●   ║
╚═════════════════════════════════════════════════════════════════════╝

  ┌─ nodes (3/5) ──────────────────────────────────── [↑↓ scroll] ─┐
  │                                                                  │
  │    ●  node-main                              ↑ 2d 4h 12m        │
  │       default.yml  ·  process                ● online           │
  │       ♪ 12   ⚡ 18ms   CPU ▓▓░░░░░░ 34%   MEM ▓▓░░░░░░ 29%    │
  │                                                                  │
  │ ▶  ●  node-docker                            ↑ 6h 12m           │
  │       high-mem.yml  ·  docker 🐋             ● online           │
  │       ♪ 7    ⚡ 22ms   CPU ▓▓▓▓░░░░ 58%   MEM ▓▓▓▓▓░░░ 71%    │
  │                                                                  │
  │    ⚠  node-backup                            ↑ 1d 2h            │
  │       minimal.yml  ·  process                ⚠ degraded         │
  │       ♪ 0    ⚡ 140ms  CPU ▓░░░░░░░ 12%   MEM ▓░░░░░░░ 18%    │
  │                                                                  │
  └──────────────────────────────────────────────────────────────────┘

  [↑↓] navigate  [enter] manage  [n] new  [t] templates  [q] quit
```

---

## Documentation

Full documentation at **https://lcluster.dev**

---

## Roadmap

- [x] v1.0.0 — Core cluster manager, TUI dashboard, gateway, alerts
- [ ] v1.0.1 — Custom Discord bot integration with token support

---

## Credits

lcluster was designed and built by **Ram Krishna** with architecture,
planning, and code assistance from **Claude**, an AI built by Anthropic.

---

## License

GPL-3.0
