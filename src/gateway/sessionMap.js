const sessionMap = new Map();

export const setSession = (sessionId, nodeId) => sessionMap.set(sessionId, nodeId);
export const getSession = (sessionId) => sessionMap.get(sessionId);
export const deleteSession = (sessionId) => sessionMap.delete(sessionId);
export const getAllSessions = () => [...sessionMap.entries()];
