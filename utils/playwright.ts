import { expect, type Locator } from '@playwright/test';
import { testConfig } from '@test.config';

/**
 * Scrolls the given container until the target element becomes visible.
 * Vuetify select dropdowns do not behave like normal scrollable lists: Playwright
 * cannot scroll them into view the usual way (e.g. `scrollIntoViewIfNeeded`), so
 * the target may never appear no matter how long you wait.
 *
 * Before removing this workaround, verify against a long list—e.g. create many
 * credentials (on the order of 100), then create a data source and pick the
 * credential that was added last (far down the dropdown). A short list (a few
 * items) will often pass without this helper and is not enough to justify deleting it.
 *
 * `.toPass()` ignores the global expect timeout and defaults to 0 (infinite),
 * so we set an explicit default value.
 */
export async function scrollUntilVisible(
    target: Locator,
    scrollContainer: Locator,
    options?: { timeout?: number }
) {
    await expect(async () => {
        if (!(await target.isVisible())) {
            await scrollContainer.hover();
            await scrollContainer.page().mouse.wheel(0, 250);
            throw new Error('Element not yet visible, retrying...');
        }
    }).toPass({
        intervals: [0],
        timeout: options?.timeout ?? 3 * testConfig.actionTimeout
    });
}
