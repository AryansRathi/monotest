import { Page } from '@playwright/test';
import { OverviewPage } from './dataBuilder/overviewPage';
import { WorkbenchPage } from './dataBuilder/workbenchPage';

export class DataBuilder {
    readonly page: Page;

    readonly overview: OverviewPage;
    readonly workbench: WorkbenchPage;

    constructor(page: Page) {
        this.page = page;

        this.overview = new OverviewPage(page);
        this.workbench = new WorkbenchPage(page);
    }

    public async open() {
        await this.overview.open();
    }
}
