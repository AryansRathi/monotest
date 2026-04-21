import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Roles Management', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.rolesAndPermissionsTab.open();
        });

        // ─── Scope toggle filtering ───────────────────────────────────────────────

        test('should show only Data Builder roles when Data builder scope is toggled', async ({
            ix
        }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.scopeToggleButton('Data builder').click();

            await expect(tab.roleRow('data-builder')).toBeVisible();
            await expect(tab.roleRow('app-builder')).not.toBeVisible();
            await expect(tab.roleRow('process-builder')).not.toBeVisible();
        });

        test('should show only App Builder roles when App builder scope is toggled', async ({
            ix
        }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.scopeToggleButton('App builder').click();

            await expect(tab.roleRow('app-builder')).toBeVisible();
            await expect(tab.roleRow('data-builder')).not.toBeVisible();
            await expect(tab.roleRow('process-builder')).not.toBeVisible();
        });

        test('should preserve first-scope results and hide non-selected scopes when a second toggle is activated', async ({
            ix
        }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            // Activate Data builder scope first.
            // Use `app-builder not.toBeVisible()` as the synchronisation point: data-builder was
            // already visible before the filter, so its toBeVisible() passes immediately without
            // confirming the API has reloaded. Waiting for app-builder to disappear is the
            // reliable signal that the filtered result set has arrived.
            await tab.scopeToggleButton('Data builder').click();
            await expect(tab.roleRow('app-builder')).not.toBeVisible();
            await expect(tab.roleRow('process-builder')).not.toBeVisible();

            // Activate App builder scope as well.
            // Data builder results must still be present and process-builder must remain hidden.
            await tab.scopeToggleButton('App builder').click();
            await expect(tab.roleRow('data-builder')).toBeVisible();
            await expect(tab.roleRow('process-builder')).not.toBeVisible();
        });

        test('should show all roles again after deselecting the active scope toggle', async ({
            ix
        }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            // Activate then deactivate the Data builder scope
            await tab.scopeToggleButton('Data builder').click();
            await expect(tab.roleRow('app-builder')).not.toBeVisible();

            await tab.scopeToggleButton('Data builder').click();
            await expect(tab.roleRow('data-builder')).toBeVisible();
            await expect(tab.roleRow('app-builder')).toBeVisible();
        });

        // ─── Search ───────────────────────────────────────────────────────────────

        test('should find a role by name using search', async ({ ix }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('data-builder');

            await expect(tab.roleRow('data-builder')).toBeVisible();
        });

        test('should hide non-matching roles when searching', async ({ ix }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('data-builder');

            await expect(tab.roleRow('app-builder')).not.toBeVisible();
        });

        test('should show no rows when search term does not match any role', async ({ ix }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('zzz-no-match-xyz-9999');

            await expect(tab.rolesTable).toContainText('No results found');
        });

        // ─── Details drawer ───────────────────────────────────────────────────────

        test('should show complete role information when opened', async ({ ix }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.openRoleDetails('data-builder');

            await expect(tab.roleDetailsDrawer.root).toBeVisible();

            await expect(tab.roleDetailsDrawer.permissionsTable).toBeVisible();

            await expect(tab.roleDetailsDrawer.usersTable).toBeVisible();
        });

        test('should update the details drawer when a different role is selected', async ({
            ix
        }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            // Open details for first role
            await tab.openRoleDetails('app-builder');
            await expect(tab.roleDetailsDrawer.root).toBeVisible();

            // Close drawer first — the Vuetify scrim intercepts pointer events over the table
            // while the drawer is open, which would block clicking another row's shield icon.
            await tab.roleDetailsDrawer.close();

            // Open details for a second role — drawer re-opens with refreshed content
            await tab.openRoleDetails('data-builder');
            await expect(tab.roleDetailsDrawer.root).toBeVisible();
            await expect(tab.roleDetailsDrawer.permissionsTable).toBeVisible();
        });

        // ─── Readonly role restrictions ────────────────────────────────────────────

        test('should show a readonly chip for system (readonly) roles', async ({ ix }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('admin');

            await expect(tab.readonlyChip('admin')).toBeVisible();
        });

        test('should show "View" label in the actions menu for a readonly role', async ({ ix }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('data-builder');
            await tab.roleMenuButton('data-builder').click();

            await expect(tab.roleMenuEditItem).toContainText('View');
        });

        test('should disable the Delete action for a readonly role', async ({ ix }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('data-builder');
            await tab.roleMenuButton('data-builder').click();

            // Vuetify renders disabled list items via CSS class, not the HTML disabled attribute,
            // so toBeDisabled() does not work here — check for the Vuetify disabled class instead.
            await expect(tab.roleMenuDeleteItem).toHaveClass(/v-list-item--disabled/);
        });

        test('should open the view modal in read-only mode for a readonly role', async ({ ix }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('data-builder');
            await tab.roleMenuButton('data-builder').click();
            await tab.roleMenuEditItem.click();

            await expect(tab.viewEditRoleModal.root).toBeVisible();
            await expect(tab.viewEditRoleModal.submitButton).toBeDisabled();
        });

        test('should display the role name in the view modal for a readonly role', async ({
            ix
        }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('data-builder');
            await tab.roleMenuButton('data-builder').click();
            await tab.roleMenuEditItem.click();

            await expect(tab.viewEditRoleModal.nameInput).toHaveValue('data-builder');
        });

        test('should close the view modal without changes when cancel is clicked', async ({
            ix
        }) => {
            const tab = ix.studio.adminPage.rolesAndPermissionsTab;

            await tab.searchForRole('data-builder');
            await tab.roleMenuButton('data-builder').click();
            await tab.roleMenuEditItem.click();
            await tab.viewEditRoleModal.cancelButton.click();

            await expect(tab.viewEditRoleModal.root).not.toBeVisible();
            await expect(tab.roleRow('data-builder')).toBeVisible();
        });

        // ─── Create button (hidden) ────────────────────────────────────────────────

        test(
            'should not render the Create button',
            {
                annotation: {
                    type: 'info',
                    description:
                        'The Create button is intentionally hidden in the current UI (v-if="false"), kept for future use.'
                }
            },
            async ({ ix }) => {
                const tab = ix.studio.adminPage.rolesAndPermissionsTab;

                await expect(tab.createRoleButton).not.toBeVisible();
            }
        );
    });
});
