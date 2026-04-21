import { Locator } from '@playwright/test';
import { RunbookList } from './runbookList';

export class RunbookCard {
    readonly parent: RunbookList;
    readonly root: Locator;

    readonly title: Locator;
    readonly description: Locator;
    readonly menuButton: Locator;
    readonly editMenuItem: Locator;
    readonly deleteMenuItem: Locator;

    constructor(parent: RunbookList, name: string) {
        this.parent = parent;
        this.root = parent.runbookCards.filter({
            has: parent.root.getByText(name, { exact: true })
        });

        this.title = this.root.getByText(name, { exact: true });
        this.description = this.root.locator('.body-small.text-left.text-medium-emphasis').first();
        this.menuButton = this.root.locator(
            '[data-testid^="DB-RunbookModal-runbook-menu-button-"]'
        );
        this.editMenuItem = parent.parent.parent.page.locator(
            '[data-testid^="DB-RunbookModal-runbook-menu-edit-"]'
        );
        this.deleteMenuItem = parent.parent.parent.page.locator(
            '[data-testid^="DB-RunbookModal-runbook-menu-delete-"]'
        );
    }

    public async openMenu() {
        await this.menuButton.click();
    }

    public async open() {
        await this.root.click();
    }

    public async edit() {
        await this.openMenu();
        await this.editMenuItem.click();
    }

    public async delete() {
        await this.openMenu();
        await this.deleteMenuItem.click();
    }
}
