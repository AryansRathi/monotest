import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';

export class TenantSettingsTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly tenantIdInput: Locator;
    readonly adminEmailInput: Locator;
    readonly supportEmailInput: Locator;
    readonly phoneInput: Locator;
    readonly websiteInput: Locator;
    readonly addressInput: Locator;
    readonly resetButton: Locator;
    readonly applyButton: Locator;
    readonly homeIntroInput: Locator;
    readonly homeTaglineInput: Locator;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root;

        this.nameInput = this.root
            .getByTestId('IS-TenantGeneral-Name-IxInput-root')
            .getByRole('textbox');
        this.tenantIdInput = this.root
            .getByTestId('IS-TenantGeneral-TenantId-IxInput-root')
            .getByRole('textbox');
        this.adminEmailInput = this.root
            .getByTestId('IS-TenantGeneral-AdminEmail-IxInput-root')
            .getByRole('textbox');
        this.supportEmailInput = this.root
            .getByTestId('IS-TenantGeneral-SupportEmail-IxInput-root')
            .getByRole('textbox');
        this.phoneInput = this.root
            .getByTestId('IS-TenantGeneral-Phone-IxInput-root')
            .getByRole('textbox');
        this.websiteInput = this.root
            .getByTestId('IS-TenantGeneral-Website-IxInput-root')
            .getByRole('textbox');
        this.addressInput = this.root
            .getByTestId('IS-TenantGeneral-Address-IxInput-root')
            .getByRole('textbox');
        this.homeIntroInput = this.root
            .getByTestId('IS-TenantGeneral-HomeIntro-IxInput-root')
            .getByRole('textbox');
        this.homeTaglineInput = this.root
            .getByTestId('IS-TenantGeneral-HomeTagline-IxInput-root')
            .getByRole('textbox');

        this.resetButton = this.root.getByTestId('IS-TenantGeneral-Reset-IxButton-root');
        this.applyButton = this.root.getByTestId('IS-TenantGeneral-Apply-IxButton-root');
    }

    public async open() {
        await this.parent.sidebar.tenantSettingsTabButton.click();
    }
}
