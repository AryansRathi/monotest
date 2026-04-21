import { TestErDataModel } from '@factories/dataBuilderFactory/dataModelsFactory';
import { expect, test } from '@fixtures/base';

test.describe('Accessibility', () => {
    test.describe('Home Page', () => {
        test.beforeEach('Create test data to populate the home page', async ({ ix, factories }) => {
            const testDataModel: TestErDataModel = factories.dataBuilder.models.createErDataModel();

            await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);
        });

        test('should not have accessibility issues', async ({ ix, makeAxeBuilder }, testInfo) => {
            await ix.studio.homePage.open();

            // Do not start the scan before the page is fully loaded
            await expect(ix.studio.homePage.createAppQuickActionButton).toBeVisible();

            const accessibilityScanResults = await makeAxeBuilder()
                .disableRules(['color-contrast'])
                .analyze();

            await testInfo.attach('accessibility-scan-results', {
                body: JSON.stringify(accessibilityScanResults, null, 2),
                contentType: 'application/json'
            });

            expect(accessibilityScanResults.violations).toEqual([]);
        });
    });

    test.describe('Admin Page', () => {
        test.describe('Tenant Settings', () => {
            test('should not have accessibility issues', async ({
                ix,
                makeAxeBuilder
            }, testInfo) => {
                await ix.studio.adminPage.open();
                await ix.studio.adminPage.tenantSettingsTab.open();

                // Do not start the scan before the page is fully loaded
                await expect(ix.studio.adminPage.sidebar.root).toBeVisible();

                const accessibilityScanResults = await makeAxeBuilder()
                    .disableRules(['color-contrast'])
                    .analyze();

                await testInfo.attach('accessibility-scan-results', {
                    body: JSON.stringify(accessibilityScanResults, null, 2),
                    contentType: 'application/json'
                });

                expect(accessibilityScanResults.violations).toEqual([]);
            });
        });
    });
});
