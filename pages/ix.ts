// This is the entrypoint for the IX25 pages

import { Page } from '@playwright/test';
import { Portal } from '@pages/ix/portal';
import { Studio } from '@pages/ix/studio';

export class IX {
    readonly page: Page;

    readonly portal: Portal;
    readonly studio: Studio;

    constructor(page: Page) {
        this.page = page;

        this.portal = new Portal(page);
        this.studio = new Studio(page);
    }
}
