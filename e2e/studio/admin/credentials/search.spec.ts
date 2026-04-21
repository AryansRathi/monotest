import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Credentials', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.credentialsTab.open();
        });

        test.describe('Search', () => {
            test('should filter credentials by search term', async ({ ix, factories }) => {
                const credential1 = factories.admin.createTokenCredential();
                const credential2 = factories.admin.createTokenCredential();

                await ix.studio.adminPage.credentialsTab.createTokenCredential(credential1);
                await ix.studio.adminPage.credentialsTab.createTokenCredential(credential2);

                await ix.studio.adminPage.credentialsTab.searchInput.fill(credential1.name);

                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(credential1.name)
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(credential2.name)
                ).not.toBeVisible();
            });
        });
    });
});
