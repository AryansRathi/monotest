import { factories } from '@factories/factories';
import { expect, test } from '@fixtures/base';

test.beforeEach('Open the Data Builder', async ({ ix }) => {
    await ix.studio.dataBuilder.overview.open();
});

test.describe('Data Builder', () => {
    test.describe('Data Models', () => {
        test.skip(
            'should move from draft to test to prod',
            {
                annotation: {
                    type: 'skip-reason',
                    description:
                        'This test does not follow best practices and needs to be rewritten.'
                }
            },
            async ({ ix }) => {
                test.slow();

                const testDataModel = factories.dataBuilder.models.createErDataModel();

                await ix.studio.dataBuilder.overview.dataModelsTab.createErDataModel(testDataModel);

                const normalizedTestDataModelName = testDataModel.technicalName.replace(/\s/g, '-');

                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);
                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.technicalName)
                    .open();

                const personsEntity = factories.dataBuilder.models.createDataModelEntity({
                    name: 'persons',
                    technicalName: 'persons',
                    description: 'Persons entity',
                    attributes: [
                        factories.dataBuilder.models.createDataEntityAttribute('varchar'),
                        factories.dataBuilder.models.createDataEntityAttribute('varchar'),
                        factories.dataBuilder.models.createDataEntityAttribute('varchar')
                    ]
                });
                personsEntity.attributes[0].name = 'name';
                personsEntity.attributes[0].technicalName = 'name';
                personsEntity.attributes[1].name = 'email';
                personsEntity.attributes[1].technicalName = 'email';
                personsEntity.attributes[2].name = 'phone';
                personsEntity.attributes[2].technicalName = 'phone';

                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab.createEntity(
                    personsEntity
                );
                await ix.studio.dataBuilder.workbench.canvas.toolbar.autoLayoutButton.click();

                await ix.studio.dataBuilder.workbench.canvas.syncToDatabaseButton.click();

                await expect(
                    ix.studio.dataBuilder.overview.page.getByText('Fully synced')
                ).toBeVisible();

                await ix.studio.dataBuilder.workbench.canvas.toolbar.saveModelButton.click();

                const testData = {
                    name: 'insert_draft',
                    email: 'test@draft.com',
                    phone: '98728370'
                };

                await ix.studio.dataBuilder.workbench.inspector.commandsTab.open();
                await ix.studio.dataBuilder.workbench.inspector.commandsTab.createCommand({
                    commandType: 'INSERT',
                    name: 'insert_draft',
                    technicalName: 'insert_draft',
                    dataEntityName: 'persons',
                    attributeNames: ['name', 'email', 'phone'],
                    defaultValues: testData
                });

                await ix.studio.dataBuilder.workbench.inspector.commandsTab
                    .commandCard(`${testDataModel.technicalName}_insert`)
                    .click();
                await ix.studio.dataBuilder.workbench.inspector.commandsTab.commandForm.openPreviewButton.click();
                await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();
                await ix.studio.dataBuilder.workbench.inspector.previewModal.closeButton.click();

                const queryTechnicalName = `${normalizedTestDataModelName}_test`;

                await ix.studio.dataBuilder.workbench.inspector.queriesTab.open();
                await ix.studio.dataBuilder.workbench.inspector.queriesTab.createQuery({
                    name: 'test',
                    technicalName: queryTechnicalName,
                    dataEntityName: 'persons',
                    attributeNames: ['name', 'email', 'phone']
                });

                await ix.studio.dataBuilder.workbench.inspector.queriesTab
                    .queryCard(queryTechnicalName)
                    .click();
                await ix.studio.dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
                await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();

                await expect(ix.studio.dataBuilder.overview.page.locator('tbody')).toContainText(
                    testData.name
                );
                await expect(ix.studio.dataBuilder.overview.page.locator('tbody')).toContainText(
                    testData.email
                );
                await expect(ix.studio.dataBuilder.overview.page.locator('tbody')).toContainText(
                    testData.phone
                );

                await ix.studio.dataBuilder.workbench.inspector.previewModal.closeButton.click();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
                await expect(
                    ix.studio.dataBuilder.page.getByRole('button', { name: '1.0.0 DRAFT' })
                ).toBeVisible();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.deployToNextStageButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTabButton.click();
                await expect(
                    ix.studio.dataBuilder.workbench.inspector.queriesTab.addQueryButton
                ).not.toBeVisible();

                await ix.studio.dataBuilder.workbench.inspector.commandsTabButton.click();
                await expect(
                    ix.studio.dataBuilder.workbench.inspector.commandsTab.addCommandButton
                ).not.toBeVisible();

                await ix.studio.dataBuilder.workbench.inspector.queriesTabButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTab.search('test');

                await ix.studio.dataBuilder.workbench.inspector.queriesTab
                    .queryCard(queryTechnicalName)
                    .click();
                await ix.studio.dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
                await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();

                await expect(
                    ix.studio.dataBuilder.page.getByTestId(
                        'DB-PreviewView-IxSplitPane-IxSplitPane-root'
                    )
                ).toContainText('Statement executed successfully, but the result is empty.');

                await ix.studio.dataBuilder.workbench.inspector.previewModal.closeButton.click();

                await ix.studio.dataBuilder.workbench.inspector.commandsTabButton.click();

                await ix.studio.dataBuilder.workbench.inspector.commandsTab.search('insert');
                await ix.studio.dataBuilder.workbench.inspector.commandsTab
                    .commandCard(`${testDataModel.technicalName}_insert`)
                    .click();

                await ix.studio.dataBuilder.workbench.inspector.commandsTab.commandForm.openPreviewButton.click();

                await ix.studio.dataBuilder.page
                    .getByTestId(
                        'DB-ErInput-Parameters-IxExpansionPanel-IxExpansionPanel-actions-IxIconButton-arrow_down-IxIconButton-root'
                    )
                    .click();

                await ix.studio.dataBuilder.page
                    .getByTestId(
                        'DB-ErInput-Parameters-IxExpansionPanel-IxInput-name-text-value-IxInput-root'
                    )
                    .locator('input')
                    .fill('inser_test');

                await ix.studio.dataBuilder.page
                    .getByTestId(
                        'DB-ErInput-Parameters-IxExpansionPanel-IxInput-email-text-value-IxInput-root'
                    )
                    .locator('input')
                    .fill('test@test.com');

                await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();

                await ix.studio.dataBuilder.workbench.inspector.previewModal.closeButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTabButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTab.search('test');

                await ix.studio.dataBuilder.workbench.inspector.queriesTab
                    .queryCard(queryTechnicalName)
                    .click();
                await ix.studio.dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
                await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();

                await expect(ix.studio.dataBuilder.page.locator('tbody')).toContainText(
                    'inser_test'
                );
                await expect(ix.studio.dataBuilder.page.locator('tbody')).toContainText(
                    'test@test.com'
                );

                await ix.studio.dataBuilder.workbench.inspector.previewModal.closeButton.click();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
                await expect(
                    ix.studio.dataBuilder.page.getByRole('button', { name: '1.0.0 TEST' })
                ).toBeVisible();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.deployToNextStageButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTabButton.click();
                await expect(
                    ix.studio.dataBuilder.workbench.inspector.queriesTab.addQueryButton
                ).not.toBeVisible();

                await ix.studio.dataBuilder.workbench.inspector.commandsTabButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTabButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTab.search('test');

                await ix.studio.dataBuilder.workbench.inspector.queriesTab
                    .queryCard(queryTechnicalName)
                    .click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
                await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();

                await expect(
                    ix.studio.dataBuilder.page.getByTestId(
                        'DB-PreviewView-IxSplitPane-IxSplitPane-root'
                    )
                ).toContainText('Statement executed successfully, but the result is empty.');

                await ix.studio.dataBuilder.workbench.inspector.previewModal.closeButton.click();

                await ix.studio.dataBuilder.workbench.inspector.commandsTabButton.click();

                await ix.studio.dataBuilder.workbench.inspector.commandsTab.search('insert');
                await ix.studio.dataBuilder.workbench.inspector.commandsTab
                    .commandCard(`${testDataModel.technicalName}_insert`)
                    .click();

                await ix.studio.dataBuilder.workbench.inspector.commandsTab.commandForm.openPreviewButton.click();

                await ix.studio.dataBuilder.page
                    .getByTestId(
                        'DB-ErInput-Parameters-IxExpansionPanel-IxExpansionPanel-actions-IxIconButton-arrow_down-IxIconButton-root'
                    )
                    .click();

                await ix.studio.dataBuilder.page
                    .getByTestId(
                        'DB-ErInput-Parameters-IxExpansionPanel-IxInput-name-text-value-IxInput-root'
                    )
                    .locator('input')
                    .fill('inser_prod');

                await ix.studio.dataBuilder.page
                    .getByTestId(
                        'DB-ErInput-Parameters-IxExpansionPanel-IxInput-email-text-value-IxInput-root'
                    )
                    .locator('input')
                    .fill('prod@prod.com');

                await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();

                await ix.studio.dataBuilder.workbench.inspector.previewModal.closeButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTabButton.click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTab.search('test');

                await ix.studio.dataBuilder.workbench.inspector.queriesTab
                    .queryCard(`${testDataModel.technicalName}_${testDataModel.technicalName}`)
                    .click();

                await ix.studio.dataBuilder.workbench.inspector.queriesTab.queryForm.openPreviewButton.click();
                await ix.studio.dataBuilder.workbench.inspector.previewModal.executeButton.click();

                await expect(ix.studio.dataBuilder.page.locator('tbody')).toContainText(
                    'inser_prod'
                );
                await expect(ix.studio.dataBuilder.page.locator('tbody')).toContainText(
                    'prod@prod.com'
                );

                await ix.studio.dataBuilder.workbench.inspector.previewModal.closeButton.click();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
                await expect(
                    ix.studio.dataBuilder.page.getByRole('button', { name: '1.0.0 PROD' })
                ).toBeVisible();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();

                await ix.studio.dataBuilder.workbench.canvas.toolbar.createNewVersionButton.click();

                await ix.studio.dataBuilder.page.getByRole('textbox', { name: 'Summary' }).click();
                await ix.studio.dataBuilder.page
                    .getByRole('textbox', { name: 'Summary' })
                    .fill('new version');

                await ix.studio.dataBuilder.page
                    .getByRole('textbox', { name: 'Description' })
                    .click();
                await ix.studio.dataBuilder.page
                    .getByRole('textbox', { name: 'Description' })
                    .fill('this will be a new version model');

                await ix.studio.dataBuilder.page
                    .getByTestId('DB-VersionCreateModal-submit-IxButton-root')
                    .click();

                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);

                await expect(ix.studio.dataBuilder.page.getByText('2.0.0')).toBeVisible();

                await ix.studio.dataBuilder.overview.dataModelsTab
                    .dataModelCard(testDataModel.technicalName)
                    .open();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
                await expect(
                    ix.studio.dataBuilder.page.getByRole('button', { name: '2.0.0 DRAFT' })
                ).toBeVisible();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();

                await ix.studio.dataBuilder.workbench.explorer.dataExplorerTab
                    .dataEntityTreeItemLabel('persons')
                    .click();

                await ix.studio.dataBuilder.workbench.inspector.propertiesTabButton.click();

                await ix.studio.dataBuilder.workbench.inspector.propertiesTab
                    .attributePanel('name')
                    .deleteButton.click();
                await ix.studio.dataBuilder.workbench.inspector.propertiesTab
                    .attributePanel('name')
                    .deleteConfirmButton.click();

                await ix.studio.dataBuilder.workbench.canvas.toolbar.saveModelButton.click();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.deployToNextStageButton.click();

                await ix.studio.dataBuilder.page.waitForTimeout(2000);

                await ix.studio.dataBuilder.workbench.deploymentToolbar.deployToNextStageButton.click();

                await ix.studio.dataBuilder.page
                    .getByTestId('DB-WorkbenchView-ConfirmModal-IxModal-submit-IxButton-root')
                    .click();

                await ix.studio.dataBuilder.page
                    .getByTestId('DB-BreakingChangeModal-Continue-IxButton-root')
                    .click();

                await ix.studio.dataBuilder.workbench.exit();

                await ix.studio.dataBuilder.overview.dataModelsTab.search(testDataModel.name);

                await ix.studio.dataBuilder.overview.page
                    .getByTestId(
                        `DB-ModelsList-ListRow-${normalizedTestDataModelName}-Stage-PRODUCTION-IxChip-root`
                    )
                    .filter({ hasText: '2.0.0' })
                    .hover();

                await expect(
                    ix.studio.dataBuilder.overview.page
                        .locator('.v-overlay__content')
                        .filter({ hasText: 'new version' })
                ).toBeVisible();

                await ix.studio.dataBuilder.page
                    .getByTestId(
                        `DB-ModelsList-ListRow-${normalizedTestDataModelName}-Stage-PRODUCTION-IxChip-root`
                    )
                    .getByText('2.0.0')
                    .click();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
                await expect(
                    ix.studio.dataBuilder.page.getByRole('button', { name: '2.0.0 PROD' })
                ).toBeVisible();

                await ix.studio.dataBuilder.workbench.deploymentToolbar.showHideVersionListToggle.click();
            }
        );
    });
});
