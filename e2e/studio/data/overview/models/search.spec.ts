import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Data Models', () => {
        test.describe('Search', () => {
            test('should have no search results with search for bad UUID', async ({
                ix,
                factories
            }) => {
                const testDataModel = factories.dataBuilder.models.createErDataModel();

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(
                    '00000000-0000-0000-0000-000000000000'
                );

                expect(
                    await ix.studio.dataBuilder.overview.dataModelsTab.getDataModelCards()
                ).toHaveLength(0);
            });
        });
    });
});
