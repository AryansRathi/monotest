import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('OAuth2 Clients', () => {
        test.describe('CRUD', () => {
            test.beforeEach(async ({ ix }) => {
                await ix.studio.navRail.adminButton.click();
                await ix.studio.adminPage.oauth2ClientsTab.open();
            });

            test('should create an OAuth2 client and display credentials', async ({
                ix,
                factories
            }) => {
                const client = factories.admin.createOAuth2Client();
                await ix.studio.adminPage.oauth2ClientsTab.createButton.click();

                await ix.studio.adminPage.oauth2ClientsTab.createModal.clientIdSuffixInput.fill(
                    client.clientIdSuffix
                );
                await ix.studio.adminPage.oauth2ClientsTab.createModal.nameInput.fill(client.name);
                await ix.studio.adminPage.oauth2ClientsTab.createModal.descriptionInput.fill(
                    client.description
                );
                await ix.studio.adminPage.oauth2ClientsTab.createModal.submitButton.click();

                const clientId =
                    await ix.studio.adminPage.oauth2ClientsTab.credentialsModal.getClientId();
                const secret =
                    await ix.studio.adminPage.oauth2ClientsTab.credentialsModal.getSecret();

                expect(clientId).toBe(`ixapi-${client.clientIdSuffix}`);
                expect(secret).not.toBe('');

                await ix.studio.adminPage.oauth2ClientsTab.credentialsModal.okButton.click();

                await expect(
                    ix.studio.adminPage.oauth2ClientsTab.clientRow(clientId)
                ).toBeVisible();
            });

            test('should delete an OAuth2 client', async ({ ix, factories }) => {
                const client = factories.admin.createOAuth2Client();
                const { clientId } =
                    await ix.studio.adminPage.oauth2ClientsTab.createClient(client);

                await expect(
                    ix.studio.adminPage.oauth2ClientsTab.clientRow(clientId)
                ).toBeVisible();

                await ix.studio.adminPage.oauth2ClientsTab.deleteClient(clientId);

                await expect(
                    ix.studio.adminPage.oauth2ClientsTab.clientRow(clientId)
                ).not.toBeVisible();
            });

            test('should deactivate an OAuth2 client', async ({ ix, factories }) => {
                const client = factories.admin.createOAuth2Client();
                const { clientId } =
                    await ix.studio.adminPage.oauth2ClientsTab.createClient(client);

                await expect(
                    ix.studio.adminPage.oauth2ClientsTab
                        .clientStatusChip(clientId)
                        .getByText('Active')
                ).toBeVisible();

                await ix.studio.adminPage.oauth2ClientsTab.disableClient(clientId);

                await expect(
                    ix.studio.adminPage.oauth2ClientsTab
                        .clientStatusChip(clientId)
                        .getByText('Inactive')
                ).toBeVisible();
            });

            test('should activate a deactivated OAuth2 client', async ({ ix, factories }) => {
                const client = factories.admin.createOAuth2Client();
                const { clientId } =
                    await ix.studio.adminPage.oauth2ClientsTab.createClient(client);

                await ix.studio.adminPage.oauth2ClientsTab.disableClient(clientId);
                await expect(
                    ix.studio.adminPage.oauth2ClientsTab
                        .clientStatusChip(clientId)
                        .getByText('Inactive')
                ).toBeVisible();

                await ix.studio.adminPage.oauth2ClientsTab.enableClient(clientId);
                await expect(
                    ix.studio.adminPage.oauth2ClientsTab
                        .clientStatusChip(clientId)
                        .getByText('Active')
                ).toBeVisible();
            });

            test('should regenerate secret and return a different value', async ({
                ix,
                factories
            }) => {
                const client = factories.admin.createOAuth2Client();
                const { clientId, secret: originalSecret } =
                    await ix.studio.adminPage.oauth2ClientsTab.createClient(client);

                const newSecret =
                    await ix.studio.adminPage.oauth2ClientsTab.regenerateSecret(clientId);

                expect(newSecret).not.toBe('');
                expect(newSecret).not.toBe(originalSecret);
            });

            test('should not create client with duplicate name', async ({ ix, factories }) => {
                const client = factories.admin.createOAuth2Client();
                await ix.studio.adminPage.oauth2ClientsTab.createClient(client);

                await ix.studio.adminPage.oauth2ClientsTab.createButton.click();
                await ix.studio.adminPage.oauth2ClientsTab.createModal.submitButton.click();

                await expect(ix.studio.adminPage.oauth2ClientsTab.createModal.root).toBeVisible();
            });
        });
    });
});
