import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Entities', () => {
        test.describe('CRUD', () => {
            test('should create entities with attributes', async ({ ix, factories }) => {
                const testDataModel = factories.dataBuilder.models.createErDataModel();
                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
                await ix.studio.dataBuilder.workbench.exit();
                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);
                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.name)
                    .open();

                const entity1 = factories.dataBuilder.models.createDataModelEntity({
                    attributes: [
                        factories.dataBuilder.models.createDataEntityAttribute('char'),
                        factories.dataBuilder.models.createDataEntityAttribute('varchar'),
                        factories.dataBuilder.models.createDataEntityAttribute('text'),
                        factories.dataBuilder.models.createDataEntityAttribute('int16', {}),
                        factories.dataBuilder.models.createDataEntityAttribute('int32'),
                        factories.dataBuilder.models.createDataEntityAttribute('int64'),
                        factories.dataBuilder.models.createDataEntityAttribute('decimal'),
                        factories.dataBuilder.models.createDataEntityAttribute('real')
                    ]
                });

                const entity2 = factories.dataBuilder.models.createDataModelEntity({
                    attributes: [
                        factories.dataBuilder.models.createDataEntityAttribute('double'),
                        factories.dataBuilder.models.createDataEntityAttribute('date'),
                        factories.dataBuilder.models.createDataEntityAttribute('time'),
                        factories.dataBuilder.models.createDataEntityAttribute('timestamp'),
                        factories.dataBuilder.models.createDataEntityAttribute('boolean', {}),
                        factories.dataBuilder.models.createDataEntityAttribute('binary'),
                        factories.dataBuilder.models.createDataEntityAttribute('uniqueidentifier'),
                        factories.dataBuilder.models.createDataEntityAttribute('file')
                    ]
                });

                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(
                    entity1
                );
                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(
                    entity2
                );

                for (const entity of [entity1, entity2]) {
                    if (
                        !(await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
                            entity.name
                        ))
                    ) {
                        await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab
                            .dataEntityTreeItemLabel(entity.name)
                            .click();
                    }
                    expect(
                        await ix.studio.dataBuilder.workbench.inspector.propertiesTab.attributePanels.count()
                    ).toBe(entity.attributes.length + 1); // +1 for the ID
                }
            });

            test('should update entity attribute name and type', async ({ ix, factories }) => {
                const testDataModel = factories.dataBuilder.models.createErDataModel();

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
                await ix.studio.dataBuilder.workbench.exit();
                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);
                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.name)
                    .open();

                const entity = factories.dataBuilder.models.createDataModelEntity({
                    attributes: [factories.dataBuilder.models.createDataEntityAttribute('int32')]
                });
                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity);

                if (
                    !(await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
                        entity.name
                    ))
                ) {
                    await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab
                        .dataEntityTreeItemLabel(entity.name)
                        .click();
                }

                await ix.studio.dataBuilder.workbench.inspector.propertiesTab
                    .attributePanel(entity.attributes[0].technicalName)
                    .nameInput.fill('new name');
                await ix.studio.dataBuilder.workbench.inspector.propertiesTab
                    .attributePanel(entity.attributes[0].technicalName)
                    .panelExpansionArrowButton.click();
                await ix.studio.dataBuilder.workbench.inspector.propertiesTab
                    .attributePanel(entity.attributes[0].technicalName)
                    .selectDataType('time');

                await ix.studio.dataBuilder.workbench.canvas.syncToDatabaseButton.click();
                await expect(ix.studio.notification('ER Model synced to database')).toBeVisible();

                if (
                    !(await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
                        entity.name
                    ))
                ) {
                    await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab
                        .dataEntityTreeItemLabel(entity.name)
                        .click();
                }

                await ix.studio.dataBuilder.workbench.canvas
                    .entityCard(entity.technicalName)
                    .root.click();

                expect(
                    await ix.studio.dataBuilder.workbench.inspector.propertiesTab
                        .attributePanel(entity.attributes[0].technicalName)
                        .nameInput.inputValue()
                ).toBe('new name');
            });

            test('should delete entity', async ({ ix, factories }) => {
                const testDataModel = factories.dataBuilder.models.createErDataModel();
                const entity1 = factories.dataBuilder.models.createDataModelEntity({
                    attributes: [
                        factories.dataBuilder.models.createDataEntityAttribute('int32'),
                        factories.dataBuilder.models.createDataEntityAttribute('varchar')
                    ]
                });

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(
                    entity1
                );
                await ix.studio.dataBuilder.workbench.canvas.toolbar.autoLayoutButton.click();

                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.deleteEntity(
                    entity1.name
                );

                await expect(
                    ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItem(
                        entity1.name
                    )
                ).not.toBeVisible();
            });
        });
    });
});
