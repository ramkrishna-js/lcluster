import { Client, GatewayIntentBits } from 'discord.js';
import { LavalinkManager } from 'lavalink-client';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'js-yaml';

// 1. Token passed from lcluster bot manager securely
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || 'YOUR_DISCORD_BOT_TOKEN';

// 2. Read lcluster internal port/password config directly to avoid desync
const configPath = path.join(os.homedir(), '.lcluster', 'config.yml');
let lclusterPassword = 'youshallnotpass';
let lclusterPort = 2333;
if (fs.existsSync(configPath)) {
    try {
        const config = yaml.load(fs.readFileSync(configPath, 'utf8')) || {};
        lclusterPassword = config.gateway?.password || 'youshallnotpass';
        lclusterPort = config.gateway?.port || 2333;
    } catch { }
}

const LCLUSTER_NODE = {
    id: "lcluster-gateway",
    host: "localhost",     // or your VPS IP
    port: lclusterPort,    // Dynamically synced from config
    password: lclusterPassword, // Dynamically synced from config
    secure: false          // Set to true if behind HTTPS/WSS
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

// Initialize lavalink-client manager pointing exactly to lcluster
const lavalink = new LavalinkManager({
    nodes: [LCLUSTER_NODE],
    sendToShard: (guildId, payload) => {
        client.guilds.cache.get(guildId)?.shard?.send(payload);
    },
    client: {
        id: "CLIENT_ID_PLACEHOLDER", // Replaced on login
        username: "Lcluster Bot"
    }
});

lavalink.nodeManager.on("connect", (node) => {
    console.log(`[Lcluster] Successfully connected to gateway node: ${node.id}`);
});

lavalink.nodeManager.on("error", (node, error) => {
    console.error(`[Lcluster] Error on node ${node.id}:`, error.message);
});

client.on('ready', () => {
    console.log(`[Discord] Logged in as ${client.user.tag}`);
    lavalink.client.id = client.user.id;
    lavalink.init({ ...client.user });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    // Simple ping command
    if (message.content === '!ping') {
        message.reply('Pong! Cluster is active.');
    }
});

// Forward raw discord voice events to lavalink
client.on("raw", (d) => lavalink.sendRawData(d));

console.log("Starting Lcluster Discord Bot...");
client.login(DISCORD_TOKEN);
