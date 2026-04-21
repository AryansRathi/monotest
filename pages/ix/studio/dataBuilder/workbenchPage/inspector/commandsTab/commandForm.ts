import { Locator } from '@playwright/test';
import { CommandsTab } from '../commandsTab';

export type CommandCondition = {
    entityName: string;
    attributeName: string;
    operator:
        | 'Equal'
        | 'Not Equal'
        | 'Greater than'
        | 'Lower than'
        | 'Greater than or equal'
        | 'Lower than or equal'
        | 'Like'
        | 'Like (case sensitive)'
        | 'In list'
        | 'Not in list'
        | 'Is null'
        | 'Is not null';
    value: string;
    name: string;
};

export class CommandForm {
    readonly parent: CommandsTab;
    readonly root: Locator;

    readonly commandTypeSelect: Locator;
    readonly commandTypeSelectItem: (commandType: 'INSERT' | 'UPDATE' | 'DELETE') => Locator;
    readonly nameInput: Locator;
    readonly technicalNameInput: Locator;
    readonly descriptionInput: Locator;

    readonly valuesSection: Locator;
    readonly filteringSection: Locator;

    readonly dataEntitySelect: Locator;
    readonly dataEntitySelectItem: (entityName: string) => Locator;

    readonly attributeSelect: Locator;
    readonly attributeSelectItem: (attributeName: string) => Locator;
    readonly attributeSelectCloseButton: Locator;

    readonly defaultValueInput: (attributeTechnicalName: string) => Locator;

    readonly openPreviewButton: Locator;
    readonly submitButton: Locator;
    readonly confirmSubmitButton: Locator;

    readonly addConditionButton: Locator;
    readonly conditionExpansionToggle: Locator;

    readonly conditionEntitySelect: Locator;
    readonly conditionEntitySelectItem: (value: string) => Locator;
    readonly conditionAttributeSelect: Locator;
    readonly conditionAttributeSelectItem: (value: string) => Locator;
    readonly conditionOperatorSelect: Locator;
    readonly conditionOperatorSelectItem: (value: string) => Locator;
    readonly conditionValueInput: Locator;
    readonly conditionNameInput: Locator;

