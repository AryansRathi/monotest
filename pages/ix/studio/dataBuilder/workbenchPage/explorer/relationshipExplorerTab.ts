import { Locator } from '@playwright/test';
import { Explorer } from '../explorer';

export class RelationshipExplorerTab {
    readonly parent: Explorer;
    readonly root: Locator;

    constructor(parent: Explorer) {
        this.parent = parent;
        this.root = parent.root.getByTestId('DB-ExplorerView-TabWindow-IxTabWindow-root');
    }

    public async open() {
        await this.parent.relationshipExplorerTabButton.click();
    }
}
