const axios = require('axios');

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const response = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({ grant_type: 'client_credentials' }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      }
    }
  );

  cachedToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000;

  return cachedToken;
}

module.exports = { getAccessToken };