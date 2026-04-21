import { Locator } from '@playwright/test';
import { RunbookModal } from '../runbookModal';

export class RunbookExecutionPanel {
    readonly parent: RunbookModal;
    readonly root: Locator;

    readonly toggleButton: Locator;

    constructor(parent: RunbookModal) {
        this.parent = parent;
        this.root = parent.root.locator('.execution-panel');

        this.toggleButton = parent.root.getByTestId('DB-RunbookModal-toggle-execution-panel');
    }

    public executionStep(title: string): Locator {
        return this.root.locator('.execution-step').filter({
            has: this.root.getByText(title, { exact: true })
        });
    }

    public executionStatus(title: string): Locator {
        return this.executionStep(title).locator('.execution-status');
    }
}
