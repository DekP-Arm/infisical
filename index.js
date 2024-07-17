const axios = require('axios');

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
    }
}

async function makeRequest() {
    try {
        const token = await fetchToken();
        // console.log('Token:', token);
        
        const url = 'http://localhost:80/api/v3/secrets/raw?secretPath=/';
        const params = {
            workspaceId: 'be324d58-bbf7-49ea-9205-6323c23119b5',
            environment: 'dev',
        };
        const headers = {
            Authorization: `Bearer ${token}`
        };

        const response = await axios.get(url, { params, headers });
        secretValue = response.data
        console.log('Secret Value:',secretValue );
    } catch (error) {
        console.error('Error making GET request:', error);
    }
}

makeRequest();
