import { Locator } from '@playwright/test';
import { PropertiesTab } from '../propertiesTab';

export class AttributePanel {
    readonly parent: PropertiesTab;
    readonly attributeTechnicalName: string;
    readonly root: Locator;

    readonly deleteButton: Locator;
    readonly deleteConfirmButton: Locator;
    readonly panelExpansionArrowButton: Locator;

    readonly nameInput: Locator;
    readonly technicalNameInput: Locator;
    readonly descriptionInput: Locator;
    readonly dataTypeSelect: Locator;
    readonly dataTypeSelectOption: (dataType: string) => Locator;
    readonly nullableCheckbox: Locator;
    readonly primaryKeyCheckbox: Locator;
    readonly hasDefaultValueCheckbox: Locator;
    readonly defaultValueInput: Locator;
    readonly defaultValueSelect: Locator;
    readonly sizeInput: Locator;
    readonly scaleInput: Locator;

    constructor(parent: PropertiesTab, attributeTechnicalName: string) {
        this.parent = parent;
        this.attributeTechnicalName = attributeTechnicalName;
        this.root = parent.root.locator(
            `[data-testid^="DB-AttributeList-${this.attributeTechnicalName}-"][data-testid$="-IxExpansionPanel-root"]`
        );

        this.deleteButton = this.root.getByTestId(
            /DB-AttributeSection-Delete-\d+-IxIconButton-root/
        );
        this.deleteConfirmButton = this.parent.parent.parent.page.getByTestId(
            'DB-AttributeList-DeleteModal-IxModal-submit-IxButton-root'
        );
        this.panelExpansionArrowButton = this.root.getByTestId(
            new RegExp(
                `DB-AttributeList-${this.attributeTechnicalName}-\\d+-IxExpansionPanel-actions-IxIconButton-arrow_down-IxIconButton-root`
            )
        );

        this.nameInput = this.root
            .getByTestId(/DB-AttributeSection-IxInput-\d+-Name-IxInput-root/)
            .getByRole('textbox');
        this.technicalNameInput = this.root
            .getByTestId(/DB-AttributeSection-IxInput-\d+-TechnicalName-IxInput-root/)
            .getByRole('textbox');
        this.descriptionInput = this.root
            .getByTestId(/DB-AttributeSection-Description-\d+-IxTextArea-root/)
            .getByRole('textbox');
        this.dataTypeSelect = this.root
            .getByTestId(/DB-AttributeSection-DataType-\d+-IxSelect-root/)
            .locator('div[role="combobox"]');
        this.dataTypeSelectOption = (dataType: string) =>
            this.parent.parent.parent.page.locator(
                `[data-testid*="DB-AttributeSection-DataType-"][data-testid$="IxSelect-item-${dataType}"]`
            );
        this.nullableCheckbox = this.root
            .getByTestId(/DB-AttributeSection-Nullable-\d+-IxToggle-root/)
            .getByRole('checkbox');
        this.primaryKeyCheckbox = this.root
            .getByTestId(/DB-AttributeSection-PrimaryKey-\d+-IxToggle-root/)
            .getByRole('checkbox');
        this.hasDefaultValueCheckbox = this.root
            .getByTestId(/DB-AttributeSection-HasDefaultValue-\d+-IxToggle-root/)
            .getByRole('checkbox');
        this.defaultValueInput = this.root
            .locator('[data-testid^="DB-AttributeSection-DefaultValue"]')
            .getByRole('textbox');
        this.defaultValueSelect = this.root
            .locator('[data-testid^="DB-AttributeSection-SelectDefaultValue"]')
            .locator('div[role="combobox"]');
        this.sizeInput = this.root
            .getByTestId(/DB-AttributeSection-Size-\d+-IxInput-root/)
            .locator("input[type='number']");
        this.scaleInput = this.root
            .getByTestId(/DB-AttributeSection-Scale-\d+-IxInput-root/)
            .locator("input[type='number']");
    }

    public async selectDataType(dataType: string) {
        await this.dataTypeSelect.click();
        await this.dataTypeSelectOption(dataType).click();
    }
}
