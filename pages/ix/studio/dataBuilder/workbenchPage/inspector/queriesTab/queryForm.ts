import { Locator } from '@playwright/test';
import { QueriesTab } from '../queriesTab';

export class QueryForm {
    readonly parent: QueriesTab;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly technicalNameInput: Locator;

    readonly selectionSection: Locator;

    readonly dataEntitySelect: Locator;
    readonly dataEntitySelectItem: (entityName: string) => Locator;

    readonly attributeSelect: Locator;
    readonly attributeSelectItem: (attributeName: string) => Locator;
    readonly attributeSelectCloseButton: Locator;

    readonly openPreviewButton: Locator;
    readonly submitButton: Locator;
    readonly confirmSubmitButton: Locator;

    constructor(parent: QueriesTab) {
        this.parent = parent;
        this.root = parent.root;

        this.nameInput = this.root
            .getByTestId('DB-ErQueryEditorForm-NameInput-IxInput-root')
            .getByRole('textbox');
        this.technicalNameInput = this.root
            .getByTestId('DB-ErQueryEditorForm-TechnicalNameInput-IxInput-root')
            .getByRole('textbox');

        this.selectionSection = this.root.getByTestId(
            'DB-ErQueryEditorForm-SelectionExpansionPanel-IxExpansionPanel-root'
        );

        this.dataEntitySelect = this.selectionSection.getByTestId(
            'DB-QuerySelection-DataTable-IxSelect-root'
        );
        this.dataEntitySelectItem = (entityName: string) =>
            this.parent.parent.parent.page
                .locator(`[data-testid^="DB-QuerySelection-DataTable-IxSelect-item-"]`)
                .getByText(entityName);

        this.attributeSelect = this.selectionSection.getByTestId(
            'DB-QuerySelection-Attributes-IxCombobox-root'
        );
        this.attributeSelectItem = (attributeName: string) =>
            this.parent.parent.parent.page
                .locator('.v-overlay__content.ix-list')
                .getByRole('option')
                .getByText('.' + attributeName);
        this.attributeSelectCloseButton = this.attributeSelect.getByRole('button', {
            name: 'Close'
        });

        this.openPreviewButton = this.root
            .getByTestId('DB-ErQueryEditor-IxIconButton-OpenPreview-IxButton-root')
            .or(this.root.getByTestId('DB-ErQueryEditor-Button-OpenPreview-IxButton-root'));
        this.submitButton = this.root.getByTestId(
            'DB-ErQueryEditor-IxButton-SaveQueryButton-IxButton-root'
        );
        this.confirmSubmitButton = this.parent.parent.parent.page.getByTestId(
            'DB-ErQueryEditor-Modal-ConfirmSave-IxModal-submit-IxButton-root'
        );
    }

    public async submit() {
        await this.submitButton.click();
        await this.confirmSubmitButton.click();
    }

    public async selectDataEntity(entityName: string) {
        await this.dataEntitySelect.click();
        await this.dataEntitySelectItem(entityName).click();
    }

    public async selectAttributes(attributeNames: string[]) {
        if (attributeNames.length === 0) return;

        for (const attributeName of attributeNames) {
            await this.attributeSelect.click();
            await this.attributeSelectItem(attributeName).click();
        }
        // Close the attribute select dropdown
        await this.parent.parent.parent.page.keyboard.press('Escape');
    }
}
