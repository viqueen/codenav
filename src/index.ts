#! /usr/bin/env node

import commander from 'commander';
import { JsonFileConfiguration } from './data/JsonFileConfiguration';
import { homedir } from 'os';
import path from 'path';
import { LevelDBStore } from './data/LevelDBStore';
import { itemTransformer, urlParser } from './util/ItermUtil';
import { Input, Item, Options } from './main';
import { DefaultService } from './service/DefaultService';
import { CloneCommand } from './command/CloneCommand';
import { StashProvider } from './provider/StashProvider';
import { BitbucketProvider } from './provider/BitbucketProvider';
import { GitHubProvider } from './provider/GitHubProvider';
import { DefaultItemLocation } from './util/DefaultItemLocation';
import { ExecCommand } from './command/ExecCommand';

// configuration handlers

const configuration = new JsonFileConfiguration(
    path.resolve(homedir(), '.cnav')
);

commander
    .command('config')
    .description('displays cnav configuration')
    .action(() => {
        console.log(configuration.config());
    });

commander
    .command('set-config <key> <value>')
    .description('updates cnav configuration entry')
    .action((key, value) => {
        console.log(`set ${key} = ${value}`);
        configuration.set(key, value);
    });

commander
    .command('get-config <key>')
    .description('gets cnav configuration entry')
    .action((key) => {
        console.log(configuration.get(key));
    });

// repo handlers

const store = new LevelDBStore(configuration);
const service = new DefaultService(store);
const location = new DefaultItemLocation(configuration);

const options = () => {
    const { workspace, host, namespace, slug, keyword } = commander;
    return {
        workspace,
        host,
        namespace,
        slug,
        keyword
    };
};

const itemFilter = (item: Item, opts: Options) => {
    return (
        (opts.host ? opts.host === item.host : true) &&
        (opts.namespace ? opts.namespace === item.namespace : true) &&
        (opts.workspace ? opts.workspace === item.workspace : true) &&
        (opts.slug ? item.aliases.includes(opts.slug) : true) &&
        (opts.keyword
            ? item.slug.includes(opts.keyword) ||
              item.aliases.includes(opts.keyword)
            : true)
    );
};

commander.option(
    '-w, --workspace <name>',
    'filter by workspace',
    configuration.get('cnav.workspace')
);
commander.option('-h, --host <name>', 'filter by host');
commander.option('-ns, --namespace <name>', 'filter by namespace');
commander.option('-s, --slug <name>', 'filter by name/slug');
commander.option('-k, --keyword <keyword>', 'filter by keyword');

commander
    .command('register <urlConnection> [aliases...]')
    .description('registers a new repo using its url connection')
    .action((urlConnection, aliases) => {
        const input: Input = {
            connection: urlConnection,
            workspace: commander.workspace,
            aliases: aliases
        };
        const item = itemTransformer(input);
        if (!item) {
            return;
        }
        store.add(item).then(() => {
            console.log(
                `registered on workspace: ${item.workspace} / ${item.connection}`
            );
        });
    });

commander
    .command('list')
    .description('lists registered repos')
    .option('-dl, --display-location', 'display location only', false)
    .option('-dc, --display-connection', 'display connection only', false)
    .option('-ds, --display-slug', 'display repo slug only', false)
    .action((opts) => {
        store
            .list((item: Item) => itemFilter(item, options()))
            .then((items) => {
                items.forEach((item) => {
                    if (opts['displayLocation']) {
                        console.log(location.resolve(item));
                    } else if (opts['displayConnection']) {
                        console.log(item.connection);
                    } else if (opts['displaySlug']) {
                        console.log(item.slug);
                    } else {
                        console.log(item);
                    }
                });
            });
    });

commander
    .command('remove')
    .description('removes registered repos')
    .action(() => {
        store
            .remove((item: Item) => itemFilter(item, options()))
            .then((items) => {
                console.log('removed items:');
                items
                    .map((item) => item.ID)
                    .forEach((item) => console.log(item));
            });
    });

// operations

commander
    .command('clone')
    .description('clone registered repos')
    .action(() => {
        service.execute(new CloneCommand(location), (item: Item) =>
            itemFilter(item, options())
        );
    });

commander
    .command('exec <executableFile> [args...]')
    .description('execute script on target repos')
    .action((executableFile, args) => {
        service.execute(
            new ExecCommand(executableFile, args, location),
            (item: Item) => itemFilter(item, options())
        );
    });

// source providers

commander
    .command('stash <project>')
    .description('register repos from stash for a given project')
    .action((project) => {
        const url = configuration.get(`stash.url`);
        const token = configuration.get(`stash.token`);

        if (!url || !token) {
            console.log(`please set stash.url and stash.token properties`);
            console.log(`
            cnav set-config stash.url <value>
            cnav set-config stash.token <value>
            `);
            return;
        }

        const { workspace } = commander;
        urlParser(url).then((parts) => {
            const stashProvider = new StashProvider(parts, token, store);
            stashProvider.register({
                workspace: workspace,
                namespace: project,
                itemFilter: (item: Item) => itemFilter(item, options())
            });
        });
    });

commander
    .command('bitbucket <namespace>')
    .description('register repos from bitbucket with given namespace')
    .action((namespace) => {
        const { workspace } = commander;
        const bitbucketProvider = new BitbucketProvider(store);
        bitbucketProvider.register({
            workspace: workspace,
            namespace: namespace,
            itemFilter: (item: Item) => itemFilter(item, options())
        });
    });

commander
    .command('github <namespace>')
    .description('register repos from github with given namespace')
    .action((namespace) => {
        const { workspace } = commander;
        const githubProvider = new GitHubProvider(store);
        githubProvider.register({
            workspace: workspace,
            namespace: namespace,
            itemFilter: (item: Item) => itemFilter(item, options())
        });
    });

commander.version(require('../package.json').version);
commander.parse(process.argv);
