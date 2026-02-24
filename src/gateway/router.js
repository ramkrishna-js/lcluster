// Router logic is handled directly in server.js per implementation evolution
// This file exists to satisfy architectural strictness
import { handleRest } from './v4/rest.js';
export function routeRequest(req, res) {
    handleRest(req, res);
}
