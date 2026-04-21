import { test as baseTest } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { testConfig } from '@test.config';
import { IX } from '@pages/ix';

export type AsUser = (username: string, password: string, fn: () => Promise<void>) => Promise<void>;

type TestScopedFixtures = {
    asUser: AsUser;
};

type WorkerScopedFixtures = {
    workerStorageState: string;
};

export const authFixtures = baseTest.extend<TestScopedFixtures, WorkerScopedFixtures>({
    // Use the same storage state for all tests in this worker.
    storageState: ({ workerStorageState }, use) => use(workerStorageState),

    /**
     * Runs a callback as a different user, then restores the admin session.
     * Keycloak invalidates server-side sessions on logout, so the cached
     * auth file is refreshed automatically before returning.
     */
    asUser: async ({ page }, use) => {
        const ix = new IX(page);

        await use(async (username, password, fn) => {
            if (await ix.studio.userMenuButton.isVisible()) {
                await ix.studio.logout();
            }
            await ix.studio.login(username, password);

            try {
                await fn();
            } finally {
                await ix.studio.logout();
                await ix.studio.login(testConfig.username, testConfig.password);

                const authFile = path.resolve(
                    baseTest.info().project.outputDir,
                    `.auth/${baseTest.info().parallelIndex}.json`
                );
                await page.context().storageState({ path: authFile });
            }
        });
    },

    // Authenticate once per worker with a worker-scoped fixture.
    workerStorageState: [
        async ({ browser }, use) => {
            const id = baseTest.info().parallelIndex;
            const fileName = path.resolve(baseTest.info().project.outputDir, `.auth/${id}.json`);

            if (fs.existsSync(fileName)) {
                await use(fileName);
                return;
            }

            // Important: make sure we authenticate in a clean environment by unsetting storage state.
            const page = await browser.newPage({
                storageState: undefined,
                ignoreHTTPSErrors: true
            });

            const ix = new IX(page);
            await page.goto(testConfig.baseURL + '/');
            await ix.studio.login(testConfig.username, testConfig.password);

            await page.context().storageState({ path: fileName });
            await page.close();
            await use(fileName);
        },
        {
            scope: 'worker',
            title: 'Authenticate once per worker'
        }
    ]
});
