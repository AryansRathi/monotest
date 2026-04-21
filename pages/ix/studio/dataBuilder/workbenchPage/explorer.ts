import { Locator } from '@playwright/test';
import { WorkbenchPage } from '../workbenchPage';
import { DataExplorerTab } from './explorer/dataExplorerTab';
import { RelationshipExplorerTab } from './explorer/relationshipExplorerTab';

export class Explorer {
    readonly parent: WorkbenchPage;
    readonly root: Locator;

    readonly dataExplorerTab: DataExplorerTab;
    readonly dataExplorerTabButton: Locator;
    readonly relationshipExplorerTab: RelationshipExplorerTab;
    readonly relationshipExplorerTabButton: Locator;

    constructor(parent: WorkbenchPage) {
        this.parent = parent;
        this.root = parent.page.locator('section#explorer');

        this.dataExplorerTab = new DataExplorerTab(this);
        this.dataExplorerTabButton = this.root.getByTestId(
            'DB-ERInspector-properties-tab-IxTabButton-root'
        );
        this.relationshipExplorerTab = new RelationshipExplorerTab(this);
        this.relationshipExplorerTabButton = this.root.getByTestId(
            'DB-ExplorerView-TabButton-RelationshipExplorer-IxTabButton-root'
        );
    }
}
