import { Command } from 'commander';
import chalk from 'chalk';
import { renderTui } from './tui/index.jsx';
import { spawnProcess } from './spawner/process.js';
import { spawnDocker } from './spawner/docker.js';
import { initWizard } from './tui/init/index.jsx';
import { getAllNodes, getNode } from './core/registry.js';
import { loadNodes } from './core/registry.js';
import { initAlerts } from './alerts/index.js';

export async function runCLI() {
    initAlerts();
    const program = new Command();

    program
        .name('lcluster')
        .description('⬡ lcluster — Lavalink Cluster Manager')
        .version(`
  ⬡ lcluster v1.0.2-beta

  Built by Ram Krishna & Claude (Anthropic AI)
  Lavalink Cluster Manager for Node.js
`, '-v, --version', 'output the version number')
        .addHelpText('after', '\n  Docs: https://lcluster.dev\n');

    program
        .command('ui', { isDefault: true })
        .description('opens full TUI dashboard')
        .action(() => {
            renderTui();
        });

    program
        .command('init')
        .description('runs the setup wizard')
        .addHelpText('before', `
  lcluster init — First time setup wizard

  This command walks you through:
    · Checking your system (Java, Docker, ports)
    · Choosing a theme for the TUI
    · Setting up the gateway (port + password)
    · Adding your first Lavalink node
    · Optionally installing as a systemd service (Ubuntu only)

  Run this once after installing lcluster.
  Safe to re-run — will not overwrite existing nodes without confirmation.
`)
        .action(async () => {
            await initWizard();
        });

    program
        .command('ps')
        .description('prints node list to terminal, no TUI')
        .addHelpText('before', `
  lcluster ps — List all registered nodes

  Shows a table of all nodes with:
    · Name, template, mode, status, players, ping

  Does not open the TUI. Output is plain terminal text.
  Useful for quick checks from scripts or without a full terminal.
`)
        .action(() => {
            loadNodes();
            const nodes = getAllNodes();
            console.log(chalk.bold('  lcluster — node list\n'));
            console.log(`  ${'NAME'.padEnd(15)} ${'TEMPLATE'.padEnd(16)} ${'MODE'.padEnd(11)} ${'STATUS'.padEnd(14)} ${'PLAYERS'.padEnd(9)} ${'PING'}`);
            console.log('  ' + '─'.repeat(74));
            nodes.forEach(n => {
                const modeStr = n.mode === 'external' ? 'external ⟳' : n.mode;
                const templateStr = n.mode === 'external' ? '—' : (n.template || 'unknown');
                const isOnline = n.status === 'online';

                let rawStatus = n.status || 'offline';
                let statusColor;
                if (rawStatus === 'waiting') statusColor = chalk.gray('⟳ waiting');
                else if (rawStatus === 'reconnecting') statusColor = chalk.yellow('⚠ reconnecting');
                else if (rawStatus === 'unreachable') statusColor = chalk.red('✕ unreachable');
                else if (isOnline) statusColor = chalk.green('● online');
                else if (rawStatus === 'degraded') statusColor = chalk.yellow('⚠ warn');
                else statusColor = chalk.red('✕ offline');

                // chalk output formatting padding trick (ansi codes add ~9 chars)
                console.log(`  ${n.name.padEnd(15)} ${templateStr.padEnd(16)} ${modeStr.padEnd(11)} ${statusColor.padEnd(23)} ${String(n.players || 0).padEnd(9)} ${n.ping || 0}ms`);
            });
            console.log('\n');
        });

    program
        .command('start <name>')
        .description('starts a stopped node')
        .action(async (name) => {
            console.log(`Starting ${name}...`);
        });

    program
        .command('stop <name>')
        .description('stops a running node')
        .action((name) => {
            console.log(`Stopping ${name}...`);
        });

    program
        .command('restart <name>')
        .description('restarts a node')
        .action((name) => {
            console.log(`Restarting ${name}...`);
        });

    program
        .command('logs <name>')
        .description('tails logs for that node in terminal')
        .addHelpText('before', `
  lcluster logs <name> — Tail logs for a specific node

  Arguments:
    name    The name of the node (use lcluster ps to see names)

  Streams live log output from the node to your terminal.
  Press Ctrl+C to stop.

  Example:
    lcluster logs node-main
    lcluster logs node-docker
`)
        .action((name) => {
            console.log(`Tailing logs for ${name}...`);
        });

    program.parse();
}
