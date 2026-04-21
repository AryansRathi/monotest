import { type TestErDataModel } from '@factories/dataBuilderFactory/dataModelsFactory';
import { test, expect } from '@fixtures/base';
import type { DataModelsTab } from '@pages/ix/studio/dataBuilder/overviewPage/dataModelsTab';
import type { DataModelCard } from '@pages/ix/studio/dataBuilder/overviewPage/dataModelsTab/dataModelCard';

let dataModelsTab: DataModelsTab;

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
    dataModelsTab = ix.studio.dataBuilder.overview.dataModelsTab;
});

test.describe('Data Builder', () => {
    test.describe('Data Models', () => {
        test.describe.serial('Sorting on the overview page', () => {
            const testDataModels: TestErDataModel[] = [];

            test('setup: create data models', async ({ ix, factories }) => {
                for (let i = 0; i < 4; i++) {
                    const testDataModel = factories.dataBuilder.models.createErDataModel();
                    testDataModels.push(testDataModel);
                    await dataModelsTab.createErDataModel(testDataModel);
                    await ix.studio.dataBuilder.workbench.exit();
                }
            });

            const getNonFavoriteCards = async (): Promise<DataModelCard[]> => {
                const cards = await dataModelsTab.getDataModelCards();
                const result: DataModelCard[] = [];
                for (const card of cards) {
                    if (!(await card.isFavorite())) result.push(card);
                }
                return result;
            };

            const getNames = async (): Promise<string[]> => {
                const cards = await getNonFavoriteCards();
                return Promise.all(
                    cards.map(async (c) => (await c.name.textContent())?.trim() ?? '')
                );
            };

            const getCreatedDates = async (): Promise<Date[]> => {
                const cards = await getNonFavoriteCards();
                return Promise.all(
                    cards.map(async (c) => new Date((await c.created.textContent())?.trim() ?? ''))
                );
            };

            const getUpdatedDates = async (): Promise<Date[]> => {
                const cards = await getNonFavoriteCards();
                return Promise.all(
                    cards.map(
                        async (c) => new Date((await c.lastUpdated.textContent())?.trim() ?? '')
                    )
                );
            };

            test('should sort data models A-Z', async () => {
                await dataModelsTab.sortByNameAscending();
                const names = await getNames();
                expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
            });

            test('should sort data models Z-A', async () => {
                await dataModelsTab.sortByNameDescending();
                const names = await getNames();
                expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
            });

            test('should sort data models by Created (Newest)', async () => {
                await dataModelsTab.sortByCreatedNewest();
                const dates = await getCreatedDates();
                expect(dates).toEqual([...dates].sort((a, b) => b.getTime() - a.getTime()));
            });

            test('should sort data models by Created (Oldest)', async () => {
                await dataModelsTab.sortByCreatedOldest();
                const dates = await getCreatedDates();
                expect(dates).toEqual([...dates].sort((a, b) => a.getTime() - b.getTime()));
            });

            test('should sort data models by Last Updated (Newest)', async () => {
                await dataModelsTab.sortByUpdatedNewest();
                const dates = await getUpdatedDates();
                expect(dates).toEqual([...dates].sort((a, b) => b.getTime() - a.getTime()));
            });

            test('should sort data models by Last Updated (Oldest)', async () => {
                await dataModelsTab.sortByUpdatedOldest();
                const dates = await getUpdatedDates();
                expect(dates).toEqual([...dates].sort((a, b) => a.getTime() - b.getTime()));
            });
        });
    });
});
