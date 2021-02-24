import { Item, RestClient, RestClientOptions } from '../main';
import * as https from 'https';

export class DefaultRestClient implements RestClient {
    readonly host!: string;
    readonly headers!: any;
    readonly port?: string;

    constructor(options: RestClientOptions) {
        this.host = options.host;
        this.port = options.port;
        this.headers = options.headers || {};
    }

    _get(target: string): Promise<Array<Item>> {
        return new Promise<Array<Item>>((resolve) => {
            const settings = {
                path: target,
                host: this.host,
                port: this.port,
                headers: Object.assign({}, this.headers, {
                    'User-Agent': 'code-navigation',
                    'Content-Type': 'application/json',
                    connection: 'keep-alive'
                })
            };
            const callback = (response: any) => {
                let buffer = '';
                response.on('data', (chunk: Buffer) => {
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
}
