import * as dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import * as path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local'), override: true });

if (!process.env.BASE_URL) {
    throw new Error('BASE_URL environment variable is required but not provided.');
}

/**
 * Shared test configuration values.
 * Import this in playwright.config.ts, fixtures, test files, and page objects
 * to access the test configuration values and avoid duplication.
 */
export const testConfig = {
    baseURL: process.env.BASE_URL,
    timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 240000,
    expectTimeout: process.env.EXPECT_TIMEOUT ? parseInt(process.env.EXPECT_TIMEOUT) : 10_000,
    actionTimeout: process.env.ACTION_TIMEOUT ? parseInt(process.env.ACTION_TIMEOUT) : 30_000,
    navigationTimeout: process.env.NAVIGATION_TIMEOUT
        ? parseInt(process.env.NAVIGATION_TIMEOUT)
        : 30_000,
    workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 1,
    locale: process.env.LOCALE || 'en-US',
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO) : 0,
    retries: process.env.CI ? 2 : process.env.RETRIES ? Number.parseInt(process.env.RETRIES) : 0,
    selectedBrowser: process.env.BROWSER,
    runTeardown: !!process.env.TEARDOWN,
    username: process.env.USERNAME || 'admin',
    password: process.env.PASSWORD || 'admin'
};
