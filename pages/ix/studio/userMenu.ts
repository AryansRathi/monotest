import { Locator } from '@playwright/test';
import { Studio } from '@pages/ix/studio';

export class UserMenu {
    readonly parent: Studio;
    readonly root: Locator;

    readonly appearanceButton: Locator;
    readonly contrastButton: Locator;
    readonly languageButton: Locator;
    readonly logoutButton: Locator;
    readonly settingsButton: Locator;
    readonly themeButton: Locator;
    readonly usernameLabel: Locator;

    constructor(parent: Studio) {
        this.parent = parent;
        this.root = parent.page.getByTestId('IS-StudioProfile-Profile-root-IxMenu-root');

        this.appearanceButton = this.root.getByTestId(
            'IS-StudioProfile-Profile-Appearance-IxMenuListItem-root'
        );
        this.contrastButton = this.root.getByTestId(
            'IS-StudioProfile-Profile-Contrast-IxMenuListItem-root'
        );
        this.languageButton = this.root.getByTestId(
            'IS-StudioProfile-Profile-language-IxMenuListItem-root'
        );
        this.logoutButton = this.root.getByTestId(
            'IS-StudioProfile-Profile-logout-IxMenuListItem-root'
        );
        this.settingsButton = this.root.getByTestId(
            'IS-StudioProfile-Profile-settings-IxMenuListItem-root'
        );
        this.themeButton = this.root.getByTestId(
            'IS-StudioProfile-Profile-theme-IxMenuListItem-root'
        );
        this.usernameLabel = this.root.locator('div.account-info-username');
    }

    public async open() {
        await this.parent.userMenuButton.click();
    }
}
