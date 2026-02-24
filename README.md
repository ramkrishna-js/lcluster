<div align="center">
  <img src="docs/public/logo.svg" height="80" alt="lcluster logo" />
  <h1>lcluster</h1>
  <p>A powerful Lavalink cluster manager for your terminal.</p>

  <p>
    <img src="https://img.shields.io/badge/version-1.0.2--beta-blue" />
    <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-green" />
    <img src="https://img.shields.io/badge/license-GPLv3-purple" />
    <img src="https://img.shields.io/badge/built%20with-Claude%20AI-orange" />
  </p>
</div>

---

## What is lcluster

**lcluster** is a terminal-based Lavalink cluster manager built for developers and server administrators. Run multiple Lavalink nodes — via Docker or Java process — and manage them all natively from one beautiful, fully-responsive, full-screen TUI dashboard.

Your Discord bot connects to one single gateway address. **lcluster** powerfully handles all routing, load balancing, session tracking, and seamless failover behind the scenes. Your bot never knows there is a cluster, it just sees one highly available, extremely robust Lavalink node.

---

## Features

- 🖥️ **Full-Screen Terminal Dashboard**: Native visual management built on top of modern React/Ink.
- ⬡ **Single Gateway Endpoint**: Connect your bot to one port, let lcluster handle the rest.
- 🐋 **Multi-Environment Spawning**: Natively spins up Docker containers or standalone Java processes.
- 🔌 **External Node Auto-Connect**: Bring your own existing Lavalink node and monitor it seamlessly.
- 🔀 **Intelligent Load Balancing**: Chooses nodes based on `least players`, `lowest CPU`, or `round robin`.
- ♻️ **Automatic Failover & Migration**: Seamless session migration if a node crashes.
- 🔔 **Discord Webhook Alerts**: Real-time integration and monitoring piped directly to your Discord channel.
- 🖥️ **Systemd Auto-Start**: Built-in Ubuntu/Linux daemon installation.
- 🎨 **Adaptive Themes**: 3 gorgeous built-in TUI themes — Cyberpunk Neon, Clean Minimal, and Retro Amber.
- ⚡ **Extremely Lightweight**: Tiny memory footprint natively optimizing underlying resources.

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

## TUI Dashboard Layout

```
╔═════════════════════════════════════════════════════════════════════╗
║  ⬡ lcluster v1.0.2-beta    ● 2 online  ⚠ 1 warn    gateway :2333  ●  ║
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

## Configuration

All local data, nodes, templates, and configurations are securely stored within `~/.lcluster/`:

- `~/.lcluster/config.yml`: Global settings, themes, alerts, and gateway credentials.
- `~/.lcluster/nodes.json`: Node registry mapping.
- `~/.lcluster/templates/`: Local customized `application.yml` configs for dynamic deployment.
- `~/.lcluster/nodes/`: Operating directory holding the `Lavalink.jar` and `application.yml` for process nodes.

---

## Documentation

Full architectural guides, TUI maps, setup instructions, and deployment strategies are absolutely free and publicly available at: 

🔗 **[https://lcluster.dev](https://lcluster.dev)**

---

## Credits

lcluster was designed and built by **Ram Krishna** with architecture,
planning, and code assistance from **Claude**, an AI built by Anthropic.

---

## License

GPL-3.0
