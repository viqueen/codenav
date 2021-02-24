#! /usr/bin/env node

import commander from 'commander';
import { JsonFileConfiguration } from './data/JsonFileConfiguration';
import { homedir } from 'os';
import path from 'path';
import { LevelDBStore } from './data/LevelDBStore';

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

commander.version('2.0.0');
commander.parse(process.argv);
