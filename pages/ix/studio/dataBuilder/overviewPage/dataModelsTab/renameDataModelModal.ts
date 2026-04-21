import { Locator } from '@playwright/test';
import { DataModelsTab } from '../dataModelsTab';

export class RenameDataModelModal {
    readonly parent: DataModelsTab;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly saveButton: Locator;

    constructor(parent: DataModelsTab) {
        this.parent = parent;
        this.root = parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Rename Data Model'
        });

        this.nameInput = this.root
            .getByTestId('DB-RenameModel-Name-IxInput-root')
            .getByRole('textbox');
        this.saveButton = this.root.getByTestId('DB-RenameModel-Save-IxButton-root');
    }

    public async renameModel(newName: string) {
        await this.nameInput.fill(newName);
        await this.saveButton.click();
    }
}
