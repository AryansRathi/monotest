import { Locator } from '@playwright/test';
import { WorkbenchPage } from '../workbenchPage';
import { CreateRunbookModal } from './runbookModal/createRunbookModal';
import { RunbookExecutionPanel } from './runbookModal/runbookExecutionPanel';
import { RunbookList } from './runbookModal/runbookList';
import { RunbookStepDetails } from './runbookModal/runbookStepDetails';
import { RunbookSteps } from './runbookModal/runbookSteps';

export class RunbookModal {
    readonly parent: WorkbenchPage;
    readonly root: Locator;

    readonly modelTechnicalNameChip: Locator;
    readonly addStepButton: Locator;
    readonly startRunbookButton: Locator;
    readonly closeButton: Locator;
    readonly executionSplitter: Locator;

    readonly createRunbookModal: CreateRunbookModal;
    readonly list: RunbookList;
    readonly steps: RunbookSteps;
    readonly stepDetails: RunbookStepDetails;
    readonly executionPanel: RunbookExecutionPanel;

    constructor(parent: WorkbenchPage) {
        this.parent = parent;
        this.root = parent.page.getByTestId('DB-RunbookModal-Modal');

        this.modelTechnicalNameChip = this.root.getByTestId(
            'DB-RunbookModal-model-technical-name-chip'
        );
        this.addStepButton = this.root.getByTestId('DB-RunbookModal-add-step-button');
        this.startRunbookButton = this.root.getByTestId('DB-RunbookModal-start-runbook-button');
        this.closeButton = this.root.getByTestId('DB-RunbookModal-close-button');
        this.executionSplitter = this.root.getByTestId('DB-RunbookModal-execution-splitter');

        this.createRunbookModal = new CreateRunbookModal(this);
        this.list = new RunbookList(this);
        this.steps = new RunbookSteps(this);
        this.stepDetails = new RunbookStepDetails(this);
        this.executionPanel = new RunbookExecutionPanel(this);
    }

    public async open() {
        await this.parent.canvas.toolbar.openRunbooksButton.click();
    }

    public async close() {
        await this.closeButton.click();
    }

    public async createRunbook({
        name,
        description,
        commitChanges
    }: {
        name: string;
        description?: string;
        commitChanges?: boolean;
    }) {
        await this.list.createRunbookButton.click();
        await this.createRunbookModal.fill({ name, description, commitChanges });
        await this.createRunbookModal.submitButton.click();
    }
}
