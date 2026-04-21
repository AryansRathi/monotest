import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Tenant Settings', () => {
        test('should change home intro and tagline', async ({ ix }) => {
            await ix.studio.adminPage.open();
            await ix.studio.adminPage.tenantSettingsTab.open();

            await ix.studio.adminPage.tenantSettingsTab.nameInput.waitFor({ state: 'visible' });
            let value: string;
            if (
                (await ix.studio.adminPage.tenantSettingsTab.nameInput.inputValue()) == 'Tenant A'
            ) {
                value = 'Tenant B';
            } else {
                value = 'Tenant A';
            }

            await ix.studio.adminPage.tenantSettingsTab.nameInput.fill(value);
            await ix.studio.adminPage.tenantSettingsTab.homeIntroInput.fill(`${value} intro`);
            await ix.studio.adminPage.tenantSettingsTab.homeTaglineInput.fill(`${value} tag line`);
            await ix.studio.adminPage.tenantSettingsTab.applyButton.click();

            await ix.studio.homePage.open();
            await expect(ix.studio.homePage.title).toHaveText(`${value} intro`);
            await expect(ix.studio.homePage.subtitle).toHaveText(`${value} tag line`);
        });
    });
});
