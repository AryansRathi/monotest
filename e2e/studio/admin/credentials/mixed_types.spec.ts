import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Credentials', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.credentialsTab.open();
        });

        test.describe('Mixed Credential Types', () => {
            test('should manage credentials across different folders', async ({
                ix,
                factories
            }) => {
                const folder1 = factories.primitives.createUniqueString();
                const folder2 = factories.primitives.createUniqueString();

                const cred1 = factories.admin.createTokenCredential({
                    path: `${folder1}/${factories.primitives.createUniqueString()}`
                });
                const cred2 = factories.admin.createApiKeyCredential({
                    path: `${folder2}/${factories.primitives.createUniqueString()}`
                });

                await ix.studio.adminPage.credentialsTab.createFolder(folder1);
                await ix.studio.adminPage.credentialsTab.createFolder(folder2);
                await ix.studio.adminPage.credentialsTab.createTokenCredential(cred1);
                await ix.studio.adminPage.credentialsTab.createApiKeyCredential(cred2);

                // Check folder1 contents
                await ix.studio.adminPage.credentialsTab.selectFolder(folder1);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(cred1.name)
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(cred2.name)
                ).not.toBeVisible();

                // Check folder2 contents
                await ix.studio.adminPage.credentialsTab.selectFolder(folder2);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(cred1.name)
                ).not.toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(cred2.name)
                ).toBeVisible();
            });
        });
    });
});
