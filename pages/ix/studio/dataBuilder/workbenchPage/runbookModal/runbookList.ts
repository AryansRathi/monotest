import { Locator } from '@playwright/test';
import { RunbookModal } from '../runbookModal';
import { RunbookCard } from './runbookCard';

export class RunbookList {
    readonly parent: RunbookModal;
    readonly root: Locator;

    readonly searchInput: Locator;
    readonly sortButton: Locator;
    readonly createRunbookButton: Locator;
    readonly confirmDeleteModal: Locator;
    readonly confirmDeleteButton: Locator;
    readonly cancelDeleteButton: Locator;
    readonly runbookCards: Locator;

    constructor(parent: RunbookModal) {
        this.parent = parent;
        this.root = parent.root.locator('.runbook-pane').first();

        this.searchInput = this.root.getByTestId('DB-RunbookModal-IxInput-Search').locator('input');
        this.sortButton = this.root.getByTestId('DB-RunbookModal-IxIconButton-Sort');
        this.createRunbookButton = this.root.getByTestId('DB-RunbookModal-create-runbook-button');
        this.confirmDeleteModal = parent.parent.page.getByTestId('DB-RunbookModal-ConfirmDelete');
        this.confirmDeleteButton = this.confirmDeleteModal.getByRole('button', { name: 'Confirm' });
        this.cancelDeleteButton = this.confirmDeleteModal.getByRole('button', { name: 'Cancel' });
        this.runbookCards = this.root.locator(
            '.runbook-list-card[data-testid^="DB-RunbookModal-runbook-"]'
        );
    }

    public runbookCard(name: string): RunbookCard {
        return new RunbookCard(this, name);
    }

    public sortOption(option: 'ascName' | 'descName' | 'ascUpdated' | 'descUpdated'): Locator {
        return this.parent.parent.page.getByTestId(`DB-RunbookModal-IxMenuListItem-${option}`);
    }

    public async search(query: string) {
        await this.searchInput.fill(query);
    }
}
