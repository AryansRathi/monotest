import { expect, test } from '@fixtures/base';

test.describe('Accessibility', () => {
    test.describe('Portal Page', () => {
        test('should not have accessibility issues', async ({ ix, makeAxeBuilder }, testInfo) => {
            await ix.portal.open();

            // Do not start the scan before the page is fully loaded
            await expect(ix.portal.stageSwitcherButton).toBeVisible();

            const accessibilityScanResults = await makeAxeBuilder()
                .disableRules(['color-contrast'])
                .analyze();

            await testInfo.attach('accessibility-scan-results', {
                body: JSON.stringify(accessibilityScanResults, null, 2),
                contentType: 'application/json'
            });

            expect(accessibilityScanResults.violations).toEqual([]);
        });
    });
});
