import { Configuration } from '../src/main';
import { LevelDBStore } from '../src/data/LevelDBStore';
import { GitHubProvider } from '../src/provider/GitHubProvider';
import fs from 'fs';
import path from 'path';

let configuration: Configuration;
let store: LevelDBStore;
let userGithubProvider: GitHubProvider;
let configurationDirectory: string;

const pause = (millis: number): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(resolve, millis);
    });
};

describe('GitHubProvider', () => {
    beforeAll(() => {
        configurationDirectory = path.resolve(
            process.cwd(),
            '.test-GitHubProvider'
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
        userGithubProvider = new GitHubProvider(store, configuration);
    });

    afterAll(async () => {
        await store.close();
        fs.rmSync(configurationDirectory, { recursive: true });
    });

    test('can register repo items from viqueen user', async () => {
        await userGithubProvider.register({
            workspace: 'cnav-test',
            namespace: 'viqueen',
            itemFilter: (item) => !item.forked && !item.archived
        });

        await pause(100);

        const items = await store.list(() => true);
        expect(items.length).toBeGreaterThanOrEqual(7);
    }, 10000);

    test('can register repo items from viqueen-org', async () => {
        await userGithubProvider.register({
            workspace: 'cnav-test',
            namespace: 'viqueen-org',
            itemFilter: (item) => !item.archived
        });

        await pause(100);

        const items = await store.list(
            (item) => item.namespace === 'viqueen-org'
        );
        expect(items.length).toBeGreaterThanOrEqual(1);
    }, 5000);
});
