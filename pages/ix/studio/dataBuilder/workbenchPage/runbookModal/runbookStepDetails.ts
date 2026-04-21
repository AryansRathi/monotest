import { Locator } from '@playwright/test';
import { RunbookModal } from '../runbookModal';

export class RunbookStepDetails {
    readonly parent: RunbookModal;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly erOperationCombobox: Locator;
    readonly erQueryTab: Locator;
    readonly erCommandTab: Locator;
    readonly erOperationDetailsPanel: Locator;
    readonly erParametersPanel: Locator;
    readonly restOperationCombobox: Locator;
    readonly restQueryTab: Locator;
    readonly restCommandTab: Locator;
    readonly restOperationDetailsPanel: Locator;
    readonly restParametersPanel: Locator;
    readonly restPlaceholderPanels: Locator;

    constructor(parent: RunbookModal) {
        this.parent = parent;
        this.root = parent.root.locator('.runbook-pane').nth(2);

        this.nameInput = this.root.getByTestId('DB-RunbookModal-step-name-input').locator('input');
        this.erOperationCombobox = this.root.getByTestId(
            'DB-RunbookModal-er-step-operation-combobox'
        );
        this.erQueryTab = this.parent.root.getByTestId(
            'DB-RunbookModal-er-step-operation-query-tab'
        );
        this.erCommandTab = this.parent.root.getByTestId(
            'DB-RunbookModal-er-step-operation-command-tab'
        );
        this.erOperationDetailsPanel = this.root.getByTestId(
            'DB-RunbookModal-er-step-operation-details-panel'
        );
        this.erParametersPanel = this.root.getByTestId('DB-RunbookModal-er-step-parameters-panel');
        this.restOperationCombobox = this.root.getByTestId(
            'DB-RunbookModal-rest-step-operation-combobox'
        );
        this.restQueryTab = this.parent.root.getByTestId(
            'DB-RunbookModal-rest-step-operation-query-tab'
        );
        this.restCommandTab = this.parent.root.getByTestId(
            'DB-RunbookModal-rest-step-operation-command-tab'
        );
        this.restOperationDetailsPanel = this.root.getByTestId(
            'DB-RunbookModal-rest-step-operation-details-panel'
        );
        this.restParametersPanel = this.root.getByTestId(
            'DB-RunbookModal-rest-step-parameters-panel'
        );
        this.restPlaceholderPanels = this.restParametersPanel.getByTestId(
            'DB-RestRequestProperties-PathParametersExpansionPanel'
        );
    }

    public erParameterInput(technicalName: string): Locator {
        return this.root.locator(
            `[data-testid^="DB-RunbookModal-er-step-parameters-value-"][data-testid$="-${technicalName}"] input, ` +
                `[data-testid^="DB-RunbookModal-er-step-parameters-value-"][data-testid$="-${technicalName}"] textarea`
        );
    }

    public erBooleanParameterSelect(technicalName: string): Locator {
        return this.root
            .locator(
                `[data-testid="DB-RunbookModal-er-step-parameters-value-boolean-${technicalName}"]`
            )
            .locator('.v-field');
    }

    public operationOption(name: string): Locator {
        return this.parent.parent.page.getByRole('option', { name, exact: true });
    }

    public restPlaceholderPanel(name: string): Locator {
        return this.restPlaceholderPanels.filter({
            has: this.restParametersPanel.getByText(name, { exact: true })
        });
    }

    public restPlaceholder(name: string, index: number): Locator {
        return this.restPlaceholderPanel(name).getByTestId(
            `DB-RestPlaceholderList-RestPlaceholder-${index}`
        );
    }

    public restPlaceholderKeyInput(name: string, index: number): Locator {
        return this.restPlaceholder(name, index)
            .getByTestId('DB-RestPlaceholder-IxInput-Key')
            .locator('input');
    }

    public restPlaceholderValueInput(name: string, index: number): Locator {
        return this.restPlaceholder(name, index)
            .getByTestId('DB-RestPlaceholder-IxInput-Value')
            .locator('input');
    }

    public async setStepName(name: string) {
        await this.nameInput.fill(name);
    }

    public async selectErOperation(name: string, category: 'query' | 'command' = 'query') {
        await this.erOperationCombobox.click();
        if (category === 'command') {
            await this.erCommandTab.click();
        } else {
            await this.erQueryTab.click();
        }
        await this.operationOption(name).click();
    }

    public async selectRestOperation(name: string, category: 'query' | 'command' = 'query') {
        await this.restOperationCombobox.click();
        if (category === 'command') {
            await this.restCommandTab.click();
        } else {
            await this.restQueryTab.click();
        }
        await this.operationOption(name).click();
    }
}
