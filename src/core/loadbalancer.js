import { getAllNodes } from './registry.js';

let rrIndex = 0;

export function pickNode(strategy = 'least-players') {
    const onlineNodes = getAllNodes().filter(n => n.status === 'online');

    if (onlineNodes.length === 0) {
        throw new Error('No online nodes available');
    }

    if (strategy === 'least-players') {
        return onlineNodes.reduce((min, node) => (node.players < min.players ? node : min), onlineNodes[0]);
    }

    if (strategy === 'lowest-cpu') {
        return onlineNodes.reduce((min, node) => (node.cpu < min.cpu ? node : min), onlineNodes[0]);
    }

    if (strategy === 'round-robin') {
        rrIndex = (rrIndex + 1) % onlineNodes.length;
        return onlineNodes[rrIndex];
    }

    return onlineNodes[0];
}
