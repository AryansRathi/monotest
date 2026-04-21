import { Locator } from '@playwright/test';
import { Explorer } from '../explorer';
import { CreateNewEntityModal } from './dataExplorerTab/createNewEntityModal';
import { TestDataModelEntity } from 'test/factories/dataModelFactory';

export class DataExplorerTab {
    readonly parent: Explorer;
    readonly root: Locator;

    readonly createNewEntityModal: CreateNewEntityModal;

    readonly searchInput: Locator;
    readonly addEntityButton: Locator;
    readonly deleteEntityButton: (technicalName: string) => Locator;
    readonly deleteEntityConfirmButton: Locator;

    readonly dataEntityTreeItem: (name: string) => Locator;
    readonly dataEntityTreeItemExpandToggle: (name: string) => Locator;
    readonly dataEntityTreeItemLabel: (name: string) => Locator;
    readonly dataEntityTreeItemDeleteButton: (name: string) => Locator;

    constructor(parent: Explorer) {
        this.parent = parent;
        this.root = parent.root.getByTestId('DB-ExplorerView-TabWindow-IxTabWindow-root');

        this.createNewEntityModal = new CreateNewEntityModal(this);

        this.searchInput = this.root
            .getByTestId('DB-ExplorerHeader-SearchInput-IxInput-root')
            .locator('input');
        this.addEntityButton = this.root.getByTestId(
            'DB-EditorView-IxIconButton-NewElement-IxButton-root'
        );

        this.dataEntityTreeItem = (name: string) =>
            this.root.locator(
                `div.tree-item:has([data-testid*="DB-ExplorerContent-IxTree-child-"])`,
                { hasText: name }
            );
        this.dataEntityTreeItemExpandToggle = (name: string) =>
            this.dataEntityTreeItem(name).locator(
                'i[data-testid*="DB-ExplorerContent-IxTree-expand-"]'
            );
        this.dataEntityTreeItemLabel = (name: string) =>
            this.dataEntityTreeItem(name).locator(
                'span[data-testid*="DB-ExplorerContent-IxTree-child-"]'
            );
        this.dataEntityTreeItemDeleteButton = (name: string) =>
            this.dataEntityTreeItem(name).getByTestId(
                `DB-ExplorerContent-Delete-${name}-IxIconButton-root`
            );
        this.deleteEntityConfirmButton = this.parent.parent.page.getByTestId(
            'DB-ExplorerContent-DeleteModal-IxModal-submit-IxButton-root'
        );
    }

    public async createEntity(entity: TestDataModelEntity) {
        await this.addEntityButton.click();
        await this.createNewEntityModal.technicalNameInput.fill(entity.technicalName);
        await this.createNewEntityModal.technicalNameInput.blur();
        await this.createNewEntityModal.nameInput.fill(entity.name);
        await this.createNewEntityModal.descriptionTextArea.fill(entity.description);
        for (const attr of entity.attributes) {
            await this.createNewEntityModal.addAttribute(
                attr.name,
                attr.technicalName,
                attr.dataType,
                attr.size ?? 0,
                attr.isNullable,
                attr.isPrimaryKey,
                attr.scale
            );
        }

        await this.createNewEntityModal.submitButton.click();
    }

    public async deleteEntity(name: string) {
        await this.dataEntityTreeItemDeleteButton(name).click();
        await this.deleteEntityConfirmButton.click();
    }

    public async dataEntityTreeItemIsExpanded(name: string) {
        return await this.dataEntityTreeItemExpandToggle(name)
            .getAttribute('class')
            .then((cls) => cls?.includes('expanded'));
    }

    public async expandDataEntityTreeItem(name: string) {
        if (!(await this.dataEntityTreeItemIsExpanded(name))) {
            await this.dataEntityTreeItemExpandToggle(name).click();
        }
    }

    public async collapseDataEntityTreeItem(name: string) {
        if (await this.dataEntityTreeItemIsExpanded(name)) {
            await this.dataEntityTreeItemExpandToggle(name).click();
        }
    }

    public async dataEntityTreeItemIsSelected(name: string) {
        return await this.dataEntityTreeItemExpandToggle(name)
            .getAttribute('class')
            .then((cls) => cls?.includes('activated'));
    }
}
