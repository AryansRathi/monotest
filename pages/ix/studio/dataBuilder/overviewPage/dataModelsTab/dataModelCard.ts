import { expect, Locator } from '@playwright/test';
import { DataModelsTab } from '../dataModelsTab';

export class DataModelCard {
    readonly parent: DataModelsTab;
    readonly displayName: string;
    readonly root: Locator;

    readonly description: Locator;
    readonly typeChip: Locator;
    readonly stageChip: Locator;
    readonly favoriteButton: Locator;
    readonly menuButton: Locator;
    readonly menuItem: (
        name: 'Rename' | 'Delete' | 'AccessPolicy' | 'Export' | 'ForceUnlock'
    ) => Locator;
    readonly lockIcon: Locator;
    readonly confirmDeleteButton: Locator;
    readonly lastUpdated: Locator;
    readonly created: Locator;
    readonly name: Locator;

    constructor(parent: DataModelsTab, displayName: string) {
        this.parent = parent;
        this.displayName = displayName;

        this.root = this.parent.root.getByTestId(/IxOverviewCard-Card/).filter({
            has: this.parent.parent.page.getByText(displayName, { exact: true })
        });

        this.description = this.root.getByTestId(/IxOverviewCard-Description/);
        this.typeChip = this.root.getByTestId(/IxChip-itemType-IxChip-root/);
        this.stageChip = this.root.getByTestId(/Stage-DRAFT-IxChip-root/);
        this.lockIcon = this.root.getByTestId(/IxChip-lockedBy-IxChip-root/);
        this.favoriteButton = this.root.getByTestId(/favorite-button-IxIconButton-root/);
        this.menuButton = this.root.getByTestId(/menu-button-IxIconButton-root/);
        this.lastUpdated = this.root.getByTestId(/IxOverviewCard-LastUpdated/);
        this.created = this.root.getByTestId(/IxOverviewCard-Created/);
        this.name = this.root.getByTestId(/IxOverviewCard-Title/);

        this.menuItem = (name: 'Rename' | 'Delete' | 'AccessPolicy' | 'Export' | 'ForceUnlock') =>
            this.parent.parent.page.getByTestId(
                `DB-ModelsList-MenuItem-${name}-IxMenuListItem-root`
            );
        this.confirmDeleteButton = this.parent.parent.page.getByTestId(
            'DB-ModelsList-DeleteModal-IxModal-submit-IxButton-root'
        );
    }

    public async open({ forceUnlock = true }: { forceUnlock?: boolean } = {}) {
        // TODO: Remove forceUnlock parameter once the underlying issue is fixed
        // https://intrexx.atlassian.net/browse/IX25-4228
        if (forceUnlock && (await this.lockIcon.isVisible())) {
            const modelName = await this.name.innerText();
            await this.forceUnlock();
            await this.parent.parent.page.reload();
            await this.parent.search(modelName);
        }
        await expect(this.lockIcon).not.toBeVisible();
        await this.root.click();
    }

    public async forceUnlock() {
        await this.menuButton.click();
        await this.menuItem('ForceUnlock').click();
    }

    public async export() {
        await this.menuButton.click();
        await this.menuItem('Export').click();
    }

    public async isFavorite() {
        const classes = await this.favoriteButton.locator('i').getAttribute('class');
        return classes?.includes('material-symbols-filled');
    }
}
