import { Configuration } from '../main';
import { LevelDBStore } from '../data/LevelDBStore';
import path from 'path';
import fs from 'fs';
import { BitbucketProvider } from './BitbucketProvider';

let configuration: Configuration;
let store: LevelDBStore;
let bitbucketProvider: BitbucketProvider;
let configurationDirectory: string;

const pause = (millis: number): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(resolve, millis);
    });
};

beforeAll(() => {
    configurationDirectory = path.resolve(
        process.cwd(),
        '.test-BitbucketProvider'
    );
    fs.mkdirSync(configurationDirectory);
    configuration = {
        directory: configurationDirectory,
        set: () => {},
        get: () => {
            return undefined;
        }
    };
    store = new LevelDBStore(configuration);
    bitbucketProvider = new BitbucketProvider(store);
});

afterAll(async () => {
    await store.close();
    fs.rmSync(configurationDirectory, { recursive: true });
});

test('can register repo items from viqueen', async () => {
    await bitbucketProvider.register({
        workspace: 'cnav-test',
        namespace: 'viqueen',
        itemFilter: (item) => true
    });

    await pause(100);

    const items = await store.list(() => true);
    expect(items.length).toBeGreaterThanOrEqual(1);
});
