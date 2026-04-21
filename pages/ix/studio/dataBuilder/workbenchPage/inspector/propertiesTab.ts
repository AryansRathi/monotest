import { Locator } from '@playwright/test';
import { Inspector } from '../inspector';
import { AttributePanel } from './propertiesTab/attributePanel';
import type { TestDataEntityAttribute } from 'test/factories/dataModelFactory';

export class PropertiesTab {
    readonly parent: Inspector;
    readonly root: Locator;

    readonly openPropertiesModalButton: Locator;

    readonly nameInput: Locator;
    readonly technicalNameInput: Locator;
    readonly descriptionInput: Locator;

    readonly attributePanels: Locator;
    readonly attributePanel: (attributeTechnicalName: string) => AttributePanel;

    readonly addAttributeButton: Locator;

    constructor(parent: Inspector) {
        this.parent = parent;
        this.root = parent.root.getByTestId(
            'DB-ERInspector-TabWindowItem-Properties-IxTabWindowItem-root'
        );

        this.openPropertiesModalButton = this.root.getByTestId(
            'DB-PropertiesView-showOverlay-IxIconButton-root'
        );

        this.nameInput = this.root
            .getByTestId('DB-EntityInformation-IxInput-Title-IxInput-root')
            .getByRole('textbox');
        this.technicalNameInput = this.root
            .getByTestId('DB-EntityInformation-IxInput-TechnicalName-IxInput-root')
            .getByRole('textbox');
        this.descriptionInput = this.root
            .getByTestId('DB-EntityInformation-IxTextArea-Description-IxTextArea-root')
            .getByRole('textbox');

        this.attributePanels = this.root.locator(
            `[data-testid^="DB-AttributeList-"][data-testid$="-IxExpansionPanel-root"]`
        );
        // Caution: The test ID changes when typing into the technical name input field.
        // If this is a new attribute, pass "" as the attributeTechnicalName and get the
        // attributePanel again with the actual technical name after filling it into the input field
        this.attributePanel = (attributeTechnicalName: string) =>
            new AttributePanel(this, attributeTechnicalName);

        this.addAttributeButton = this.root.getByTestId('DB-AttributeList-Add-IxButton-root');
    }

    public async open() {
        await this.parent.propertiesTabButton.click();
    }

    public async addAttribute(attr: TestDataEntityAttribute) {
        // Because of the changing test id of the panel when setting the technical name
        // and the auto-fill of the technical name when setting the name, we first set
        // the technical name, then grab the panel again with the updated test id and
        // only then fill the other inputs of the attribute.
        await this.addAttributeButton.click();

        let newAttributePanel = this.attributePanel('');
        await newAttributePanel.technicalNameInput.fill(attr.technicalName);
        await newAttributePanel.technicalNameInput.blur();

        newAttributePanel = this.attributePanel(attr.technicalName);
        await newAttributePanel.panelExpansionArrowButton.click();

        await newAttributePanel.nameInput.fill(attr.name);
        await newAttributePanel.descriptionInput.fill(attr.description);
        await newAttributePanel.selectDataType(attr.dataType);
        if (attr.isPrimaryKey) {
            await newAttributePanel.primaryKeyCheckbox.click();
        }
        if (attr.isNullable) {
            await newAttributePanel.nullableCheckbox.click();
        }
        if (attr.size) {
            await newAttributePanel.sizeInput.fill(attr.size.toString());
        }
        if (attr.scale) {
            await newAttributePanel.scaleInput.fill(attr.scale.toString());
        }
    }
}
