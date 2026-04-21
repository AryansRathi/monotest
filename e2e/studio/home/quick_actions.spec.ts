import { expect, test } from '@fixtures/base';

test.describe('Home', () => {
    test.describe('Quick Actions', () => {
        test('should navigate to App Builder when clicking create app quick action', async ({
            ix
        }) => {
            await ix.studio.homePage.open();
            await ix.studio.homePage.createAppQuickActionButton.click();
            await expect(ix.studio.page).toHaveURL(/app-builder\/overview\?dialog=createApp/);
        });

        test('should navigate to Process Builder when clicking create process quick action', async ({
            ix
        }) => {
            await ix.studio.homePage.open();
            await ix.studio.homePage.createProcessQuickActionButton.click();
            await expect(ix.studio.page).toHaveURL(
                /process-builder\/overview\/models\?dialog=editProcess/
            );
        });

        test('should navigate to Data Builder when clicking create data model quick action', async ({
            ix
        }) => {
            await ix.studio.homePage.open();
            await ix.studio.homePage.createDataModelQuickActionButton.click();
            await expect(ix.studio.page).toHaveURL(
                /data-builder\/overview\/models\?dialog=createDataModel/
            );
        });
    });
});
