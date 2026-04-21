import { expect, test } from '@fixtures/base';
import { type TestErDataModel } from '@factories/dataBuilderFactory/dataModelsFactory';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Data Models', () => {
        test.describe('Favorites', () => {
            test('are on top of the overview page list', async ({ ix, factories }) => {
                const firstDataModel: TestErDataModel =
                    factories.dataBuilder.models.createErDataModel();
                const secondDataModel: TestErDataModel =
                    factories.dataBuilder.models.createErDataModel();

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(
                    firstDataModel
                );
                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(
                    secondDataModel
                );
                await ix.studio.dataBuilder.workbench.exit();

                const modelToFavorite = firstDataModel;

                // Favorite the model
                await ix.studio.dataBuilder.overview.dataModelsTab.search(modelToFavorite.name);
                expect(
                    await ix.studio.dataBuilder.overview.dataModelsTab
                        .dataModelCard(modelToFavorite.name)
                        .isFavorite()
                ).toBe(false);
                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(modelToFavorite.name)
                    .favoriteButton.click();
                await ix.studio.dataBuilder.overview.dataModelsTab.clearSearchButton.click();

                let seenNonFavoriteModel = false;
                for (const card of await ix.studio.dataBuilder.overview.dataModelsTab.getDataModelCards()) {
                    if (await card.isFavorite()) {
                        expect(
                            seenNonFavoriteModel,
                            `Favorited Model appeared after a non-favorited`
                        ).toBe(false);
                    } else {
                        seenNonFavoriteModel = true;
                    }

                    if (card.displayName === modelToFavorite.name) {
                        expect(await card.isFavorite()).toBe(true);
                    }

                    if (card.displayName === secondDataModel.name) {
                        expect(await card.isFavorite()).toBe(false);
                    }
                }
            });
        });
    });
});
