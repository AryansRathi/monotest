import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Credentials', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.credentialsTab.open();
        });

        test.describe('Client ID/Secret Credentials CRUD', () => {
            test('should create a client ID/secret credential with ACTIVE status', async ({
                ix,
                factories
            }) => {
                const credential = factories.admin.createClientIdSecretCredential();

                await ix.studio.adminPage.credentialsTab.createClientIdSecretCredential(credential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(credential.name);

                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(credential.name)
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialStatusCell(credential.name)
                ).toHaveText('ACTIVE');
            });

            test('should delete a client ID/secret credential', async ({ ix, factories }) => {
                const credential = factories.admin.createClientIdSecretCredential();

                await ix.studio.adminPage.credentialsTab.createClientIdSecretCredential(credential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(credential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(credential.name)
                ).toBeVisible();

                await ix.studio.adminPage.credentialsTab.deleteCredential(credential.name);

                await expect(
                    ix.studio.adminPage.credentialsTab.credentialRow(credential.name)
                ).not.toBeVisible();
            });

            test('should deactivate and reactivate a client ID/secret credential', async ({
                ix,
                factories
            }) => {
                const credential = factories.admin.createClientIdSecretCredential();

                await ix.studio.adminPage.credentialsTab.createClientIdSecretCredential(credential);
                await ix.studio.adminPage.credentialsTab.searchInput.fill(credential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialStatusCell(credential.name)
                ).toHaveText('ACTIVE');

                await ix.studio.adminPage.credentialsTab.deactivateCredential(credential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialStatusCell(credential.name)
                ).toHaveText('DISABLED');

                await ix.studio.adminPage.credentialsTab.activateCredential(credential.name);
                await expect(
                    ix.studio.adminPage.credentialsTab.credentialStatusCell(credential.name)
                ).toHaveText('ACTIVE');
            });
        });
    });
});
