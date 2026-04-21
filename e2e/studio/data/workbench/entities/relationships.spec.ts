import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Entity Relationships', () => {
        test('should display a primary key for a new entity on the data model canvas card', async ({
            ix,
            factories
        }) => {
            const testDataModel = factories.dataBuilder.models.createErDataModel();
            const entity1 = factories.dataBuilder.models.createDataModelEntity({
                attributes: []
            });

            await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
            await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity1);

            await expect(
                ix.studio.dataBuilder.workbench.canvas.entityCard(entity1.technicalName).keyIcon
            ).toBeVisible();
        });

        test('should create foreign key relationship', async ({ ix, factories }) => {
            const testDataModel = factories.dataBuilder.models.createErDataModel();
            const entity1 = factories.dataBuilder.models.createDataModelEntity({
                attributes: [factories.dataBuilder.models.createDataEntityAttribute('int16')]
            });
            const entity2 = factories.dataBuilder.models.createDataModelEntity({
                attributes: [factories.dataBuilder.models.createDataEntityAttribute('int16')]
            });

            await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
            await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity1);
            await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(entity2);

            if (
                !(await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
                    entity1.name
                ))
            ) {
                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab
                    .dataEntityTreeItemLabel(entity1.name)
                    .click();
            }

            const entity1IdAttributePanel =
                ix.studio.dataBuilder.workbench.inspector.propertiesTab.attributePanel('id');
            await entity1IdAttributePanel.panelExpansionArrowButton.click();
            await entity1IdAttributePanel.primaryKeyCheckbox.uncheck();

            const entity1OtherAttributePanel =
                ix.studio.dataBuilder.workbench.inspector.propertiesTab.attributePanel(
                    entity1.attributes[0].technicalName
                );
            await entity1OtherAttributePanel.panelExpansionArrowButton.click();
            await entity1OtherAttributePanel.primaryKeyCheckbox.check();

            if (
                !(await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.dataEntityTreeItemIsSelected(
                    entity2.name
                ))
            ) {
                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab
                    .dataEntityTreeItemLabel(entity2.name)
                    .click();
            }

            const entity2IdAttributePanel =
                ix.studio.dataBuilder.workbench.inspector.propertiesTab.attributePanel('id');
            await entity2IdAttributePanel.panelExpansionArrowButton.click();
            await entity2IdAttributePanel.primaryKeyCheckbox.uncheck();

            await ix.studio.dataBuilder.workbench.canvas.toolbar.autoLayoutButton.click();
            await ix.studio.dataBuilder.workbench.canvas.fitViewButton.click();

            const sourceHandle = ix.studio.dataBuilder.workbench.canvas
                .entityCard(entity1.technicalName)
                .connectionHandle(entity1.attributes[0].technicalName, 'left');
            const targetHandle = ix.studio.dataBuilder.workbench.canvas
                .entityCard(entity2.technicalName)
                .connectionHandle(entity2.attributes[0].technicalName, 'right');
            await ix.studio.dataBuilder.workbench.canvas.hideMinimap();
            await sourceHandle.dragTo(targetHandle);

            await ix.studio.dataBuilder.workbench.canvas.syncToDatabaseButton.click();

            await expect(ix.studio.dataBuilder.workbench.canvas.connectionLine).toBeVisible();
            await expect(
                ix.studio.dataBuilder.workbench.canvas.entityCard(entity1.technicalName).keyIcon
            ).toBeVisible();
            await expect(
                ix.studio.dataBuilder.workbench.canvas.entityCard(entity2.technicalName).keyIcon
            ).toBeVisible();
        });
    });
});
