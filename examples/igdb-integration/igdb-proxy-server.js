/**
 * IGDB Proxy Server
 *
 * A simple Node.js/Express server that proxies IGDB API requests.
 * This is REQUIRED because:
 * 1. Twitch OAuth endpoint doesn't allow CORS from browser
 * 2. Client secrets should never be exposed in client-side code
 * 3. IGDB API requires Twitch authentication
 *
 * Usage:
 *   node igdb-proxy-server.js
 *
 * Then update igdb-demo.html to use http://localhost:3000/api/igdb
 */

import http from 'http';
import https from 'https';
import url from 'url';

// Load credentials from environment or hardcode for demo
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || '2rvgifatr2fniucmxwnmxgxhot8h6u';
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || 'rfgbd7221acnh9jlb3kbmev1qh2oic';

let accessToken = null;
let tokenExpiresAt = null;

/**
 * Get or refresh OAuth access token from Twitch
 */
async function getAccessToken() {
  // Return cached token if still valid
  if (accessToken && tokenExpiresAt && Date.now() < tokenExpiresAt - 60000) {
    return accessToken;
  }

  return new Promise((resolve, reject) => {
    const oauthUrl = `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`;

    https.request(oauthUrl, { method: 'POST' }, (res) => {
      let data = '';

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const json = JSON.parse(data);
          accessToken = json.access_token;
          tokenExpiresAt = Date.now() + (json.expires_in * 1000);
          console.log('✅ OAuth token obtained, expires in', json.expires_in, 'seconds');
          resolve(accessToken);
        } else {
          reject(new Error(`OAuth error: ${res.statusCode}`));
        }
      });
    }).on('error', reject).end();
  });
}

/**
 * Proxy IGDB API requests
 */
async function proxyIGDB(endpoint, body, res) {
  try {
    const token = await getAccessToken();

    const options = {
      hostname: 'api.igdb.com',
      path: `/v4/${endpoint}`,
      method: 'POST',
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain'
      }
    };

    const req = https.request(options, (igdbRes) => {
      let data = '';

      igdbRes.on('data', chunk => data += chunk);
      igdbRes.on('end', () => {
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');

        res.statusCode = igdbRes.statusCode;
        res.end(data);
      });
    });

    req.on('error', (error) => {
      console.error('IGDB request error:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    });

    req.write(body);
    req.end();

  } catch (error) {
    console.error('Auth error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: error.message }));
  }
}

/**
 * HTTP Server
 */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 200;
    res.end();
    return;
  }

  // Health check
  if (parsedUrl.pathname === '/health') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'ok',
      tokenCached: !!accessToken,
      tokenExpiry: tokenExpiresAt ? new Date(tokenExpiresAt).toISOString() : null
    }));
    return;
  }

  // IGDB proxy endpoint
  if (req.method === 'POST' && parsedUrl.pathname.startsWith('/api/igdb/')) {
    const endpoint = parsedUrl.pathname.replace('/api/igdb/', '');

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log(`📡 Proxying IGDB request: ${endpoint}`);
      proxyIGDB(endpoint, body, res);
    });
    return;
  }

  // 404
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🎮 IGDB Proxy Server                        ║
║                                                ║
║   Status: Running                              ║
║   Port: ${PORT}                                   ║
║   Health: http://localhost:${PORT}/health         ║
║   Endpoint: http://localhost:${PORT}/api/igdb/    ║
║                                                ║
║   Ready to proxy IGDB API requests!            ║
║                                                ║
╚════════════════════════════════════════════════╝
  `);
});
