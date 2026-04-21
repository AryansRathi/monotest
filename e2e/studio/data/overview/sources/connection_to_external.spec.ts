import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Data Sources', () => {
        test('should connect to an external Postgres data source', async ({ ix, factories }) => {
            const postgresCredential = factories.admin.createUsernamePasswordCredential({
                username: 'postgres',
                password: 'postgres'
            });

            await ix.studio.adminPage.open();
            await ix.studio.adminPage.credentialsTab.open();
            await ix.studio.adminPage.credentialsTab.createUsernamePasswordCredential(
                postgresCredential
            );

            await ix.studio.dataBuilder.open();
            await ix.studio.dataBuilder.overview.dataSourcesTab.open();

            const externalPostgresDataSource =
                factories.dataBuilder.sources.createExternalDataSource('postgres');
            await ix.studio.dataBuilder.overview.dataSourcesTab.createExternalDataSource(
                externalPostgresDataSource,
                postgresCredential
            );

            await expect(
                ix.studio.dataBuilder.overview.dataSourcesTab.dataSourceStageChip(
                    externalPostgresDataSource.technicalName
                )
            ).toContainText('Connected');
        });

        test('should connect to an external MSSQL data source', async ({ ix, factories }) => {
            const sqlServerCredential = factories.admin.createUsernamePasswordCredential({
                username: 'sa',
                password: 'sqlserver@123'
            });

            await ix.studio.adminPage.open();
            await ix.studio.adminPage.credentialsTab.open();
            await ix.studio.adminPage.credentialsTab.createUsernamePasswordCredential(
                sqlServerCredential
            );

            await ix.studio.dataBuilder.open();
            await ix.studio.dataBuilder.overview.dataSourcesTab.open();

            const externalSqlServerDataSource =
                factories.dataBuilder.sources.createExternalDataSource('sqlserver');
            await ix.studio.dataBuilder.overview.dataSourcesTab.createExternalDataSource(
                externalSqlServerDataSource,
                sqlServerCredential
            );

            await expect(
                ix.studio.dataBuilder.overview.dataSourcesTab.dataSourceStageChip(
                    externalSqlServerDataSource.technicalName
                )
            ).toContainText('Connected');
        });
    });
});
