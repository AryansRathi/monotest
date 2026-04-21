import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Entities', () => {
        test.describe('Query data', () => {
            test.describe('on external Postgres data source', () => {
                test('should return pre-created data', async ({
                    ix,
                    factories,
                    externalDatabases
                }) => {
                    const {
                        postgres: externalPostgres,
                        postgresDataSource: externalPostgresDataSource
                    } = externalDatabases;
                    const testTableName = factories.primitives.createWord();
                    const testRecord1 = {
                        name: factories.primitives.createName(),
                        email: factories.primitives.createEmail()
                    };
                    const testRecord2 = {
                        name: factories.primitives.createName(),
                        email: factories.primitives.createEmail()
                    };

                    await externalPostgres.createTable(testTableName, [
                        { name: 'id', type: 'SERIAL PRIMARY KEY' },
                        { name: 'name', type: 'VARCHAR(255) NOT NULL' },
                        { name: 'email', type: 'VARCHAR(255) UNIQUE' }
                    ]);
                    await externalPostgres.insertRows(testTableName, [testRecord1, testRecord2]);

                    await ix.studio.dataBuilder.overview.dataModelsTabButton.click();

                    const testDataModel = factories.dataBuilder.models.createErDataModel();
                    await ix.studio.dataBuilder.overview.dataModelsTab.importFromDatabase({
                        dataModel: testDataModel,
                        dataSource: externalPostgresDataSource,
                        tableNames: [testTableName]
                    });

                    await ix.studio.dataBuilder.workbench.inspector.queriesTab.open();
                    await ix.studio.dataBuilder.workbench.inspector.queriesTab.createQuery({
                        name: 'Test query',
                        technicalName: 'test-query',
                        dataEntityName: testTableName,
                        attributeNames: ['id', 'name', 'email']
                    });

                    await ix.studio.dataBuilder.workbench.inspector.queriesTab
                        .queryCard('Test query')
                        .click();
                    await ix.studio.dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
                    await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();
                    await ix.studio.dataBuilder.workbench.inspector.previewModal.setItemsPerPage(
                        'All'
                    );

                    await expect(
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTableRow(
                            testRecord1.email
                        )
                    ).toBeVisible();
                    await expect(
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTableRow(
                            testRecord2.email
                        )
                    ).toBeVisible();
                });
            });
        });
    });
});
