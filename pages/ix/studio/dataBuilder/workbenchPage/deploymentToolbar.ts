import { Locator } from '@playwright/test';
import { WorkbenchPage } from '../workbenchPage';

export class DeploymentToolbar {
    readonly parent: WorkbenchPage;
    readonly root: Locator;

    readonly moveBackToOverviewButton: Locator;
    readonly deployToNextStageButton: Locator;
    readonly showHideVersionListToggle: Locator;

    constructor(parent: WorkbenchPage) {
        this.parent = parent;
        this.root = parent.root.locator('section > div.ix-stagingtoolbar');

        this.moveBackToOverviewButton = this.root.getByTestId(
            'DB-WorkbenchView-Versions-IxStagingToolbar-IxIconbutton-GoToOverview-IxIconButton-root'
        );
        this.deployToNextStageButton = this.root.getByTestId(
            'DB-WorkbenchView-SplitButton-Deploy-IxSplitButton-primary'
        );
        this.showHideVersionListToggle = this.root.getByTestId(
            'DB-WorkbenchView-Versions-IxIconButtonV2-Version-Toggle-IxIconButton-root'
        );
    }
}
