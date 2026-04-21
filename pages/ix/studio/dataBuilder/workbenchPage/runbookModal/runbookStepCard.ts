import { Locator } from '@playwright/test';
import { RunbookSteps } from './runbookSteps';

export class RunbookStepCard {
    readonly parent: RunbookSteps;
    readonly root: Locator;

    readonly title: Locator;
    readonly operationTypeChip: Locator;
    readonly moveUpButton: Locator;
    readonly moveDownButton: Locator;
    readonly copyButton: Locator;
    readonly deleteButton: Locator;

    constructor(parent: RunbookSteps, name: string) {
        this.parent = parent;
        this.root = parent.stepCards.filter({
            has: parent.root.getByText(name, { exact: true })
        });

        this.title = this.root.getByText(name, { exact: true });
        this.operationTypeChip = this.root.locator('[data-testid^="DB-RunbookModal-step-type-"]');
        this.moveUpButton = this.root.locator('[data-testid^="DB-RunbookModal-step-move-up-"]');
        this.moveDownButton = this.root.locator('[data-testid^="DB-RunbookModal-step-move-down-"]');
        this.copyButton = this.root.locator('[data-testid^="DB-RunbookModal-step-copy-"]');
        this.deleteButton = this.root.locator('[data-testid^="DB-RunbookModal-step-delete-"]');
    }

    public async select() {
        await this.root.click();
    }
}
