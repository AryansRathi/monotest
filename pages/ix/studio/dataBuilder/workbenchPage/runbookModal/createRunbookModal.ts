import { Locator } from '@playwright/test';
import { RunbookModal } from '../runbookModal';

export class CreateRunbookModal {
    readonly parent: RunbookModal;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly commitChangesCheckbox: Locator;
    readonly cancelButton: Locator;
    readonly submitButton: Locator;

    constructor(parent: RunbookModal) {
        this.parent = parent;
        this.root = parent.parent.page.getByTestId('DB-RunbookCreateModal-Modal');

        this.nameInput = this.root.getByTestId('DB-RunbookCreateModal-Name').locator('input');
        this.descriptionInput = this.root
            .getByTestId('DB-RunbookCreateModal-Description')
            .getByRole('textbox');
        this.commitChangesCheckbox = this.root
            .getByTestId('DB-RunbookCreateModal-CommitChanges')
            .getByRole('checkbox');
        this.cancelButton = this.root.getByTestId('DB-RunbookCreateModal-Cancel');
        this.submitButton = this.root.getByTestId('DB-RunbookCreateModal-Submit');
    }

    public async fill({
        name,
        description,
        commitChanges
    }: {
        name: string;
        description?: string;
        commitChanges?: boolean;
    }) {
        await this.nameInput.fill(name);

        if (description !== undefined) {
            await this.descriptionInput.fill(description);
        }

        if (commitChanges !== undefined) {
            await this.commitChangesCheckbox.setChecked(commitChanges);
        }
    }
}
