import { Locator, Page } from '@playwright/test';
import { Canvas } from './workbenchPage/canvas';
import { DeploymentToolbar } from './workbenchPage/deploymentToolbar';
import { Explorer } from './workbenchPage/explorer';
import { Inspector } from './workbenchPage/inspector';
import { RunbookModal } from './workbenchPage/runbookModal';

export class WorkbenchPage {
    readonly page: Page;
    readonly root: Locator;

    readonly canvas: Canvas;
    readonly explorer: Explorer;
    readonly deploymentToolbar: DeploymentToolbar;
    readonly inspector: Inspector;
    readonly runbookModal: RunbookModal;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('main .wrapper');

        this.canvas = new Canvas(this);
        this.explorer = new Explorer(this);
        this.deploymentToolbar = new DeploymentToolbar(this);
        this.inspector = new Inspector(this);
        this.runbookModal = new RunbookModal(this);
    }

    public async exit() {
        await this.deploymentToolbar.moveBackToOverviewButton.click();
    }
}
