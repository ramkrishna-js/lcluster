import { Client, GatewayIntentBits } from 'discord.js';
import { LavalinkManager } from 'lavalink-client';

// 1. Configure your Discord Bot Token here
const DISCORD_TOKEN = 'YOUR_DISCORD_BOT_TOKEN';

// 2. Configure your lcluster connection exactly as shown in the TUI Settings
const LCLUSTER_NODE = {
    id: "lcluster-gateway",
    host: "localhost",     // or your VPS IP
    port: 2333,            // Port of the lcluster gateway
    password: "youshallnotpass", // Password defined in lcluster Settings
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
