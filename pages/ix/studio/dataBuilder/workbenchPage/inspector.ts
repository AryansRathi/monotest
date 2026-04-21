import { Locator } from '@playwright/test';
import { CommandsTab } from './inspector/commandsTab';
import { PropertiesTab } from './inspector/propertiesTab';
import { QueriesTab } from './inspector/queriesTab';
import { WorkbenchPage } from '../workbenchPage';
import { PreviewModal } from './inspector/previewModal';

export class Inspector {
    readonly parent: WorkbenchPage;
    readonly root: Locator;

    readonly previewModal: PreviewModal;

    readonly propertiesTab: PropertiesTab;
    readonly propertiesTabButton: Locator;
    readonly queriesTab: QueriesTab;
    readonly queriesTabButton: Locator;
    readonly commandsTab: CommandsTab;
    readonly commandsTabButton: Locator;

    constructor(parent: WorkbenchPage) {
        this.parent = parent;
        this.root = parent.root.locator(
            'div:has(> div[data-testid="DB-ERInspector-TabBar-IxTabBar-root"])'
        );

        this.previewModal = new PreviewModal(this);

        this.propertiesTab = new PropertiesTab(this);
        this.propertiesTabButton = this.root.getByTestId(
            'DB-ERInspector-properties-tab-IxTabButton-root'
        );
        this.queriesTab = new QueriesTab(this);
        this.queriesTabButton = this.root.getByTestId(
            'DB-ERInspector-queries-tab-IxTabButton-root'
        );
        this.commandsTab = new CommandsTab(this);
        this.commandsTabButton = this.root.getByTestId(
            'DB-ERInspector-commands-tab-IxTabButton-root'
        );
    }
}
