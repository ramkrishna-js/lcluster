import { EventEmitter } from 'events';

class ClusterEmitter extends EventEmitter { }

export const events = new ClusterEmitter();
