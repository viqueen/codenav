const RestClient = require('../util/rest-client');
const PaginationHandler = require('../util/pagination-handler');

class StashRegisterCmd {
    constructor(options) {
        const {
            urlParts,
            token,
            project,
            codeNavStore,
            protocol,
            scope,
        } = options;
        const context = urlParts.context === '/' ? '' : urlParts.context;
        const targetResource = `${context}/rest/api/1.0/projects/${project}/repos`;

        this.stashClient = new RestClient({
            protocol: urlParts.protocol,
            host: urlParts.host,
            port: urlParts.port,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        this.paginationHandler = new PaginationHandler({
            initialQuery: { start: 0, limit: 100 },
            pageSupplier: (query) => {
                console.log(query);
                return this.stashClient
                    .get(targetResource, query)
                    .then((json) => {
                        // noinspection JSUnresolvedVariable
                        const nextQuery = json.isLastPage
                            ? undefined
                            : { start: json.nextPageStart, limit: 100 };
                        const items = json.values
                            .flatMap((item) => item.links.clone)
                            .filter((item) => item.name === protocol);
                        return {
                            items: items,
                            nextQuery: nextQuery,
                        };
                    })
                    .catch(console.error);
            },
            itemProcessor: (item) => {
                codeNavStore.register({
                    urlConnection: item.href,
                    scope: scope,
                });
            },
        });
    }

    execute() {
        this.paginationHandler.start();
    }
}

module.exports = StashRegisterCmd;
