class PaginationHandler {
    constructor(options) {
        this.initialQuery = options.initialQuery;
        this.pageSupplier = options.pageSupplier;
        this.itemProcessor = options.itemProcessor;
    }

    _nextPage(query) {
        if (!query) {
            throw new Error();
        }
        this.pageSupplier(query)
            .then((page) => {
                const { items, nextQuery } = page;
                items.forEach((item) => this.itemProcessor(item));
                return nextQuery;
            })
            .then((nextQuery) => {
                this._nextPage(nextQuery);
            })
            .catch(() => {});
    }

    start() {
        this._nextPage(this.initialQuery);
    }
}

module.exports = PaginationHandler;
