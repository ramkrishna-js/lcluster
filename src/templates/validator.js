import yaml from 'js-yaml';

export function validateTemplate(ymlString) {
    try {
        const doc = yaml.load(ymlString);
        if (!doc) return 'Template is empty or invalid.';

        if (!doc.server || !doc.server.port) {
            return 'Missing required field: server.port';
        }

        if (!doc.lavalink || !doc.lavalink.server || !doc.lavalink.server.password) {
            return 'Missing required field: lavalink.server.password';
        }

        if (!doc.lavalink.server.sources) {
            return 'Missing required field: lavalink.server.sources';
        }

        return null; // Valid
    } catch (e) {
        return `YAML Error: ${e.message}`;
    }
}

export function extractConfig(ymlString) {
    try {
        const doc = yaml.load(ymlString);
        return {
            port: doc?.server?.port,
            password: doc?.lavalink?.server?.password
        };
    } catch {
        return null;
    }
}
