import { Locator } from '@playwright/test';
import { Canvas } from '../canvas';

export class CanvasToolbar {
    readonly parent: Canvas;
    readonly root: Locator;

    readonly collapseExplorerButton: Locator;
    readonly openRunbooksButton: Locator;
    readonly autoCreateAllOperationsButton: Locator;
    readonly autoLayoutButton: Locator;
    readonly saveModelButton: Locator;
    readonly createNewVersionButton: Locator;
    readonly collapseInspectorButton: Locator;

    constructor(parent: Canvas) {
        this.parent = parent;
        this.root = parent.parent.root.locator('header.v-toolbar');

        this.collapseExplorerButton = this.root.getByTestId(
            'DB-CanvasToolbar-IxCanvasToolbar-leftPane-IxIconButton-root'
        );
        this.openRunbooksButton = this.root.getByTestId(
            'DB-CanvasToolbar-IxIconButton-OpenRunbooks'
        );
        this.autoCreateAllOperationsButton = this.root.getByTestId(
            'DB-NodeToolbar-AutoCreate-IxIconButton-root'
        );
        this.autoLayoutButton = this.root.getByTestId(
            'DB-CanvasToolbar-IxIconButton-HandleAutoLayout-IxIconButton-root'
        );
        this.saveModelButton = this.root.getByTestId(
            'DB-CanvasToolbar-IxSplitButton-SaveModel-IxSplitButton-primary'
        );
        this.createNewVersionButton = this.root.getByTestId(
            'DB-CanvasToolbar-IxButton-CreateNewVersion-IxButton-root'
        );
        this.collapseInspectorButton = this.root.getByTestId(
            'DB-CanvasToolbar-IxCanvasToolbar-rightPane-IxIconButton-root'
        );
    }
}
