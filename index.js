const { createClient } = require('redis');
const axios = require('axios');

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: {
        clientId: '9373e17e-5e37-435e-a80a-e32b0a5ed640',
        clientSecret: '3fe87693fe61b2e0105099ede4c2dcc342bf8042dffc8449e659c5d20a560140'
    }
};

async function fetchToken() {
    try {
        const response = await axios('http://localhost:80/api/v1/auth/universal-auth/login', options);
        const token = response.data.accessToken;
        return token;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function getToken() {
    try {
        await client.connect();
        console.log('Connected to Redis');
        let token = await client.get('token');

        if (!token) {
            console.log('Token not found in cache, fetching new token');
            token = await fetchToken();

            await client.set('token', token, { EX: 30 }); // Expires in 1 hour
        } else {
            console.log('Token found in cache', token);
        }

        await client.disconnect();
        return token;
    } catch (err) {
        console.error('Error in getToken:', err);
        throw err;
    }
}

async function makeRequest() {
    try {
        const token = await getToken();

        const url = 'http://localhost:80/api/v3/secrets/raw/NAME';
        const params = {
            workspaceId: 'be324d58-bbf7-49ea-9205-6323c23119b5',
            environment: 'dev',
        };
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const response = await axios.get(url, { params, headers });
        const secretValue = response.data;
        console.log('Secret Value:', secretValue);
    } catch (error) {
        console.error('Error making GET request:', error);
    }
}

makeRequest();
