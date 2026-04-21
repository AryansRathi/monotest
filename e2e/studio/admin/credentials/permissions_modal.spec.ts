import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Credentials', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.credentialsTab.open();
        });

        test.describe('Permissions Modal', () => {
            test('should open permissions modal for credential', async ({ ix, factories }) => {
                const credential = factories.admin.createTokenCredential();

                await ix.studio.adminPage.credentialsTab.createTokenCredential(credential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(credential.name);
                await ix.studio.adminPage.credentialsTab.openCredentialPermissions(credential.name);

                await expect(
                    ix.studio.adminPage.credentialsTab.permissionsModal.root
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.permissionsModal.usersTabButton
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.permissionsModal.groupsTabButton
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.permissionsModal.rolesTabButton
                ).toBeVisible();
            });

            test('should open permissions modal for folder', async ({ ix, factories }) => {
                const folderName = factories.primitives.createUniqueString();
                const credential = factories.admin.createTokenCredential({
                    path: `${folderName}/${factories.primitives.createUniqueString()}`
                });

                await ix.studio.adminPage.credentialsTab.createFolder(folderName);
                await ix.studio.adminPage.credentialsTab.createTokenCredential(credential);
                await ix.studio.adminPage.credentialsTab.openFolderPermissions(folderName);

                await expect(
                    ix.studio.adminPage.credentialsTab.permissionsModal.root
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.permissionsModal.inheritToggle
                ).toBeVisible();
            });
        });
    });
});
