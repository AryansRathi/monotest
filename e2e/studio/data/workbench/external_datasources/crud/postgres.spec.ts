import { expect, test } from '@fixtures/base';
import { TestErDataModel } from '@factories/dataBuilderFactory/dataModelsFactory';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Entities', () => {
        test.describe('CRUD data', () => {
            test.describe('on external Postgres data source', () => {
                let testTableName: string;
                let testRecord: { name: string; email: string };
                let testDataModel: TestErDataModel;

                test.beforeEach(
                    'setup: external database, data model and query',
                    async ({ ix, factories, externalDatabases }) => {
                        const {
                            postgres: externalPostgres,
                            postgresDataSource: externalPostgresDataSource
                        } = externalDatabases;
                        testTableName = factories.primitives.createWord();
                        testRecord = {
                            name: factories.primitives.createName(),
                            email: factories.primitives.createEmail()
                        };
                        const dummyTestRecord = {
                            name: factories.primitives.createName(),
                            email: factories.primitives.createEmail()
                        };

                        await externalPostgres.createTable(testTableName, [
                            { name: 'id', type: 'SERIAL PRIMARY KEY' },
                            { name: 'name', type: 'VARCHAR(255) NOT NULL' },
                            { name: 'email', type: 'VARCHAR(255) UNIQUE' }
                        ]);
                        await externalPostgres.insertRows(testTableName, [
                            testRecord,
                            dummyTestRecord
                        ]);

                        await ix.studio.dataBuilder.overview.dataModelsTabButton.click();

                        testDataModel = factories.dataBuilder.models.createErDataModel();
                        await ix.studio.dataBuilder.overview.dataModelsTab.importFromDatabase({
                            dataModel: testDataModel,
                            dataSource: externalPostgresDataSource,
                            tableNames: [testTableName]
                        });

                        await ix.studio.dataBuilder.workbench.inspector.queriesTab.open();
                        await ix.studio.dataBuilder.workbench.inspector.queriesTab.createQuery({
                            name: 'My select query',
                            technicalName: 'my-select-query',
                            dataEntityName: testTableName,
                            attributeNames: ['id', 'name', 'email']
                        });
                    }
                );

                test('should insert data with a command', async ({ ix, factories }) => {
                    const newRecord = {
                        name: factories.primitives.createName(),
                        email: factories.primitives.createEmail()
                    };

                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.open();
                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.createCommand({
                        commandType: 'INSERT',
                        name: 'My insert command',
                        technicalName: 'my-insert-command',
                        dataEntityName: testTableName,
                        attributeNames: ['name', 'email']
                    });

                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.executeCommandWithPreviewModal(
                        'My insert command',
                        newRecord,
                        { closeModal: false }
                    );

                    const relevantResultsTableRow =
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTableRow(
                            newRecord.email
                        );
                    await expect(relevantResultsTableRow).toContainText(newRecord.name);
                    await expect(relevantResultsTableRow).toContainText(newRecord.email);
                });

                test('should update data with a command', async ({ ix, factories }) => {
                    const updatedRecord = {
                        name: factories.primitives.createName(),
                        email: factories.primitives.createEmail()
                    };

                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.open();
                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.createCommand({
                        commandType: 'UPDATE',
                        name: 'My update command',
                        technicalName: 'my-update-command',
                        dataEntityName: testTableName,
                        attributeNames: ['name', 'email'],
                        conditions: [
                            {
                                entityName: testTableName,
                                attributeName: 'email',
                                operator: 'Equal',
                                value: testRecord.email,
                                name: 'initial-email-condition'
                            }
                        ]
                    });

                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.executeCommandWithPreviewModal(
                        'My update command',
                        updatedRecord
                    );
                    await ix.studio.dataBuilder.workbench.inspector.queriesTab.open();
                    await ix.studio.dataBuilder.workbench.inspector.queriesTab
                        .queryCard('My select query')
                        .click();
                    await ix.studio.dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
                    await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();
                    await ix.studio.dataBuilder.workbench.inspector.previewModal.setItemsPerPage(
                        'All'
                    );

                    const relevantResultsTableRow =
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTableRow(
                            updatedRecord.email
                        );
                    await expect(relevantResultsTableRow).toContainText(updatedRecord.name);
                    await expect(relevantResultsTableRow).toContainText(updatedRecord.email);
                    await expect(
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTable
                    ).not.toContainText(testRecord.name);
                    await expect(
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTable
                    ).not.toContainText(testRecord.email);
                });

                test('should delete data with a command', async ({ ix }) => {
                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.open();
                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.createCommand({
                        commandType: 'DELETE',
                        name: 'My delete command',
                        technicalName: 'my-delete-command',
                        dataEntityName: testTableName,
                        conditions: [
                            {
                                entityName: testTableName,
                                attributeName: 'email',
                                operator: 'Equal',
                                value: testRecord.email,
                                name: 'initial-email-condition'
                            }
                        ]
                    });

                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.executeCommandWithPreviewModal(
                        'My delete command'
                    );
                    await ix.studio.dataBuilder.workbench.inspector.queriesTab.open();
                    await ix.studio.dataBuilder.workbench.inspector.queriesTab
                        .queryCard('My select query')
                        .click();
                    await ix.studio.dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
                    await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();
                    await ix.studio.dataBuilder.workbench.inspector.previewModal.setItemsPerPage(
                        'All'
                    );

                    await expect(
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTableRow(
                            testRecord.email
                        )
                    ).not.toBeVisible();
                    await expect(
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTable
                    ).not.toContainText(testRecord.name);
                    await expect(
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTable
                    ).not.toContainText(testRecord.email);
                });
            });
        });
    });
});
