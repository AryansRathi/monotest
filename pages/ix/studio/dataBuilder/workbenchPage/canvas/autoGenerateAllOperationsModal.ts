import { Locator } from '@playwright/test';
import { Canvas } from '../canvas';

export class AutoGenerateAllOperationsModal {
    readonly parent: Canvas;
    readonly root: Locator;

    readonly submitButton: Locator;

    constructor(parent: Canvas) {
        this.parent = parent;
        this.root = parent.parent.page.getByTestId(
            'DB-AutoGenerateAllOperationsAgainModal-Modal-IxModal-root'
        );

        this.submitButton = this.root.getByTestId(
            'DB-AutoGenerateAllOperationsAgainModal-Modal-IxModal-submit-IxButton-root'
        );
    }
}
