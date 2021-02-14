#! /usr/bin/env node

import { JsonFileConfiguration } from './JsonFileConfiguration';
import { homedir } from 'os';
import * as path from 'path';
import { LevelDBStore } from '../data/LevelDBStore';
import { CodeNavTool } from '../tool/CodeNavTool';
import commander from 'commander';

const configuration: Configuration = new JsonFileConfiguration(
    path.resolve(homedir(), '.cnav')
);
const store: LevelDBStore = new LevelDBStore(configuration);
const tool: CodeNav = new CodeNavTool(configuration, store);

// configuration handlers

commander
    .command('config')
    .description('displays cnav configuration')
    .action(() => {
        console.log(configuration.config());
    });

commander
    .command('set-config <key> <value>')
    .description('update cnav configuration entry')
    .action((key, value) => {
        configuration.set(key, value);
    });

commander
    .command('get-config <key>')
    .description('gets cnav configuration entry')
    .action((key) => {
        console.log(configuration.get(key));
    });

// code navigation handlers

commander
    .command('register <connection> [aliases...]')
    .description('registers a new repo using its url connection')
    .option(
        '-w, --workspace',
        'select workspace',
        configuration.get('cnav.workspace')
    )
    .action((connection, aliases, options) => {
        // noinspection JSIgnoredPromiseFromCall
        tool.register({
            connection: connection,
            workspace: options.workspace || 'default',
            aliases: aliases,
        });
    });

commander
    .command('list')
    .description('lists registered repos')
    .option('-h, --host <host>', 'filter by host')
    .option('-ns, --namespace <namespace>', 'filter by namespace')
    .option('-w, --workspace <workspace>', 'filter by workspace')
    .option('-f, --filter <keyword>', 'filter by keyword')
    .action((options) => {
        tool.list((item: Item) => {
            return (
                (options.host ? options.host === item.host : true) &&
                (options.namespace
                    ? options.namespace === item.namespace
                    : true) &&
                (options.workspace
                    ? options.workspace === item.workspace
                    : true) &&
                (options.filter
                    ? item.slug.includes(options.filer) ||
                      item.aliases.includes(options.filter)
                    : true)
            );
        }).then((items) => {
            items.forEach((item) => console.log(item));
        });
    });

commander.version('2.0.0');
commander.parse(process.argv);

if (process.argv.length === 0) {
    commander.help();
}
