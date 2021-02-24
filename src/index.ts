#! /usr/bin/env node

import commander from 'commander';
import { JsonFileConfiguration } from './data/JsonFileConfiguration';
import { homedir } from 'os';
import path from 'path';
import { LevelDBStore } from './data/LevelDBStore';
import { itemTransformer } from './service/ItermService';

const configuration = new JsonFileConfiguration(
    path.resolve(homedir(), '.cnav')
);
const store = new LevelDBStore(configuration);

// configuration handlers

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

commander.option(
    '-w, --workspace <name>',
    'explicitly sets the workspace',
    'default'
);

commander
    .command('register <urlConnection> [aliases...]')
    .description('registers a new repo using its url connection')
    .action((urlConnection, aliases) => {
        const input: Input = {
            connection: urlConnection,
            workspace: commander.workspace,
            aliases: aliases
        };
        itemTransformer(input).then((item) => store.add(item));
    });

commander
    .command('list')
    .description('lists registered repos')
    .action(() => {
        store
            .list(() => true)
            .then((items) => {
                items.forEach((item) => console.log(item));
            });
    });

commander.version('2.0.0');
commander.parse(process.argv);
