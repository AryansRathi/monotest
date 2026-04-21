import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('REST Data Models', () => {
        test.describe('CRUD', () => {
            test('should create a REST data model', async ({ ix, factories }) => {
                const testDataModel = factories.dataBuilder.models.createRestDataModel();

                await ix.studio.dataBuilder.overview.dataModelsTab.createRestDataModel(
                    testDataModel
                );
                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);

                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.name)
                        .typeChip
                ).toContainText('REST');
                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.name)
                        .root
                ).toBeVisible();
            });
        });
    });
});
