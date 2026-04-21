import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('OAuth2 Clients', () => {
        test.describe('Search', () => {
            test.beforeEach(async ({ ix }) => {
                await ix.studio.navRail.adminButton.click();
                await ix.studio.adminPage.oauth2ClientsTab.open();
            });

            test('should filter clients by search', async ({ ix, factories }) => {
                const client = factories.admin.createOAuth2Client();
                const { clientId } =
                    await ix.studio.adminPage.oauth2ClientsTab.createClient(client);

                await ix.studio.adminPage.oauth2ClientsTab.searchInput.fill(client.name);

                await expect(
                    ix.studio.adminPage.oauth2ClientsTab.clientRow(clientId)
                ).toBeVisible();

                await ix.studio.adminPage.oauth2ClientsTab.searchInput.fill('__no_match__');

                await expect(
                    ix.studio.adminPage.oauth2ClientsTab.clientRow(clientId)
                ).not.toBeVisible();
            });
        });
    });
});
