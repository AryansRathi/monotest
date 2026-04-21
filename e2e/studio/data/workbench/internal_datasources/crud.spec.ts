import { factories } from '@factories/factories';
import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Entities', () => {
        test.describe('CRUD data', () => {
            test.describe('on default internal data source', () => {
                test('should insert data with a command', async ({ ix }) => {
                    const testDataModel = factories.dataBuilder.models.createErDataModel();
                    const personsEntity = factories.dataBuilder.models.createDataModelEntity({
                        name: 'persons',
                        technicalName: 'persons',
                        description: 'Persons entity',
                        attributes: [
                            factories.dataBuilder.models.createDataEntityAttribute('varchar', {
                                name: 'name',
                                technicalName: 'name'
                            }),
                            factories.dataBuilder.models.createDataEntityAttribute('varchar', {
                                name: 'email',
                                technicalName: 'email'
                            }),
                            factories.dataBuilder.models.createDataEntityAttribute('varchar', {
                                name: 'phone',
                                technicalName: 'phone'
                            })
                        ]
                    });

                    await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(
                        testDataModel
                    );
                    await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(
                        personsEntity
                    );

                    await ix.studio.dataBuilder.workbench.canvas.syncToDatabaseButton.click();
                    await expect(
                        ix.studio.dataBuilder.workbench.canvas.databaseSyncStatusChip
                    ).toContainText('Fully synced');

                    const insertData = {
                        name: factories.primitives.createName(),
                        email: factories.primitives.createEmail(),
                        phone: factories.primitives
                            .createInteger({ min: 1000000000, max: 9999999999 })
                            .toString()
                    };

                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.open();
                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.createCommand({
                        commandType: 'INSERT',
                        name: 'Insert persons',
                        technicalName: 'insert-persons',
                        dataEntityName: 'persons',
                        attributeNames: ['name', 'email', 'phone']
                    });

                    await ix.studio.dataBuilder.workbench.inspector.commandsTab.executeCommandWithPreviewModal(
                        'Insert persons',
                        insertData,
                        { closeModal: false }
                    );

                    const relevantResultsTableRow =
                        ix.studio.dataBuilder.workbench.inspector.previewModal.resultsTableRow(
                            insertData.email
                        );
                    await expect(relevantResultsTableRow).toBeVisible();
                    await expect(relevantResultsTableRow).toContainText(insertData.name);
                    await expect(relevantResultsTableRow).toContainText(insertData.email);
                    await expect(relevantResultsTableRow).toContainText(insertData.phone);
                });
            });
        });
    });
});
