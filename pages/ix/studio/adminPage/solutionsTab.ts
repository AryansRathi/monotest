import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';
import { SolutionFormModal } from './solutionsTab/solutionFormModal';

export class SolutionsTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly createButton: Locator;
    readonly searchInput: Locator;

    /** Delete-confirmation modal triggered from the list view. */
    readonly deleteConfirmModal: Locator;
    readonly deleteConfirmSubmitButton: Locator;

    readonly formModal: SolutionFormModal;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root.getByTestId('IS-SolutionsView');

        this.createButton = this.root.getByRole('button', { name: /new solution/i });
        this.searchInput = this.root.getByRole('textbox');

        this.deleteConfirmModal = parent.parent.page.getByTestId('IS-SolutionsView-DeleteConfirm');
        this.deleteConfirmSubmitButton = this.deleteConfirmModal.getByRole('button', {
            name: /delete/i
        });

        this.formModal = new SolutionFormModal(parent.parent.page);
    }

    /** Returns the card element for a solution by its id. */
    card(solutionId: string): Locator {
        return this.root.getByTestId(`IS-SolutionsView-Card-${solutionId}`);
    }

    /** Returns the App count chip on a card. */
    cardAppChip(solutionId: string): Locator {
        return this.root.getByTestId(`IS-SolutionsView-Card-Apps-${solutionId}`);
    }

    /** Returns the Process count chip on a card. */
    cardProcessChip(solutionId: string): Locator {
        return this.root.getByTestId(`IS-SolutionsView-Card-Processes-${solutionId}`);
    }

    /** Returns the Data count chip on a card. */
    cardDataChip(solutionId: string): Locator {
        return this.root.getByTestId(`IS-SolutionsView-Card-Data-${solutionId}`);
    }

    /** Returns the Edit menu item in a card's context menu. */
    cardEditMenuItem(solutionId: string): Locator {
        return this.parent.parent.page.getByTestId(`IS-SolutionsView-Card-Edit-${solutionId}`);
    }

    /** Returns the Delete menu item in a card's context menu. */
    cardDeleteMenuItem(solutionId: string): Locator {
        return this.parent.parent.page.getByTestId(`IS-SolutionsView-Card-Delete-${solutionId}`);
    }

    /** Opens the create-solution wizard. */
    async openCreate(): Promise<void> {
        await this.createButton.click();
    }

    /** Opens the edit wizard for a given solution card. */
    async openEdit(solutionId: string): Promise<void> {
        await this.cardEditMenuItem(solutionId).click();
    }

    /** Triggers the delete confirmation dialog for a given solution card. */
    async openDelete(solutionId: string): Promise<void> {
        await this.cardDeleteMenuItem(solutionId).click();
    }

    /** Confirms deletion in the delete-confirmation modal. */
    async confirmDelete(): Promise<void> {
        await this.deleteConfirmSubmitButton.click();
    }

    /** Navigates to this tab via the admin sidebar. */
    async open(): Promise<void> {
        await this.parent.sidebar.solutionsTabButton.click();
    }
}
