import { Locator } from '@playwright/test';
import { Canvas } from '../canvas';

export class EntityCard {
    readonly parent: Canvas;
    readonly technicalName: string;
    readonly root: Locator;

    readonly keyIcon: Locator;
    readonly connectionHandle: (attributeName: string, side: 'left' | 'right') => Locator;

    constructor(parent: Canvas, technicalName: string) {
        this.parent = parent;
        this.technicalName = technicalName;

        this.root = parent.root.getByTestId(new RegExp(`DB-EntityElement-Div-.*${technicalName}$`));

        this.keyIcon = this.root.getByRole('img', { name: 'key' }).first();
        this.connectionHandle = (attributeName: string, side: 'left' | 'right') =>
            this.root.getByTestId(new RegExp(`DB-EntityElement-Div-${attributeName}-${side}$`));
    }
}
