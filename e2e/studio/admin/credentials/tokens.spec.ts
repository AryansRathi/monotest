import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Credentials', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.credentialsTab.open();
        });

        test.describe('Token Credential CRUD', () => {
            test('should create a token credential with ACTIVE status', async ({
                ix,
                factories
            }) => {
                const tokenCredential = factories.admin.createTokenCredential();

                await ix.studio.adminPage.credentialsTab.createTokenCredential(tokenCredential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(tokenCredential.name);

                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(tokenCredential.name)
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialStatusCell(tokenCredential.name)
                ).toHaveText('ACTIVE');
            });

            test('should delete a token credential', async ({ ix, factories }) => {
                const tokenCredential = factories.admin.createTokenCredential();

                await ix.studio.adminPage.credentialsTab.createTokenCredential(tokenCredential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(tokenCredential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(tokenCredential.name)
                ).toBeVisible();

                await ix.studio.adminPage.credentialsTab.deleteCredential(tokenCredential.name);

                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(tokenCredential.name)
                ).not.toBeVisible();
            });

            test('should rename a token credential', async ({ ix, factories }) => {
                const tokenCredential = factories.admin.createTokenCredential();
                const newName = factories.admin.createTokenCredential().name;

                await ix.studio.adminPage.credentialsTab.createTokenCredential(tokenCredential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(tokenCredential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(tokenCredential.name)
                ).toBeVisible();

                await ix.studio.adminPage.credentialsTab.renameCredential(
                    tokenCredential.name,
                    newName
                );
                await ix.studio.adminPage.credentialsTab.searchInput.fill(newName);

                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(newName)
                ).toBeVisible();
            });

            test('should deactivate and reactivate a token credential', async ({
                ix,
                factories
            }) => {
                const tokenCredential = factories.admin.createTokenCredential();

                await ix.studio.adminPage.credentialsTab.createTokenCredential(tokenCredential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(tokenCredential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialStatusCell(tokenCredential.name)
                ).toHaveText('ACTIVE');

                await ix.studio.adminPage.credentialsTab.deactivateCredential(tokenCredential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialStatusCell(tokenCredential.name)
                ).toHaveText('DISABLED');

                await ix.studio.adminPage.credentialsTab.activateCredential(tokenCredential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialStatusCell(tokenCredential.name)
                ).toHaveText('ACTIVE');
            });
        });
    });
});
