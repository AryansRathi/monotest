import { test as baseTest } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type TestScopedFixtures = {
    makeAxeBuilder: () => AxeBuilder;
};

type WorkerScopedFixtures = {};

export const accessibilityFixtures = baseTest.extend<TestScopedFixtures, WorkerScopedFixtures>({
    // For accessibility ("a11y") testing
    makeAxeBuilder: [
        async ({ page }, use) => {
            const makeAxeBuilder = () =>
                new AxeBuilder({ page }).withTags([
                    'wcag2a',
                    'wcag2aa',
                    'wcag21a',
                    'wcag21aa',
                    'wcag22a',
                    'wcag22aa'
                ]);

            await use(makeAxeBuilder);
        },
        { title: 'Set up Axe for accessibility testing', box: true }
    ]
});
