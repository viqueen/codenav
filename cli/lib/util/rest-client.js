const https = require('https');

class RestClient {
    constructor(options) {
        this.host = options.host;
    }

    _sendRequest(requestConfig) {
        return new Promise((resolve) => {
            const settings = Object.assign({}, requestConfig, {
                host: this.host,
                headers: {
                    'User-Agent': 'code-navigation',
                    'Content-Type': 'application/json',
                },
            });
            const callback = (response) => {
                let buffer = '';
                response.on('data', (chunk) => {
                    buffer += chunk.toString();
                });
                response.on('end', () => {
                    if (buffer !== '') {
                        resolve(JSON.parse(buffer.toString()));
                    }
                });
            };
            const request = https.request(settings, callback);
            request.end();
        });
    }

    get(path) {
        return this._sendRequest({
            path: path,
            method: 'GET',
        });
    }
}

module.exports = RestClient;
