import { Locator } from '@playwright/test';
import { Inspector } from '../inspector';
import { QueryForm } from './queriesTab/queryForm';

export type DataModelQuery = {
    name: string;
    technicalName: string;
    dataEntityName: string;
    attributeNames?: string[];
};

export class QueriesTab {
    readonly parent: Inspector;
    readonly root: Locator;

    readonly queryForm: QueryForm;

    readonly searchInput: Locator;
    readonly addQueryButton: Locator;

    readonly queryCard: (queryName: string) => Locator;

    constructor(parent: Inspector) {
        this.parent = parent;
        this.root = parent.root.getByTestId('DB-ErQueries-Root');

        this.queryForm = new QueryForm(this);

        this.searchInput = this.root
            .getByTestId('DB-OperationsList-IxInput-Search-IxInput-root')
            .getByRole('textbox');
        this.addQueryButton = this.root.getByTestId('DB-ErQueryList-AddQueryButton-IxButton-root');

        this.queryCard = (queryName: string) =>
            this.root
                .getByTestId(/DB-OperationsList-IxCard-.*-Selected-IxCard-root/)
                .filter({ hasText: queryName })
                .or(
                    this.root
                        .locator('[data-testid^="DB-OperationsList-IxCard-"]')
                        .filter({ hasText: queryName })
                );
    }

    public async open() {
        await this.parent.queriesTabButton.click();
    }

    public async search(query: string) {
        await this.searchInput.fill(query);
    }

    public async createQuery(query: DataModelQuery) {
        await this.addQueryButton.click();
        await this.queryForm.nameInput.fill(query.name);
        await this.queryForm.nameInput.blur();
        await this.queryForm.technicalNameInput.fill(query.technicalName);
        await this.queryForm.selectDataEntity(query.dataEntityName);
        if (query.attributeNames) {
            await this.queryForm.selectAttributes(query.attributeNames);
        }
        await this.queryForm.submit();
    }
}
