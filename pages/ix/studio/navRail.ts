import { Locator } from '@playwright/test';
import { Studio } from '@pages/ix/studio';

export class NavRail {
    readonly parent: Studio;
    readonly root: Locator;

    readonly homeButton: Locator;
    readonly appsButton: Locator;
    readonly processesButton: Locator;
    readonly dataButton: Locator;
    readonly tasksButton: Locator;
    readonly filesButton: Locator;
    readonly adminButton: Locator;

    constructor(parent: Studio) {
        this.parent = parent;
        this.root = parent.root.getByTestId('IS-StudioNavigationRail-List-IxList-root');

        this.homeButton = this.root.getByTestId(
            'IS-StudioNavigationRail-ListItem-Home-IxListItem-root'
        );
        this.appsButton = this.root.getByTestId(
            'IS-StudioNavigationRail-ListItem-AppBuilder-IxListItem-root'
        );
        this.processesButton = this.root.getByTestId(
            'IS-StudioNavigationRail-ListItem-ProcessBuilder-IxListItem-root'
        );
        this.dataButton = this.root.getByTestId(
            'IS-StudioNavigationRail-ListItem-DataBuilder-IxListItem-root'
        );
        this.tasksButton = this.root.getByTestId(
            'IS-StudioNavigationRail-ListItem-Tasks-IxListItem-root'
        );
        this.filesButton = this.root.getByTestId(
            'IS-StudioNavigationRail-ListItem-FileStorage-IxListItem-root'
        );
        this.adminButton = this.root.getByTestId(
            'IS-StudioNavigationRail-ListItem-Admin-IxListItem-root'
        );
    }
}
