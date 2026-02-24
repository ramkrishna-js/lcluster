const guildMap = new Map();

export const setGuild = (guildId, nodeId) => guildMap.set(guildId, nodeId);
export const getGuild = (guildId) => guildMap.get(guildId);
export const deleteGuild = (guildId) => guildMap.delete(guildId);
export const getAllGuilds = () => [...guildMap.entries()];
