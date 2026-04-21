import { Locator } from '@playwright/test';
import { DataExplorerTab } from '../dataExplorerTab';

export class CreateNewEntityModal {
    readonly parent: DataExplorerTab;
    readonly root: Locator;

    readonly technicalNameInput: Locator;
    readonly nameInput: Locator;
    readonly descriptionTextArea: Locator;

    readonly attributes: Locator;
    readonly addAttributeButton: Locator;
    readonly deleteAttributeButton: (attributeIndex: number) => Locator;
    readonly attributeNameInput: (attributeIndex: number) => Locator;
    readonly attributeTechnicalNameInput: (attributeIndex: number) => Locator;
    readonly attributeExpansionPanelArrowDown: (
        technicalName: string,
        attributeIndex: number
    ) => Locator;
    readonly attributeDataTypeSelect: (attributeIndex: number) => Locator;
    readonly attributeDataTypeSelectItem: (attributeIndex: number, dataType: string) => Locator;
    readonly attributePrimaryKeyCheckbox: (attributeIndex: number) => Locator;
    readonly attributeSizeInput: (attributeIndex: number) => Locator;
    readonly attributeNullableCheckbox: (attributeIndex: number) => Locator;
    readonly attributeHasDefaultValueCheckbox: (attributeIndex: number) => Locator;
    readonly attributeDefaultValueDateInput: (attributeIndex: number) => Locator;
    readonly attributeDefaultValueTimeInput: (attributeIndex: number) => Locator;
    readonly attributeScaleInput: (attributeIndex: number) => Locator;

    readonly submitButton: Locator;

    constructor(parent: DataExplorerTab) {
        this.parent = parent;
        this.root = parent.parent.parent.page.getByTestId(
            'DB-CreateElementModal-Modal-IxModal-root'
        );

        this.technicalNameInput = this.root
            .getByTestId('DB-CreateElementModal-IxInput-TechnicalName-IxInput-root')
            .getByRole('textbox');
        this.nameInput = this.root
            .getByTestId('DB-CreateElementModal-IxInput-Name-IxInput-root')
            .getByRole('textbox');
        this.descriptionTextArea = this.root
            .getByTestId('DB-CreateElementModal-IxTextArea-Description-IxTextArea-root')
            .getByRole('textbox');

        this.attributes = this.root.locator('[data-testid$="-IxExpansionPanel-root"]');
        this.addAttributeButton = this.root.getByTestId(
            'DB-CreateElementModal-IxButton-AddAttribute-IxButton-root'
        );
        this.deleteAttributeButton = (attributeIndex: number) =>
            this.root.getByTestId(`DB-AttributeSection-Delete-${attributeIndex}-IxIconButton-root`);
        this.attributeNameInput = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-IxInput-${attributeIndex}-Name-IxInput-root`)
                .getByRole('textbox');
        this.attributeTechnicalNameInput = (attributeIndex: number) =>
            this.root
                .getByTestId(
                    `DB-AttributeSection-IxInput-${attributeIndex}-TechnicalName-IxInput-root`
                )
                .getByRole('textbox');
        this.attributeExpansionPanelArrowDown = (technicalName: string, attributeIndex: number) =>
            this.root.getByTestId(
                `DB-AttributeList-${technicalName}-${attributeIndex}-IxExpansionPanel-actions-IxIconButton-arrow_down-IxIconButton-root`
            );
        this.attributeDataTypeSelect = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-DataType-${attributeIndex}-IxSelect-root`)
                .locator('.v-field');
        this.attributeDataTypeSelectItem = (attributeIndex: number, dataType: string) =>
            this.parent.parent.parent.page.getByTestId(
                `DB-AttributeSection-DataType-${attributeIndex}-IxSelect-item-${dataType}`
            );
        this.attributePrimaryKeyCheckbox = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-PrimaryKey-${attributeIndex}-IxToggle-root`)
                .getByRole('checkbox');
        this.attributeSizeInput = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-Size-${attributeIndex}-IxInput-root`)
                .locator('input');
        this.attributeNullableCheckbox = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-Nullable-${attributeIndex}-IxToggle-root`)
                .getByRole('checkbox');
        this.attributeHasDefaultValueCheckbox = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-HasDefaultValue-${attributeIndex}-IxToggle-root`)
                .getByRole('checkbox');
        this.attributeDefaultValueDateInput = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-DefaultValueDate-${attributeIndex}-IxInput-root`)
                .locator('input[type="date"]');
        this.attributeDefaultValueTimeInput = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-DefaultValueTime-${attributeIndex}-IxInput-root`)
                .locator('input[type="time"]');
        this.attributeScaleInput = (attributeIndex: number) =>
            this.root
                .getByTestId(`DB-AttributeSection-Scale-${attributeIndex}-IxInput-root`)
                .locator('input');

        this.submitButton = this.root.getByTestId(
            'DB-CreateElementModal-IxButton-AddElement-IxButton-root'
        );
    }

    public async addAttribute(
        name: string,
        technicalName: string,
        dataType: string,
        size: number,
        isNullable: boolean,
        isPrimaryKey = false,
        scale?: number
    ) {
        await this.addAttributeButton.click();
        const attributeIndex = (await this.attributes.count()) - 1;

        await this.attributeNameInput(attributeIndex).fill(name);
        await this.attributeNameInput(attributeIndex).blur();
        await this.attributeTechnicalNameInput(attributeIndex).fill(technicalName);
        await this.attributeExpansionPanelArrowDown(technicalName, attributeIndex).click();

        await this.attributeDataTypeSelect(attributeIndex).click();
        await this.attributeDataTypeSelectItem(attributeIndex, dataType).click();

        if (isNullable && !isPrimaryKey) {
            await this.attributeNullableCheckbox(attributeIndex).first().click();
        }
        if (size) {
            await this.attributeSizeInput(attributeIndex).fill(size.toString());
        }
        if (scale) {
            await this.attributeScaleInput(attributeIndex).fill(scale.toString());
        }
    }
}
