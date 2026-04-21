import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Credentials', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.credentialsTab.open();
        });

        test.describe('Folder Operations', () => {
            test('should create a new folder', async ({ ix, factories }) => {
                const folderName = factories.primitives.createUniqueString();

                await ix.studio.adminPage.credentialsTab.createFolder(folderName);

                await expect(
                    ix.studio.adminPage.credentialsTab.folderTreeItem(folderName)
                ).toBeVisible();
            });

            test('should navigate to folder and show its contents', async ({ ix, factories }) => {
                const folderName = factories.primitives.createUniqueString();
                const credential = factories.admin.createTokenCredential({
                    path: `${folderName}/${factories.primitives.createUniqueString()}`
                });

                await ix.studio.adminPage.credentialsTab.createFolder(folderName);
                await ix.studio.adminPage.credentialsTab.createTokenCredential(credential);
                await ix.studio.adminPage.credentialsTab.selectFolder(folderName);

                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(credential.name)
                ).toBeVisible();
            });

            test('should delete a folder', async ({ ix, factories }) => {
                const folderName = factories.primitives.createUniqueString();

                await ix.studio.adminPage.credentialsTab.createFolder(folderName);
                await expect(
                    ix.studio.adminPage.credentialsTab.folderTreeItem(folderName)
                ).toBeVisible();

                await ix.studio.adminPage.credentialsTab.deleteFolder(folderName);

                await expect(
                    ix.studio.adminPage.credentialsTab.folderTreeItem(folderName)
                ).not.toBeVisible();
            });

            test('should display "All Folders" root node', async ({ ix }) => {
                await expect(ix.studio.adminPage.credentialsTab.folderTree).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.folderTreeItem('All Folders')
                ).toBeVisible();
            });

            test('should create nested folder structure', async ({ ix, factories }) => {
                const parentFolder = factories.primitives.createUniqueString();
                const childFolder = factories.primitives.createUniqueString();

                await ix.studio.adminPage.credentialsTab.createFolder(parentFolder);
                await ix.studio.adminPage.credentialsTab.selectFolder(parentFolder);
                await ix.studio.adminPage.credentialsTab.createFolder(childFolder);
                // Expand the parent folder to make child visible in the tree
                await ix.studio.adminPage.credentialsTab
                    .folderTreeExpandButton(parentFolder)
                    .click();
                await expect(
                    ix.studio.adminPage.credentialsTab.folderTreeItem(parentFolder)
                ).toBeVisible();

                const childLocator = ix.studio.adminPage.credentialsTab.folderTreeItem(
                    `${parentFolder}/${childFolder}`
                );

                await expect(childLocator).toBeVisible();
                await expect(childLocator).toHaveText(childFolder);
            });
        });
    });
});
