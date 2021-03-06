import { Item, RestClient, RestClientOptions, RestResponse } from '../main';
import * as https from 'https';
import * as QueryString from 'query-string';

export class DefaultRestClient implements RestClient {
    readonly host!: string;
    readonly headers!: any;
    readonly port?: string;

    constructor(options: RestClientOptions) {
        this.host = options.host;
        this.port = options.port;
        this.headers = options.headers || {};
    }

    _get(target: string, query: any = {}): Promise<RestResponse> {
        return new Promise<RestResponse>((resolve) => {
            const settings = {
                path: `${target}?${QueryString.stringify(query)}`,
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
                    const body =
                        buffer !== '' ? JSON.parse(buffer.toString()) : {};
                    resolve({
                        body: body,
                        headers: response.headers
                    });
                });
            };
            const request = https.request(settings, callback);
            request.end();
        });
    }
}
