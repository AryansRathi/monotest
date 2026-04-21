import { test as baseTest, Browser } from '@playwright/test';
import { TestExternalDataSource } from '@factories/dataBuilderFactory/dataSourcesFactory';
import { AdminFactory } from '@factories/adminFactory';
import { factories } from '@factories/factories';
import { ExternalPostgres } from '../utils/externalPostgres';
import { ExternalMssql } from '../utils/externalMssql';
import { IX } from '@pages/ix';

type TestScopedFixtures = {};

type WorkerScopedFixtures = {
    workerStorageState: string;
    externalDatabases: ExternalDatabases;
};

export const externalDatabasesFixtures = baseTest.extend<TestScopedFixtures, WorkerScopedFixtures>({
    externalDatabases: [
        async ({ browser, workerStorageState }, use) => {
            const externalDatabases = await setupExternalDatabases(browser, workerStorageState);
            await use(externalDatabases);
            await closeConnectionsToExternalDatabases(externalDatabases);
        },
        { scope: 'worker', title: 'Set up external databases' }
    ]
});

interface ExternalDatabases {
    postgres: ExternalPostgres;
    postgresDataSource: TestExternalDataSource;
    mssql: ExternalMssql;
    mssqlDataSource: TestExternalDataSource;
}

/**
 * Sets up all external database services (Postgres + MSSQL) and their
 * corresponding data-source registrations inside IX Studio.
 * Intended to be called once per Playwright worker.
 */
async function setupExternalDatabases(
    browser: Browser,
    workerStorageState: string
): Promise<ExternalDatabases> {
    const page = await browser.newPage({
        storageState: workerStorageState,
        ignoreHTTPSErrors: true
    });

    const ix = new IX(page);
    await ix.studio.open();
    await ix.studio.adminPage.open();

    const postgresCredential = AdminFactory.createUsernamePasswordCredential({
        username: 'postgres',
        password: 'postgres'
    });
    await ix.studio.adminPage.sidebar.credentialsTabButton.click();
    await ix.studio.adminPage.credentialsTab.createUsernamePasswordCredential(postgresCredential);

    const mssqlCredential = AdminFactory.createUsernamePasswordCredential({
        username: 'sa',
        password: 'sqlserver@123'
    });
    await ix.studio.adminPage.credentialsTab.createUsernamePasswordCredential(mssqlCredential);

    await ix.studio.dataBuilder.open();
    await ix.studio.dataBuilder.overview.dataSourcesTab.open();

    const postgresDataSource = factories.dataBuilder.sources.createExternalDataSource('postgres');
    await ix.studio.dataBuilder.overview.dataSourcesTab.createExternalDataSource(
        postgresDataSource,
        postgresCredential
    );

    const mssqlDataSource = factories.dataBuilder.sources.createExternalDataSource('sqlserver');
    await ix.studio.dataBuilder.overview.dataSourcesTab.createExternalDataSource(
        mssqlDataSource,
        mssqlCredential
    );

    await page.close();

    return {
        postgres: new ExternalPostgres(),
        postgresDataSource,
        mssql: new ExternalMssql(),
        mssqlDataSource
    };
}

async function closeConnectionsToExternalDatabases(services: ExternalDatabases): Promise<void> {
    await services.postgres.close();
    await services.mssql.close();
}
