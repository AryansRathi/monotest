import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Credentials', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.credentialsTab.open();
        });

        test.describe('Data Table', () => {
            test('should display credential metadata in table columns', async ({
                ix,
                factories
            }) => {
                const credential = factories.admin.createTokenCredential();

                await ix.studio.adminPage.credentialsTab.createTokenCredential(credential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(credential.name);

                const row = ix.studio.adminPage.credentialsTab.credentialRow(credential.name);
                await expect(row).toBeVisible();
                await expect(row.locator('td').nth(0)).toHaveText(credential.name);
                await expect(row.locator('td').nth(1)).toContainText(credential.path);
                await expect(row.locator('td').nth(2)).toHaveText('TOKEN');
                await expect(row.locator('td').nth(5)).toHaveText('ACTIVE');
            });

            test('should show actions menu for each credential', async ({ ix, factories }) => {
                const credential = factories.admin.createTokenCredential();

                await ix.studio.adminPage.credentialsTab.createTokenCredential(credential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(credential.name);
                await ix.studio.adminPage.credentialsTab
                    .credentialMenuButton(credential.name)
                    .click();

                await expect(ix.studio.adminPage.credentialsTab.credentialMenuRoot).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialMenuEditItem
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialMenuDeleteItem
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialMenuDeactivateItem
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialMenuPermissionsItem
                ).toBeVisible();
            });
        });
    });
});
