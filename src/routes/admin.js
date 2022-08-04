const ghAuthURL = 'https://github.com/login/oauth/authorize';
const tokenURL = 'https://github.com/login/oauth/access_token';
const userURL = 'https://api.github.com/user';
const clientId = import.meta.env.VITE_CLIENT_ID;
const secret = import.meta.env.VITE_CLIENT_SECRET;

export async function GET(request) {
    const code = request.url.searchParams.get('code');

    if (code == null) {
        const sessionId = '1234';
        return {
            status: 302,
            headers: {
                location: `${ghAuthURL}?client_id=${clientId}&state=${sessionId}`
            }
        };
    }

    const accessToken = await getAccessToken(code);
    const user = await getUser(accessToken);

    return {
      body: {user: user}
    };
}
    
async function getAccessToken(code) {
    return fetch(tokenURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: secret,
            code
        })
    })
    .then(r => r.json())
    .then(r => r.access_token);
}

async function getUser(accessToken) {
    return fetch(userURL, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })
    .then(r => r.json())
    .then(r => r.login);
}