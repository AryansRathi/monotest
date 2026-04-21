import { Locator, Page } from '@playwright/test';
import { DataModelsTab } from './overviewPage/dataModelsTab';
import { DataSourcesTab } from './overviewPage/dataSourcesTab';
import { IX } from '@pages/ix';

export class OverviewPage {
    readonly page: Page;
    readonly root: Locator;

    readonly dataModelsTab: DataModelsTab;
    readonly dataModelsTabButton: Locator;
    readonly dataSourcesTab: DataSourcesTab;
    readonly dataSourcesTabButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.root = page.locator('main .overviewContent');

        this.dataModelsTab = new DataModelsTab(this);
        this.dataModelsTabButton = page.getByTestId('DB-Overview-DatamodelsTab-IxTabButton-root');
        this.dataSourcesTab = new DataSourcesTab(this);
        this.dataSourcesTabButton = page.getByTestId('DB-Overview-DatasourcesTab-IxTabButton-root');
    }

    public async open() {
        const ix = new IX(this.page);
        await ix.studio.navRail.dataButton.click();
    }
}
