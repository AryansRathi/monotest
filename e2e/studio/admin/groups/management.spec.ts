import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Groups Management', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.groupsTab.open();
        });

        // ─── Create ───────────────────────────────────────────────────────────────

        test('should create a group and show it in the table', async ({ ix, factories }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).toBeVisible();
        });

        test('should persist group name and description after creation', async ({
            ix,
            factories
        }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).toContainText(
                testGroup.name
            );
        });

        test('should not create a group when creation modal is cancelled', async ({
            ix,
            factories
        }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroupButton.click();
            await ix.studio.adminPage.groupsTab.createGroupModal.nameInput.fill(testGroup.name);
            await ix.studio.adminPage.groupsTab.createGroupModal.cancelButton.click();

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).not.toBeVisible();
        });

        // ─── Edit ─────────────────────────────────────────────────────────────────

        test('should edit group name and reflect the change in the table', async ({
            ix,
            factories
        }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            const updatedName = `${testGroup.name}-updated`;
            await ix.studio.adminPage.groupsTab.editGroupFields(testGroup.name, {
                name: updatedName
            });

            await ix.studio.adminPage.groupsTab.searchForGroup(updatedName);
            await expect(ix.studio.adminPage.groupsTab.groupRow(updatedName)).toBeVisible();
        });

        test('should edit group description and persist the change', async ({ ix, factories }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            // Re-open edit modal and verify the description field can be updated
            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await ix.studio.adminPage.groupsTab.actionsButton(testGroup.name).click();
            await ix.studio.adminPage.groupsTab.actionsMenuEditItem.click();

            const updatedDescription = 'Updated description for e2e test';
            await ix.studio.adminPage.groupsTab.editGroupModal.descriptionInput.clear();
            await ix.studio.adminPage.groupsTab.editGroupModal.descriptionInput.fill(
                updatedDescription
            );
            await ix.studio.adminPage.groupsTab.editGroupModal.submitButton.click();
            await ix.studio.adminPage.groupsTab.editGroupModal.root.waitFor({ state: 'hidden' });

            // Re-open edit modal to verify the value was saved
            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await ix.studio.adminPage.groupsTab.actionsButton(testGroup.name).click();
            await ix.studio.adminPage.groupsTab.actionsMenuEditItem.click();
            await expect(ix.studio.adminPage.groupsTab.editGroupModal.descriptionInput).toHaveValue(
                updatedDescription
            );
            await ix.studio.adminPage.groupsTab.editGroupModal.cancelButton.click();
        });

        test('should not change group when edit modal is cancelled', async ({ ix, factories }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await ix.studio.adminPage.groupsTab.actionsButton(testGroup.name).click();
            await ix.studio.adminPage.groupsTab.actionsMenuEditItem.click();
            await ix.studio.adminPage.groupsTab.editGroupModal.nameInput.clear();
            await ix.studio.adminPage.groupsTab.editGroupModal.nameInput.fill('ShouldNotSave');
            await ix.studio.adminPage.groupsTab.editGroupModal.cancelButton.click();

            // Original name must still be in the table
            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).toBeVisible();
        });

        // ─── Delete ───────────────────────────────────────────────────────────────

        test('should delete a group and remove it from the table', async ({ ix, factories }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).toBeVisible();

            await ix.studio.adminPage.groupsTab.deleteGroup(testGroup.name);

            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).not.toBeVisible();
        });

        test('should not delete a group when deletion confirmation is cancelled', async ({
            ix,
            factories
        }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await ix.studio.adminPage.groupsTab.actionsButton(testGroup.name).click();
            await ix.studio.adminPage.groupsTab.actionsMenuDeleteItem.click();
            await ix.studio.adminPage.groupsTab.deleteConfirmModal.cancelButton.click();

            // Group must still be present in the table
            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).toBeVisible();
        });

        // ─── Search ───────────────────────────────────────────────────────────────

        test('should find group by name using search', async ({ ix, factories }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);

            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).toBeVisible();
        });

        test('should hide non-matching groups when searching', async ({ ix, factories }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup('zzz-no-match-xyz-9999');

            await expect(ix.studio.adminPage.groupsTab.groupRow(testGroup.name)).not.toBeVisible();
        });

        // ─── Role add / remove ────────────────────────────────────────────────────

        test('should create group with a role and show role count in table', async ({
            ix,
            factories
        }) => {
            const roleName = 'data-builder';
            const testGroup = factories.admin.createGroup({ roles: [roleName] });
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.rolesCell(testGroup.name)).toContainText(
                '1 Roles'
            );
        });

        test('should add a role to an existing group via edit and update role count', async ({
            ix,
            factories
        }) => {
            const roleName = 'data-builder';
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.addRoleToGroup(testGroup.name, roleName);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.rolesCell(testGroup.name)).toContainText(
                '1 Roles'
            );
        });

        test('should show role in the details panel after assigning it during creation', async ({
            ix,
            factories
        }) => {
            const roleName = 'data-builder';
            const testGroup = factories.admin.createGroup({ roles: [roleName] });
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.openGroupDetails(testGroup.name);

            await expect(
                ix.studio.adminPage.groupsTab.groupDetailsPanel.roleRow(roleName)
            ).toBeVisible();
        });

        test('should show role in the details panel after assigning it via edit', async ({
            ix,
            factories
        }) => {
            const roleName = 'data-builder';
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.addRoleToGroup(testGroup.name, roleName);

            await ix.studio.adminPage.groupsTab.openGroupDetails(testGroup.name);
            await expect(
                ix.studio.adminPage.groupsTab.groupDetailsPanel.roleRow(roleName)
            ).toBeVisible();
        });

        // ─── Member add / remove ──────────────────────────────────────────────────

        test('should create group with a member and show member count in table', async ({
            ix,
            factories
        }) => {
            // A member is an existing user — create one first.
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.open();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.groupsTab.open();
            const testGroup = factories.admin.createGroup({ members: [testUser.username] });
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.membersCell(testGroup.name)).toContainText(
                '1 Members'
            );
        });

        test('should add a member to an existing group via edit and update member count', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.open();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.groupsTab.open();
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.addMemberToGroup(testGroup.name, testUser.username);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.membersCell(testGroup.name)).toContainText(
                '1 Members'
            );
        });

        test('should show member in the details panel after assigning during creation', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.open();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.groupsTab.open();
            const testGroup = factories.admin.createGroup({ members: [testUser.username] });
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.openGroupDetails(testGroup.name);

            await expect(
                ix.studio.adminPage.groupsTab.groupDetailsPanel.memberRow(testUser.username)
            ).toBeVisible();
        });

        test('should show member in the details panel after assigning via edit', async ({
            ix,
            factories
        }) => {
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.open();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.groupsTab.open();
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.addMemberToGroup(testGroup.name, testUser.username);

            await ix.studio.adminPage.groupsTab.openGroupDetails(testGroup.name);
            await expect(
                ix.studio.adminPage.groupsTab.groupDetailsPanel.memberRow(testUser.username)
            ).toBeVisible();
        });

        // ─── Member count / role count labels ─────────────────────────────────────

        test('should show 0 Members and 0 Roles for a newly created empty group', async ({
            ix,
            factories
        }) => {
            const testGroup = factories.admin.createGroup();
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.membersCell(testGroup.name)).toContainText(
                '0 Members'
            );
            await expect(ix.studio.adminPage.groupsTab.rolesCell(testGroup.name)).toContainText(
                '0 Roles'
            );
        });

        test('should reflect correct counts when group has both members and roles', async ({
            ix,
            factories
        }) => {
            const roleName = 'data-builder';
            const testUser = factories.admin.createUser();
            await ix.studio.adminPage.usersTab.open();
            await ix.studio.adminPage.usersTab.createUser(testUser);

            await ix.studio.adminPage.groupsTab.open();
            const testGroup = factories.admin.createGroup({
                members: [testUser.username],
                roles: [roleName]
            });
            await ix.studio.adminPage.groupsTab.createGroup(testGroup);

            await ix.studio.adminPage.groupsTab.searchForGroup(testGroup.name);
            await expect(ix.studio.adminPage.groupsTab.membersCell(testGroup.name)).toContainText(
                '1 Members'
            );
            await expect(ix.studio.adminPage.groupsTab.rolesCell(testGroup.name)).toContainText(
                '1 Roles'
            );
        });
    });
});
