import { expect, test } from '@fixtures/base';
import { type TestErDataModel } from '@factories/dataBuilderFactory/dataModelsFactory';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Data Models', () => {
        test.describe('CRUD', () => {
            test('should create a data model', async ({ ix, factories }) => {
                const testDataModel: TestErDataModel =
                    factories.dataBuilder.models.createErDataModel();

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);

                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.name)
                        .root
                ).toBeVisible();
            });

            test('should delete a data model', async ({ ix, factories }) => {
                const testDataModel: TestErDataModel =
                    factories.dataBuilder.models.createErDataModel();

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);

                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.name)
                    .menuButton.click();
                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.name)
                    .menuItem('Delete')
                    .click();
                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.name)
                    .confirmDeleteButton.click();

                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.dataModelCard(testDataModel.name)
                        .root
                ).not.toBeVisible();

                if (await ix.studio.dataBuilder.overview.dataModelsTab.searchInput.isVisible()) {
                    await ix.studio.dataBuilder.overview.dataModelsTab.clearSearchButton.click();
                    await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);

                    await expect(
                        ix.studio.dataBuilder.overview.dataModelsTab.dataModelCard(
                            testDataModel.name
                        ).root
                    ).not.toBeVisible();
                }
            });

            test('should rename a data model', async ({ ix, factories }) => {
                const testDataModel: TestErDataModel =
                    factories.dataBuilder.models.createErDataModel();
                const newModelName = `${testDataModel.name.replace('Model', '').trim()} renamed`;

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);

                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.name)
                    .menuButton.click();
                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.name)
                    .menuItem('Rename')
                    .click();
                await ix.studio.dataBuilder.overview.dataModelsTab.renameDataModelModal.renameModel(
                    newModelName
                );

                await ix.studio.dataBuilder.overview.dataModelsTab.clearSearchButton.click();
                await ix.studio.dataBuilder.overview.dataModelsTab.search(newModelName);

                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.dataModelCard(newModelName).root
                ).toBeVisible();
                await expect(
                    ix.studio.dataBuilder.overview.dataModelsTab.dataModelCard(newModelName).name
                ).toHaveText(newModelName);
            });

            test(
                'should update the last updated date after editing',
                {
                    annotation: {
                        type: 'skip-reason',
                        description: 'Blocked by https://intrexx.atlassian.net/browse/IX25-5255'
                    }
                },
                async ({ ix, factories }) => {
                    test.skip();

                    const testDataModel = factories.dataBuilder.models.createErDataModel();

                    await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(
                        testDataModel
                    );
                    await ix.studio.dataBuilder.workbench.exit();

                    await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);
                    const dateBefore = new Date(
                        await ix.studio.dataBuilder.overview.dataModelsTab
                            .dataModelCard(testDataModel.name)
                            .lastUpdated.innerText()
                    );

                    await ix.studio.dataBuilder.overview.dataModelsTab
                        .dataModelCard(testDataModel.name)
                        .open();
                    await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(
                        factories.dataBuilder.models.createDataModelEntity()
                    );
                    await ix.studio.dataBuilder.workbench.exit();

                    await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);
                    const dateAfter = new Date(
                        await ix.studio.dataBuilder.overview.dataModelsTab
                            .dataModelCard(testDataModel.name)
                            .lastUpdated.innerText()
                    );

                    expect(dateAfter.getTime()).toBeGreaterThan(dateBefore.getTime());
                }
            );
        });
    });
});
