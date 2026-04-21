import { expect, test } from '@fixtures/base';

test.describe('Admin', () => {
    test.describe('Certificates', () => {
        test.beforeEach(async ({ ix }) => {
            await ix.studio.navRail.adminButton.click();
            await ix.studio.adminPage.certificatesTab.open();
        });

        test.describe('Import', () => {
            test('should import a certificate and display it with ACTIVE status', async ({
                ix,
                factories
            }) => {
                const cert = factories.admin.createCertificate();

                await ix.studio.adminPage.certificatesTab.importCertificate(cert);
                await ix.studio.adminPage.certificatesTab.searchInput.fill(cert.name);

                await expect(
                    ix.studio.adminPage.certificatesTab.certificateRow(cert.name)
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.certificatesTab.certificateStatusChip(cert.name)
                ).toContainText('Active');
            });
        });

        test.describe('Deletion', () => {
            test('should delete a certificate', async ({ ix, factories }) => {
                const cert = factories.admin.createCertificate();

                await ix.studio.adminPage.certificatesTab.importCertificate(cert);
                await ix.studio.adminPage.certificatesTab.searchInput.fill(cert.name);
                await expect(
                    ix.studio.adminPage.certificatesTab.certificateRow(cert.name)
                ).toBeVisible();

                await ix.studio.adminPage.certificatesTab.deleteCertificate(cert.name);

                await expect(
                    ix.studio.adminPage.certificatesTab.certificateRow(cert.name)
                ).not.toBeVisible();
            });
        });

        test.describe('Enable/Disable', () => {
            test('should disable and re-enable a certificate', async ({ ix, factories }) => {
                const cert = factories.admin.createCertificate();

                await ix.studio.adminPage.certificatesTab.importCertificate(cert);
                await ix.studio.adminPage.certificatesTab.searchInput.fill(cert.name);
                await expect(
                    ix.studio.adminPage.certificatesTab.certificateStatusChip(cert.name)
                ).toContainText('Active');

                await ix.studio.adminPage.certificatesTab.disableCertificate(cert.name);
                await expect(
                    ix.studio.adminPage.certificatesTab.certificateStatusChip(cert.name)
                ).toContainText('Disabled');

                await ix.studio.adminPage.certificatesTab.enableCertificate(cert.name);
                await expect(
                    ix.studio.adminPage.certificatesTab.certificateStatusChip(cert.name)
                ).toContainText('Active');
            });
        });

        test.describe('Details', () => {
            test('should open and close the details drawer for a certificate', async ({
                ix,
                factories
            }) => {
                const cert = factories.admin.createCertificate();

                await ix.studio.adminPage.certificatesTab.importCertificate(cert);
                await ix.studio.adminPage.certificatesTab.searchInput.fill(cert.name);
                await ix.studio.adminPage.certificatesTab.openDetails(cert.name);

                await expect(ix.studio.adminPage.certificatesTab.detailsDrawer).toBeVisible();
                await expect(ix.studio.adminPage.certificatesTab.detailsDrawer).toContainText(
                    cert.name
                );

                await ix.studio.adminPage.certificatesTab.detailsCloseButton.click();
                await expect(ix.studio.adminPage.certificatesTab.detailsDrawer).not.toHaveClass(
                    /v-navigation-drawer--active/
                );
            });

            test('should show DISABLED status in details drawer after disabling', async ({
                ix,
                factories
            }) => {
                const cert = factories.admin.createCertificate();

                await ix.studio.adminPage.certificatesTab.importCertificate(cert);
                await ix.studio.adminPage.certificatesTab.searchInput.fill(cert.name);
                await ix.studio.adminPage.certificatesTab.disableCertificate(cert.name);
                await ix.studio.adminPage.certificatesTab.openDetails(cert.name);

                await expect(ix.studio.adminPage.certificatesTab.detailsStatusChip).toContainText(
                    'Disabled'
                );
            });
        });

        test.describe('Search', () => {
            test('should filter certificates by search term', async ({ ix, factories }) => {
                const cert1 = factories.admin.createCertificate();
                const cert2 = factories.admin.createCertificate();

                await ix.studio.adminPage.certificatesTab.importCertificate(cert1);
                await ix.studio.adminPage.certificatesTab.importCertificate(cert2);

                await ix.studio.adminPage.certificatesTab.searchInput.fill(cert1.name);

                await expect(
                    ix.studio.adminPage.certificatesTab.certificateRow(cert1.name)
                ).toBeVisible();
                await expect(
                    ix.studio.adminPage.certificatesTab.certificateRow(cert2.name)
                ).not.toBeVisible();
            });
        });

        test.describe('Import Modal', () => {
            test('should auto-generate alias from name', async ({ ix, factories }) => {
                const cert = factories.admin.createCertificate();

                await ix.studio.adminPage.certificatesTab.importButton.click();
                await ix.studio.adminPage.certificatesTab.importModal.nameInput.fill(cert.name);
                await ix.studio.adminPage.certificatesTab.importModal.nameInput.blur();

                await expect(
                    ix.studio.adminPage.certificatesTab.importModal.aliasInput
                ).not.toHaveValue('');
            });

            test('should cancel import without creating a certificate', async ({
                ix,
                factories
            }) => {
                const cert = factories.admin.createCertificate();

                await ix.studio.adminPage.certificatesTab.importButton.click();
                await ix.studio.adminPage.certificatesTab.importModal.nameInput.fill(cert.name);
                await ix.studio.adminPage.certificatesTab.importModal.cancelButton.click();

                await expect(
                    ix.studio.adminPage.certificatesTab.certificateRow(cert.name)
                ).not.toBeVisible();
            });
        });
    });
});
