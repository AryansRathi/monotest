import { test as baseTest, mergeTests } from '@playwright/test';
import { Factories, factories } from '@factories/factories';
import { IX } from '@pages/ix';
import { authFixtures } from './auth';
import { externalDatabasesFixtures } from './externalDatabases';
import { accessibilityFixtures } from './accessibility';

export * from '@playwright/test';

type TestScopedFixtures = {
    factories: Factories;
    ix: IX;
};

export const baseFixtures = baseTest.extend<TestScopedFixtures>({
    // Use the factories fixture to create random but unique test data.
    // This provides an interface to all factories for convenience.
    // oxlint-disable-next-line no-empty-pattern
    factories: [
        async ({}, use) => {
            await use(factories);
        },
        { title: 'Set up factories', box: true }
    ],

    // Top-level page object to access the IX25 pages.
    ix: [
        async ({ page }, use) => {
            await page.goto('/');
            await use(new IX(page));
        },
        { title: 'Open IX25' }
    ]
});

// Merge with fixtures from other files.
// This allows us to keep the fixtures organized in separate files.
export const test = mergeTests(
    baseFixtures,
    authFixtures,
    externalDatabasesFixtures,
    accessibilityFixtures
);
