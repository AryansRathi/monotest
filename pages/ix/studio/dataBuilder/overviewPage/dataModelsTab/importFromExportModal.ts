import { Locator } from '@playwright/test';
import { DataModelsTab } from '../dataModelsTab';

export class ImportFromExportModal {
    readonly parent: DataModelsTab;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly technicalNameInput: Locator;
    readonly fileInput: Locator;

    readonly submitButton: Locator;

    constructor(parent: DataModelsTab) {
        this.parent = parent;
        this.root = parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Create copy'
        });

        this.nameInput = this.root
            .getByTestId('DB-ModelsList-CreateCopyModal-Input-Name-IxInput-root')
            .getByRole('textbox');
        this.technicalNameInput = this.root
            .getByTestId('DB-ModelsList-CreateCopyModal-Input-TechnicalName-IxInput-root')
            .getByRole('textbox');
        this.fileInput = this.root
            .getByTestId('DB-ModelsList-CreateCopyModal-v-file-input-Input')
            .locator('input[type="file"]');

        this.submitButton = this.root.getByTestId(
            'DB-ModelsList-CreateCopyModal-CreateCopy-IxButton-root'
        );
    }
}
