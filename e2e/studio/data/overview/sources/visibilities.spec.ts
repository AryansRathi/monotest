import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Data Sources', () => {
        test.describe('overview page', () => {
            test('should have create data source button', async ({ ix }) => {
                await ix.studio.dataBuilder.overview.dataSourcesTabButton.click();

                await expect(
                    ix.studio.dataBuilder.overview.dataSourcesTab.createDataSourceButton
                ).toBeVisible();
                await expect(
                    ix.studio.dataBuilder.overview.dataSourcesTab.createDataSourceButton
                ).toHaveText(/Create Data Source/);
            });
        });
    });
});
