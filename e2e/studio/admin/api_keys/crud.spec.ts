import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('API Keys CRUD', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.apiKeysTab.open();
        });

        test('should create api key', async ({ ix, factories }) => {
            const apiKey = factories.admin.createApiKey();
            await ix.studio.adminPage.apiKeysTab.createApiKeyButton.click();

            await ix.studio.adminPage.apiKeysTab.createAPIKeyModal.apiKeyNameInput.fill(
                apiKey.name
            );
            await ix.studio.adminPage.apiKeysTab.createAPIKeyModal.apiKeyIDInput.fill(apiKey.id);
            await ix.studio.adminPage.apiKeysTab.createAPIKeyModal.okayButton.click();

            await ix.studio.adminPage.apiKeysTab.newApiKeyGeneratedModal.okayButton.click();

            await ix.studio.adminPage.apiKeysTab.searchInput.fill(apiKey.name);

            await expect(ix.studio.adminPage.apiKeysTab.apiKeyRow(apiKey.name)).toBeVisible();
        });

        test('should delete api key', async ({ ix, factories }) => {
            const apiKey = factories.admin.createApiKey();
            await ix.studio.adminPage.apiKeysTab.createApiKey(apiKey);
            await ix.studio.adminPage.apiKeysTab.searchInput.fill(apiKey.name);
            await expect(ix.studio.adminPage.apiKeysTab.apiKeyRow(apiKey.name)).toBeVisible();
            await ix.studio.adminPage.apiKeysTab.apiKeyMenuButton(apiKey.name).click();
            await ix.studio.adminPage.apiKeysTab.apiKeyMenuDeleteItem.click();
            await ix.studio.adminPage.apiKeysTab.deleteApiKeyModal.deleteButton.click();
            await expect(ix.studio.adminPage.apiKeysTab.apiKeyRow(apiKey.name)).not.toBeVisible();
        });

        test('should deactivate api key', async ({ ix, factories }) => {
            const apiKey = factories.admin.createApiKey();
            await ix.studio.adminPage.apiKeysTab.createApiKey(apiKey);
            await ix.studio.adminPage.apiKeysTab.searchInput.fill(apiKey.name);
            await expect(ix.studio.adminPage.apiKeysTab.apiKeyRow(apiKey.name)).toBeVisible();
            await ix.studio.adminPage.apiKeysTab.deactivateApiKey(apiKey.name);
            await expect(
                ix.studio.adminPage.apiKeysTab.apiKeyStatusBadge(apiKey.name).getByText('DISABLED')
            ).toBeVisible();
        });

        test('should activate api key', async ({ ix, factories }) => {
            const apiKey = factories.admin.createApiKey();
            await ix.studio.adminPage.apiKeysTab.createApiKey(apiKey);
            await ix.studio.adminPage.apiKeysTab.searchInput.fill(apiKey.name);
            await expect(
                ix.studio.adminPage.apiKeysTab.apiKeyStatusBadge(apiKey.name).getByText('ACTIVE')
            ).toBeVisible();
            await ix.studio.adminPage.apiKeysTab.deactivateApiKey(apiKey.name);
            await expect(
                ix.studio.adminPage.apiKeysTab.apiKeyStatusBadge(apiKey.name).getByText('DISABLED')
            ).toBeVisible();
            await ix.studio.adminPage.apiKeysTab.activateApiKey(apiKey.name);
            await expect(
                ix.studio.adminPage.apiKeysTab.apiKeyStatusBadge(apiKey.name).getByText('ACTIVE')
            ).toBeVisible();
        });

        test('api key should be different after recreation', async ({ ix, factories }) => {
            const apiKey = factories.admin.createApiKey();
            const apiKeyValue = await ix.studio.adminPage.apiKeysTab.createApiKey(apiKey);
            await ix.studio.adminPage.apiKeysTab.searchInput.fill(apiKey.name);
            await expect(ix.studio.adminPage.apiKeysTab.apiKeyRow(apiKey.name)).toBeVisible();
            const newApiKeyValue = await ix.studio.adminPage.apiKeysTab.regenerateApiKey(
                apiKey.name
            );
            await expect(ix.studio.adminPage.apiKeysTab.apiKeyRow(apiKey.name)).toBeVisible();
            expect(apiKeyValue).not.toEqual(newApiKeyValue);
        });
    });
});
