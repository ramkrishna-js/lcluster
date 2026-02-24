import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({
    ignorePath: true
});

proxy.on('error', (err, req, res) => {
    if (res && res.writeHead) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
});

export function handleProxy(req, res, targetUrl) {
    // Add bot IP
    req.headers['x-forwarded-for'] = req.socket.remoteAddress;

    proxy.web(req, res, {
        target: targetUrl
    });
}

export function handleWsProxy(req, socket, head, targetUrl) {
    // Add bot IP
    req.headers['x-forwarded-for'] = req.socket.remoteAddress;

    proxy.ws(req, socket, head, {
        target: targetUrl
    });
}
