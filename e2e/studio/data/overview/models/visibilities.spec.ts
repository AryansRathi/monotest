import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Data Models', () => {
        test.describe('overview page', () => {
            test('should have create data model button', async ({ ix }) => {
                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.createDataModelButton
                ).toBeVisible();

                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.createDataModelButton
                ).toContainText('Create Data Model');
            });

            test('should have import buttons', async ({ ix }) => {
                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.importSplitButton
                ).toBeVisible();

                await ix.studio.dataBuilder.overview.dataModelsTab.importSplitButton.click();
                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.importFromExportMenuItem
                ).toBeVisible();
                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.importFromDatabaseMenuItem
                ).toBeVisible();
            });

            test('should display data models in grid view', async ({ ix, factories }) => {
                const testDataModel = factories.dataBuilder.models.createErDataModel();

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.gridViewButton.click();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);

                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.name)
                        .root
                ).toBeVisible();
            });
        });
    });
});
