import { Locator } from '@playwright/test';
import { RunbookModal } from '../runbookModal';
import { RunbookStepCard } from './runbookStepCard';

export class RunbookSteps {
    readonly parent: RunbookModal;
    readonly root: Locator;

    readonly toggleStepDetailsButton: Locator;
    readonly lastRunMetric: Locator;
    readonly completedCountMetric: Locator;
    readonly failedCountMetric: Locator;
    readonly addStepPlaceholder: Locator;
    readonly stepCards: Locator;

    constructor(parent: RunbookModal) {
        this.parent = parent;
        this.root = parent.root.locator('.runbook-pane').nth(1);

        this.toggleStepDetailsButton = this.root.getByTestId('DB-RunbookModal-toggle-step-details');
        this.lastRunMetric = this.root.getByTestId('DB-RunbookModal-MetricCard-LastRun');
        this.completedCountMetric = this.root.getByTestId(
            'DB-RunbookModal-MetricCard-CompletedCount'
        );
        this.failedCountMetric = this.root.getByTestId('DB-RunbookModal-MetricCard-FailedCount');
        this.addStepPlaceholder = this.root.getByTestId('DB-RunbookModal-add-step-placeholder');
        this.stepCards = this.root.locator('.step-list-item[data-testid^="DB-RunbookModal-step-"]');
    }

    public stepCard(name: string): RunbookStepCard {
        return new RunbookStepCard(this, name);
    }

    public async selectStep(name: string) {
        await this.stepCard(name).root.click();
    }
}