    constructor(parent: CommandsTab) {
        this.parent = parent;
        this.root = parent.root;

        this.commandTypeSelect = this.root.getByTestId(
            'DB-ErCommandEditor-IxSelect-CommandType-IxSelect-root'
        );
        this.commandTypeSelectItem = (commandType: 'INSERT' | 'UPDATE' | 'DELETE') =>
            this.parent.parent.parent.page.getByTestId(
                `DB-ErCommandEditor-IxSelect-CommandType-IxSelect-item-${commandType}`
            );
        this.nameInput = this.root
            .getByTestId('DB-ErCommandEditor-IxInput-Title-IxInput-root')
            .getByRole('textbox');
        this.technicalNameInput = this.root
            .getByTestId('DB-ErCommandEditor-IxInput-TechnicalName-IxInput-root')
            .getByRole('textbox');
        this.descriptionInput = this.root.getByTestId(
            'DB-ErCommandEditor-IxTextArea-Description-IxTextArea-root'
        );

        this.valuesSection = this.root.getByTestId(
            'DB-ErCommandEditor-SetValues-IxExpansionPanel-root'
        );
        this.filteringSection = this.root.getByTestId(
            'DB-ErCommandEditor-Filtering-IxExpansionPanel-root'
        );

        this.dataEntitySelect = this.root
            .getByTestId('DB-CmdSelection-EntitySelect-IxSelect-root')
            .locator('div[role="combobox"]');
        this.dataEntitySelectItem = (entityName: string) =>
            this.parent.parent.parent.page
                .locator('[data-testid^="DB-CmdSelection-EntitySelect-IxSelect-item-"]')
                .filter({ hasText: entityName });

        this.attributeSelect = this.root.getByTestId(
            'DB-CmdSelection-AttributeCombobox-IxCombobox-root'
        );
        this.attributeSelectItem = (attributeName: string) =>
            this.parent.parent.parent.page
                .locator('.v-overlay__content.ix-list')
                .getByRole('option')
                .getByText(attributeName);
        this.attributeSelectCloseButton = this.attributeSelect.getByRole('button', {
            name: 'Close'
        });

        this.defaultValueInput = (attributeTechnicalName: string) =>
            this.root.locator(
                `[data-testid^="DB-CmdRows-0-IxInput-${attributeTechnicalName}-"] input`
            );

        this.openPreviewButton = this.root
            .getByTestId('DB-ErCommandEditor-IxIconButton-OpenPreview-IxButton-root')
            .or(this.root.getByTestId('DB-ErCommandEditor-IxButton-OpenPreview-IxButton-root'));
        this.submitButton = this.root.getByTestId(
            'DB-ErCommandEditor-IxButton-SaveCommand-IxButton-root'
        );
        this.confirmSubmitButton = this.parent.parent.parent.page.getByTestId(
            'DB-ErCommandEditor-Modal-ConfirmSave-IxModal-submit-IxButton-root'
        );

        this.addConditionButton = this.filteringSection.getByTestId(
            'DB-CmdFiltering-ConditionsBuilder-IxConditionsbuilder-AddCondition-IxButton-root'
        );
        this.conditionExpansionToggle = this.filteringSection
            .getByTestId(
                /DB-CmdBasicCondition-BasicCondition-.+-IxConditionsGroup-expansionPanel-IxExpansionPanel-actions-IxIconButton-arrow_down-IxIconButton-root/
            )
            .first();

        this.conditionEntitySelect = this.filteringSection
            .locator(
                '[data-testid^="DB-CmdBasicCondition-EntitySelect-"][data-testid$="-IxSelect-root"]'
            )
            .locator('div[role="combobox"]');
        this.conditionEntitySelectItem = (value: string) =>
            this.parent.parent.parent.page
                .locator(
                    '[data-testid^="DB-CmdBasicCondition-EntitySelect-"][data-testid*="-IxSelect-item-"]'
                )
                .filter({ hasText: value });
        this.conditionAttributeSelect = this.filteringSection
            .locator(
                '[data-testid^="DB-CmdBasicCondition-AttributeSelect-"][data-testid$="-IxSelect-root"]'
            )
            .locator('div[role="combobox"]');
        this.conditionAttributeSelectItem = (value: string) =>
            this.parent.parent.parent.page
                .locator(
                    '[data-testid^="DB-CmdBasicCondition-AttributeSelect-"][data-testid*="-IxSelect-item-"]'
                )
                .filter({ hasText: value });
        this.conditionOperatorSelect = this.filteringSection
            .locator(
                '[data-testid^="DB-CmdBasicCondition-OperatorSelect-"][data-testid$="-IxSelect-root"]'
            )
            .first()
            .locator('div[role="combobox"]');
        this.conditionOperatorSelectItem = (value: string) =>
            this.parent.parent.parent.page
                .locator(
                    '[data-testid^="DB-CmdBasicCondition-OperatorSelect-"][data-testid*="-IxSelect-item-"]'
                )
                .getByText(value, { exact: true });
        this.conditionValueInput = this.filteringSection
            .locator(
                '[data-testid^="DB-CmdBasicCondition-ValueInput-"][data-testid$="-IxInput-root"] input'
            )
            .first();
        this.conditionNameInput = this.filteringSection
            .locator(
                '[data-testid^="DB-CmdBasicCondition-NameInput-"][data-testid$="-IxInput-root"] input'
            )
            .first();
    }

    public async submit() {
        await this.submitButton.click();
        await this.confirmSubmitButton.click();
    }

    public async selectCommandType(commandType: 'INSERT' | 'UPDATE' | 'DELETE') {
        await this.commandTypeSelect.click();
        await this.commandTypeSelectItem(commandType).click();
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

    public async addCondition(condition: CommandCondition) {
        await this.addConditionButton.click();
        await this.conditionExpansionToggle.click();
        await this.conditionEntitySelect.click();
        await this.conditionEntitySelectItem(condition.entityName).click();
        await this.conditionAttributeSelect.click();
        await this.conditionAttributeSelectItem(condition.attributeName).click();
        await this.conditionOperatorSelect.click();
        await this.conditionOperatorSelectItem(condition.operator).click();
        await this.conditionValueInput.fill(condition.value);
        await this.conditionNameInput.fill(condition.name);
    }
}
