import { Locator } from '@playwright/test';
import { Studio } from '@pages/ix/studio';

export class TasksPage {
    readonly parent: Studio;
    readonly root: Locator;

    readonly searchInput: Locator;

    constructor(parent: Studio) {
        this.parent = parent;
        this.root = parent.root.locator('main.v-main');

        this.searchInput = this.root
            .getByTestId('IS-TasksList-Search-IxInput-root')
            .getByRole('textbox');
    }

    public async open() {
        await this.parent.navRail.tasksButton.click();
    }

    public async searchForTask(taskName: string) {
        await this.searchInput.fill(taskName);
    }
}
