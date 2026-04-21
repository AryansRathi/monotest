import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Users Management', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.usersTab.open();
        });

        // ─── Happy-path CRUD ────────────────────────────────────────────────────────

        test('should edit user fields and persist changes in the table', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            const updatedFirstName = 'Updated';
            const updatedLastName = 'Name';
            await ix.studio.adminPage.usersTab.editUserFields(testUser.username, {
                firstName: updatedFirstName,
                lastName: updatedLastName
            });
            await ix.studio.adminPage.usersTab.searchForUser(testUser.username);

            await expect(ix.studio.adminPage.usersTab.userRow(testUser.username)).toContainText(
                `${updatedFirstName} ${updatedLastName}`
            );
        });

        test('should delete user via UI', async ({ ix, factories }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.searchForUser(testUser.username);
            await expect(ix.studio.adminPage.usersTab.userRow(testUser.username)).toBeVisible();

            await ix.studio.adminPage.usersTab.deleteUser(testUser.username);

            await expect(ix.studio.adminPage.usersTab.userRow(testUser.username)).not.toBeVisible();
        });

        // ─── Search ─────────────────────────────────────────────────────────────────

        test('should search and find user by username', async ({ ix, factories }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.searchInput.fill(testUser.username);

            await expect(ix.studio.adminPage.usersTab.userRow(testUser.username)).toBeVisible();
        });

        test('should hide non-matching users when searching', async ({ ix, factories }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.searchInput.fill('zzz-no-match-xyz-9999');

            await expect(ix.studio.adminPage.usersTab.userRow(testUser.username)).not.toBeVisible();
        });

        // ─── Password change ─────────────────────────────────────────────────────────

        test('should change password and allow login with new password', async ({
            ix,
            factories,
            asUser
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            const newPassword = 'NewPass1234!Ab';
            await ix.studio.adminPage.usersTab.changeUserPassword(testUser.username, newPassword);

            await asUser(testUser.username, newPassword, async () => {
                await ix.studio.userMenu.open();
                await expect(ix.studio.userMenu.usernameLabel).toHaveText(testUser.username);
            });
        });

        // ─── User details drawer ─────────────────────────────────────────────────────

        test('should open user details drawer', async ({ ix, factories }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.openUserDetails(testUser.username);

            await expect(ix.studio.adminPage.usersTab.userDetailsDrawer.root).toBeVisible();
        });

        // ─── Group / role assignment ──────────────────────────────────────────────────

        test('should assign group to user and persist in details drawer', async ({
            ix,
            factories
        }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.open();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.usersTab.open();
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.addGroupToUser(testUser.username, testGroup.name);

            await ix.studio.adminPage.usersTab.openUserDetails(testUser.username);
            await expect(
                ix.studio.adminPage.usersTab.userDetailsDrawer.groupRow(testGroup.name)
            ).toBeVisible();
        });

        test('should assign role to user during creation and persist in details drawer', async ({
            ix,
            factories
        }) => {
            const roleName = 'data-builder';
            const testUser = factories.admin.createUser({ roles: [roleName] });
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.openUserDetails(testUser.username);
            await expect(
                ix.studio.adminPage.usersTab.userDetailsDrawer.roleRow(roleName)
            ).toBeVisible();
        });

        test('should add role to existing user via edit and persist in details drawer', async ({
            ix,
            factories
        }) => {
            const roleName = 'data-builder';
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.addRoleToUser(testUser.username, roleName);

            await ix.studio.adminPage.usersTab.openUserDetails(testUser.username);
            await expect(
                ix.studio.adminPage.usersTab.userDetailsDrawer.roleRow(roleName)
            ).toBeVisible();
        });

        // ─── Cancel flows ────────────────────────────────────────────────────────────

        test('should not change user when edit modal is cancelled', async ({ ix, factories }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.searchForUser(testUser.username);
            await ix.studio.adminPage.usersTab.actionsButton(testUser.username).click();
            await ix.studio.adminPage.usersTab.actionsMenuEditItem.click();
            await ix.studio.adminPage.usersTab.editUserModal.firstNameInput.fill('ShouldNotSave');
            await ix.studio.adminPage.usersTab.editUserModal.cancelButton.click();

            // Original name must still appear in the row
            await expect(ix.studio.adminPage.usersTab.userRow(testUser.username)).toContainText(
                testUser.firstName
            );
        });

        test('should not delete user when delete confirmation is cancelled', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.searchForUser(testUser.username);
            await ix.studio.adminPage.usersTab.actionsButton(testUser.username).click();
            await ix.studio.adminPage.usersTab.actionsMenuDeleteItem.click();
            await ix.studio.adminPage.usersTab.deleteConfirmModal.cancelButton.click();

            await expect(ix.studio.adminPage.usersTab.userRow(testUser.username)).toBeVisible();
        });

        test('should allow login with old password when password change is cancelled', async ({
            ix,
            factories,
            asUser
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.searchForUser(testUser.username);
            await ix.studio.adminPage.usersTab.actionsButton(testUser.username).click();
            await ix.studio.adminPage.usersTab.actionsMenuChangePasswordItem.click();
            await ix.studio.adminPage.usersTab.changePasswordModal.passwordInput.fill(
                'NewPass9999!Xx'
            );
            await ix.studio.adminPage.usersTab.changePasswordModal.repeatPasswordInput.fill(
                'NewPass9999!Xx'
            );
            await ix.studio.adminPage.usersTab.changePasswordModal.cancelButton.click();

            await asUser(testUser.username, testUser.password, async () => {
                await ix.studio.userMenu.open();
                await expect(ix.studio.userMenu.usernameLabel).toHaveText(testUser.username);
            });
        });

        // ─── Validation ──────────────────────────────────────────────────────────────

        test('should show duplicate username dialog when username already exists', async ({
            ix,
            factories
        }) => {
            const existingUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(existingUser);
            // Wait for the user to appear in the table — this ensures onSubmitUser's async
            // saveUser().then() callback has completed and won't close a subsequently-opened modal
            await ix.studio.adminPage.usersTab.searchForUser(existingUser.username);
            await expect(ix.studio.adminPage.usersTab.userRow(existingUser.username)).toBeVisible();

            // Try to create a second user with the same username
            const duplicateUser = factories.admin.createUser({ username: existingUser.username });
            await ix.studio.adminPage.usersTab.createUserButton.click();
            await ix.studio.adminPage.usersTab.createUserModal.usernameInput.fill(
                duplicateUser.username
            );
            await ix.studio.adminPage.usersTab.createUserModal.passwordInput.fill(
                duplicateUser.password
            );
            await ix.studio.adminPage.usersTab.createUserModal.repeatPasswordInput.fill(
                duplicateUser.password
            );
            await ix.studio.adminPage.usersTab.createUserModal.submitButton.click();

            await expect(ix.studio.adminPage.usersTab.duplicateUsernameDialog).toBeVisible();

            await ix.studio.adminPage.usersTab.duplicateUsernameCloseButton.click();
            await ix.studio.adminPage.usersTab.createUserModal.cancelButton.click();
        });

        test('should show duplicate email dialog when email already exists', async ({
            ix,
            factories
        }) => {
            const existingUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(existingUser);
            // Wait for the user to appear in the table — this ensures onSubmitUser's async
            // saveUser().then() callback has completed and won't close a subsequently-opened modal
            await ix.studio.adminPage.usersTab.searchForUser(existingUser.username);
            await expect(ix.studio.adminPage.usersTab.userRow(existingUser.username)).toBeVisible();

            // Try to create a second user with the same email but a different username
            const duplicateUser = factories.admin.createUser({ email: existingUser.email });
            await ix.studio.adminPage.usersTab.createUserButton.click();
            await ix.studio.adminPage.usersTab.createUserModal.usernameInput.fill(
                duplicateUser.username
            );
            await ix.studio.adminPage.usersTab.createUserModal.emailInput.fill(duplicateUser.email);
            await ix.studio.adminPage.usersTab.createUserModal.passwordInput.fill(
                duplicateUser.password
            );
            await ix.studio.adminPage.usersTab.createUserModal.repeatPasswordInput.fill(
                duplicateUser.password
            );
            await ix.studio.adminPage.usersTab.createUserModal.submitButton.click();

            await expect(ix.studio.adminPage.usersTab.duplicateEmailDialog).toBeVisible();

            await ix.studio.adminPage.usersTab.duplicateEmailCloseButton.click();
            await ix.studio.adminPage.usersTab.createUserModal.cancelButton.click();
        });

        test('should keep submit disabled when password does not meet requirements', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUserButton.click();

            await ix.studio.adminPage.usersTab.createUserModal.usernameInput.fill(
                testUser.username
            );
            await ix.studio.adminPage.usersTab.createUserModal.firstNameInput.fill(
                testUser.firstName
            );
            await ix.studio.adminPage.usersTab.createUserModal.lastNameInput.fill(
                testUser.lastName
            );
            await ix.studio.adminPage.usersTab.createUserModal.emailInput.fill(testUser.email);

            // "weak" fails: too short, no uppercase, no number, no symbol
            await ix.studio.adminPage.usersTab.createUserModal.passwordInput.fill('weak');
            await ix.studio.adminPage.usersTab.createUserModal.repeatPasswordInput.fill('weak');

            await expect(ix.studio.adminPage.usersTab.createUserModal.submitButton).toBeDisabled();

            await ix.studio.adminPage.usersTab.createUserModal.cancelButton.click();
        });

        test('should keep submit disabled when email format is invalid', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUserButton.click();

            await ix.studio.adminPage.usersTab.createUserModal.usernameInput.fill(
                testUser.username
            );
            await ix.studio.adminPage.usersTab.createUserModal.emailInput.fill('not-a-valid-email');
            await ix.studio.adminPage.usersTab.createUserModal.passwordInput.fill(
                testUser.password
            );
            await ix.studio.adminPage.usersTab.createUserModal.repeatPasswordInput.fill(
                testUser.password
            );

            await expect(ix.studio.adminPage.usersTab.createUserModal.submitButton).toBeDisabled();

            await ix.studio.adminPage.usersTab.createUserModal.cancelButton.click();
        });

        // ─── User status ─────────────────────────────────────────────────────────────

        test('should create user with disabled status and show disabled chip in table', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser({ status: 'INACTIVE' });
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.searchForUser(testUser.username);
            await expect(ix.studio.adminPage.usersTab.statusChip(testUser.username)).toContainText(
                'Disabled'
            );
        });

        test('should edit user status to disabled and reflect in table', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.usersTab.searchForUser(testUser.username);
            await ix.studio.adminPage.usersTab.actionsButton(testUser.username).click();
            await ix.studio.adminPage.usersTab.actionsMenuEditItem.click();
            await ix.studio.adminPage.usersTab.editUserModal.statusInactiveButton.click();
            // Vuetify uses v-btn--active (not aria-pressed) to mark the selected button.
            // Waiting for this class guarantees the Vue watcher has run and
            // status.value === 'INACTIVE' before form submission.
            await expect(
                ix.studio.adminPage.usersTab.editUserModal.statusInactiveButton
            ).toHaveClass(/v-btn--active/);
            await ix.studio.adminPage.usersTab.editUserModal.submitButton.click();
            await ix.studio.adminPage.usersTab.editUserModal.root.waitFor({ state: 'hidden' });

            await ix.studio.adminPage.usersTab.searchForUser(testUser.username);
            await expect(ix.studio.adminPage.usersTab.statusChip(testUser.username)).toContainText(
                'Disabled'
            );
        });

        // ─── Permissions ─────────────────────────────────────────────────────────────

        test('should hide admin nav button for users without admin access', async ({
            ix,
            factories,
            asUser
        }) => {
            const regularUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.createUser(regularUser);
            await ix.studio.adminPage.usersTab.searchForUser(regularUser.username);
            await expect(ix.studio.adminPage.usersTab.userRow(regularUser.username)).toBeVisible();

            await asUser(regularUser.username, regularUser.password, async () => {
                await expect(ix.studio.navRail.adminButton).not.toBeVisible();
            });
        });
    });
});
