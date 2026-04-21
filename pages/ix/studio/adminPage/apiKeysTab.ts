import type { Locator } from '@playwright/test';
import { AdminPage } from '../adminPage';
import { NewApiKeyGeneratedModal } from './apiKeysTab/newApiKeyGeneratedModal';
import { TestApiKey } from '../../../../factories/adminFactory';
import { DeleteApiKeyModal } from './apiKeysTab/deleteApiKeyModal';
import { CreateApiKeyModal } from './apiKeysTab/createApiKeyModal';
import { RegenerateApiKeyModal } from './apiKeysTab/regenerateApiKeyModal';

export class ApiKeysTab {
    readonly parent: AdminPage;
    readonly root: Locator;

    readonly createApiKeyButton: Locator;
    readonly searchInput: Locator;

    readonly apiKeysTable: Locator;
    readonly apiKeyRow: (keyName: string) => Locator;
    readonly apiKeyStatusBadge: (keyName: string) => Locator;
    readonly apiKeyMenuButton: (keyName: string) => Locator;
    readonly apiKeyMenuRoot: Locator;
    readonly apiKeyMenuEditItem: Locator;
    readonly apiKeyMenuRegenerateItem: Locator;
    readonly apiKeyMenuActivateItem: Locator;
    readonly apiKeyMenuDeactivateItem: Locator;
    readonly apiKeyMenuDeleteItem: Locator;

    readonly newApiKeyGeneratedModal: NewApiKeyGeneratedModal;
    readonly createAPIKeyModal: CreateApiKeyModal;
    readonly deleteApiKeyModal: DeleteApiKeyModal;
    readonly regenerateApiKeyModal: RegenerateApiKeyModal;

    constructor(parent: AdminPage) {
        this.parent = parent;
        this.root = parent.root;

        this.createApiKeyButton = this.root.getByTestId('IS-ApiKeysView-Create-IxButton-root');
        this.searchInput = this.root
            .getByTestId('IS-ApiKeysView-Search-IxInput-root')
            .getByRole('textbox');

        this.apiKeysTable = this.root.getByTestId('IS-ApiKeysView-DataTable-IxDataTable-root');
        this.apiKeyRow = (keyName: string) =>
            this.apiKeysTable
                .locator('tr')
                .filter({ has: this.parent.parent.page.locator('td', { hasText: keyName }) });
        this.apiKeyStatusBadge = (keyName: string) =>
            this.apiKeyRow(keyName).getByTestId('IS-ApiKeysView-Status-IxChip-root');
        this.apiKeyMenuButton = (keyName: string) =>
            this.apiKeyRow(keyName).getByTestId('IS-ApiKeysView-Actions-Button-IxIconButton-root');
        this.apiKeyMenuRoot = this.parent.parent.page.getByTestId(
            'IS-ApiKeysView-Actions-IxMenu-root'
        );
        this.apiKeyMenuEditItem = this.apiKeyMenuRoot.getByTestId(
            'IS-ApiKeysView-Actions-Edit-IxMenuListItem-root'
        );
        this.apiKeyMenuRegenerateItem = this.apiKeyMenuRoot.getByTestId(
            'IS-ApiKeysView-Actions-Regenerate-IxMenuListItem-root'
        );
        this.apiKeyMenuActivateItem = this.apiKeyMenuRoot.getByTestId(
            'IS-CredentialsView-Actions-Activate-IxMenuListItem-root'
        );
        this.apiKeyMenuDeactivateItem = this.apiKeyMenuRoot.getByTestId(
            'IS-CredentialsView-Actions-Deactivate-IxMenuListItem-root'
        );
        this.apiKeyMenuDeleteItem = this.apiKeyMenuRoot.getByTestId(
            'IS-ApiKeysView-Actions-Delete-IxMenuListItem-root'
        );

        this.newApiKeyGeneratedModal = new NewApiKeyGeneratedModal(this);
        this.createAPIKeyModal = new CreateApiKeyModal(this);
        this.deleteApiKeyModal = new DeleteApiKeyModal(this);
        this.regenerateApiKeyModal = new RegenerateApiKeyModal(this);
    }

    public async open() {
        await this.parent.sidebar.apiKeysTabButton.click();
    }

    public async regenerateApiKey(keyName: string): Promise<string> {
        await this.apiKeyMenuButton(keyName).click();
        await this.apiKeyMenuRegenerateItem.click();
        await this.regenerateApiKeyModal.okayButton.click();
        const newApiKey = await this.newApiKeyGeneratedModal.getApiKey();
        await this.newApiKeyGeneratedModal.okayButton.click();
        return newApiKey;
    }

    public async createApiKey(apiKey: TestApiKey): Promise<string> {
        await this.createApiKeyButton.click();
        await this.createAPIKeyModal.apiKeyNameInput.fill(apiKey.name);
        await this.createAPIKeyModal.apiKeyIDInput.fill(apiKey.id);
        await this.createAPIKeyModal.okayButton.click();
        const newApiKey = this.newApiKeyGeneratedModal.getApiKey();
        await this.newApiKeyGeneratedModal.okayButton.click();
        return newApiKey;
    }

    public async activateApiKey(keyName: string) {
        await this.apiKeyMenuButton(keyName).click();
        await this.apiKeyMenuActivateItem.click();
    }

    public async deactivateApiKey(keyName: string) {
        await this.apiKeyMenuButton(keyName).click();
        await this.apiKeyMenuDeactivateItem.click();
    }

    public async deleteApiKey(keyName: string) {
        await this.apiKeyMenuButton(keyName).click();
        await this.apiKeyMenuDeleteItem.click();
        await this.deleteApiKeyModal.deleteButton.click();
    }
}
