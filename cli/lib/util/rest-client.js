const https = require('https');
const http = require('http');
const QueryString = require('query-string');

const client = {
    http: http,
    https: https,
};

class RestClient {
    constructor(options) {
        this.host = options.host;
        this.port = options.port;
        // TODO : validate scheme
        this.protocol = options.protocol || 'https';
        this.headers = options.headers || {};
    }

    _sendRequest(requestConfig) {
        return new Promise((resolve) => {
            const settings = Object.assign({}, requestConfig, {
                host: this.host,
                port: this.port,
                headers: Object.assign({}, this.headers, {
                    'User-Agent': 'code-navigation',
                    'Content-Type': 'application/json',
                }),
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
            const request = client[this.protocol].request(settings, callback);
            request.end();
        });
    }

    get(path, query) {
        const finalQuery = query || {};
        return this._sendRequest(
            {
                path: `${path}?${QueryString.stringify(finalQuery)}`,
                method: 'GET',
            },
            query
        );
    }
}

module.exports = RestClient;
