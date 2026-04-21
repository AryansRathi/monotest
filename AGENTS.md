# IX25 E2E Testing with Playwright

## Project structure

- `fixtures/` — Playwright fixtures merged in `fixtures/base.ts`. Always import `test` and `expect` from `@fixtures/base`, never from `@playwright/test`.
- `factories/` — Test data factories accessible via the `factories` fixture. Namespaces e.g.: `factories.admin.*`, `factories.dataBuilder.models.*` / `factories.dataBuilder.sources.*`, and `factories.primitives.*`. All factory methods are static and accept `Partial<T>` overrides.
- `pages/` — Page Object Models rooted in `pages/ix.ts`. The `ix` fixture is the top-level entry point, giving access to `ix.studio.*` and `ix.portal.*`.
- `e2e/` — Test spec files organized by product area (e.g., `e2e/studio/admin/users/`, `e2e/studio/data/overview/models/`).
- `utils/` — Reusable helper functions (e.g., `utils/playwright.ts`).

## Rules

### Imports and fixtures

- Always import `test` and `expect` from `@fixtures/base`.
- Use the `ix` fixture as the entry point for all page interactions: `ix.studio.adminPage.usersTab.open()`, `ix.portal.open()`.
- Use the `factories` fixture to generate random but unique test data: `factories.admin.createUser()`, `factories.dataBuilder.models.createErDataModel()`.
- Use the `asUser` fixture to temporarily switch to a different user session within a test, then automatically restore the admin session.

### Test structure

- Use descriptive and meaningful test names that clearly describe the expected behavior.
- Use nested `test.describe()` blocks to build a self-documenting hierarchy. The outermost `test.describe()` must name the product area (e.g., `'Data Builder'`, `'Admin'`, `'Home Page'`). Use inner `test.describe()` blocks to further group tests by sub-area or functionality (e.g., `'Data Models'`, `'CRUD'`, `'Search'`). Test results are parsed as JSON for continuous documentation, so descriptions and names must be clear and human-readable.
- Use `test.beforeEach` for setup to ensure a clean state for each test.
- Avoid `test.describe.serial` and order-dependent tests whenever possible. Each test should be independently runnable.
- Tests must be idempotent: they must pass every time when run multiple times in a row, in any order. Never rely on state left behind by previous runs or other tests. Always use factories to generate unique test data.
- Ensure tests run reliably in parallel without shared state conflicts.
- Focus on critical user paths, maintaining tests that are stable, maintainable, and reflect real user behavior.

### Locators and assertions

- All locators belong on page objects, never directly in test files. If a test needs a locator, add it to the appropriate page object first, then reference it from the test.
- Avoid using `page.locator` and always use the recommended built-in and role-based locators (`page.getByTestId`, `page.getByRole`, `page.getByLabel`, `page.getByText`, `page.getByTitle`, etc.) over complex selectors.
- Prefer using `page.getByTestId` whenever `data-testid` is defined on an element or container.
- Reuse Playwright locators by using attributes defined on page objects like in `pages/ix/studio/dataBuilder/overviewPage.ts`.
- Prefer web-first assertions (`toBeVisible`, `toHaveText`, etc.) whenever possible.
- Use `expect` matchers for assertions (`toEqual`, `toContain`, `toBeTruthy`, `toHaveLength`, etc.) and avoid `assert` statements.
- Avoid hardcoded timeouts or explicit waits and don't use `page.waitForTimeout(1000)`.
- Use `expect` with specific assertions like `.toHaveCount(2)`, `.toBeVisible()` or `.not.toBeAttached()` to wait for elements or states. But always take into consideration that Playwright always auto-waits for elements and performs actionability checks by itself.

### Page Object Models

- Organize page objects like pages, modals, sidebars or tabs into subfolders inside `pages/ix/` and keep their file and class names simple and clear.
- Each page object defines a `root` locator scoped to its parent that all child locators are based on.
- Compose child page objects (modals, drawers, tabs) as readonly properties on their parent.
- Locators that depend on runtime data (e.g., a table row for a specific user) are defined as function properties: `readonly userRow: (username: string) => Locator`.
- Chain page objects together and access them by traversing the hierarchy: `ix.studio.dataBuilder.overview.dataModelsTab.search("My Model")`.
- Class attributes _are_ things (locators, child page objects), while methods _do_ things (multi-step UI flows).
- Avoid methods that wrap only a single line of code (like filling an input or clicking a button). The only acceptable single-line methods are those where the name provides an obvious semantic benefit to the reader (e.g., `open()`, `logout()`).
- Avoid getter or setter methods for values visible on screen. Since tests create their own data through factories, assert directly against the factory-generated values instead of reading from the DOM.
- Keep tests DRY by extracting reusable multi-step UI flows into page object methods.

### Test data

- Do not hardcode test data. Always use factories.
- Customize factory output with the `overrides` parameter: `factories.admin.createUser({ status: 'INACTIVE' })`.
- Do not use static test data files when dynamic factory-generated data can be used instead.

### Code style

- Avoid commenting on the resulting code.
- Use the `playwright.config.ts` file and `test.config.ts` for global configuration and environment setup.
- Follow the guidance and best practices described on "<https://playwright.dev/docs/writing-tests>".
- If the user produced code which does not adhere to these rules, kindly offer to refactor the code according to these rules.
