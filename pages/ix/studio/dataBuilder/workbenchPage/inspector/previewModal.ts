import { Locator } from '@playwright/test';
import { Inspector } from '../inspector';

export class PreviewModal {
    readonly parent: Inspector;
    readonly root: Locator;

    readonly executeButton: Locator;
    readonly closeButton: Locator;

    readonly resultsTable: Locator;
    readonly resultsTableRows: Locator;
    readonly resultsTableBody: Locator;
    readonly resultsTableRow: (withText: string) => Locator;
    readonly resultsTableFooter: Locator;
    readonly resultsTableItemsPerPageSelect: Locator;
    readonly resultsTableItemsPerPageSelectItem: (itemsPerPage: string) => Locator;

    readonly parametersExpansionToggle: Locator;
    readonly parameterInput: (attributeName: string) => Locator;

    constructor(parent: Inspector) {
        this.parent = parent;
        this.root = parent.parent.page.getByTestId('DB-InspectorView-Preview-IxModal-root');

        this.executeButton = this.root.getByTestId('DB-PreviewView-execute-query-IxButton-root');
        this.closeButton = this.root.getByTestId('DB-PreviewView-close-button-IxIconButton-root');

        this.resultsTable = this.root.getByTestId('DB-ErOutput-DataTable-IxDataTable-root');
        this.resultsTableRow = (withText: string) =>
            this.resultsTable.locator('tr', { hasText: withText });
        this.resultsTableFooter = this.resultsTable.locator('.v-data-table-footer');
        this.resultsTableItemsPerPageSelect = this.resultsTableFooter
            .locator('.v-data-table-footer__items-per-page')
            .getByRole('combobox')
            .first();
        this.resultsTableItemsPerPageSelectItem = (itemsPerPage: string) =>
            this.parent.parent.page
                .locator('.v-overlay__content .v-list-item')
                .getByText(itemsPerPage);

        this.parametersExpansionToggle = this.root.getByTestId(
            'DB-ErInput-Parameters-IxExpansionPanel-IxExpansionPanel-actions-IxIconButton-arrow_down-IxIconButton-root'
        );
        this.parameterInput = (attributeName: string) =>
            this.root
                .getByTestId(
                    `DB-ErInput-Parameters-IxExpansionPanel-IxInput-${attributeName}-text-value-IxInput-root`
                )
                .locator('input');
    }

    public async setParameters(parameters: Record<string, string>) {
        const classes = await this.parametersExpansionToggle.locator('..').getAttribute('class');
        if (!classes.split(' ').includes('ix-expansionpanel__arrow--rotated')) {
            await this.parametersExpansionToggle.click();
        }
        for (const [attributeName, value] of Object.entries(parameters)) {
            await this.parameterInput(attributeName).fill(value);
        }
    }

    public async setItemsPerPage(itemsPerPage: string) {
        await this.resultsTableItemsPerPageSelect.click();
        await this.resultsTableItemsPerPageSelectItem(itemsPerPage).click();
    }
}
