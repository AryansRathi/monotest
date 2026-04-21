import { Locator } from '@playwright/test';
import { WorkbenchPage } from '../workbenchPage';
import { CanvasToolbar } from './canvas/canvasToolbar';
import { AutoGenerateAllOperationsModal } from './canvas/autoGenerateAllOperationsModal';
import { EntityCard } from './canvas/entityCard';

export class Canvas {
    readonly parent: WorkbenchPage;
    readonly root: Locator;

    readonly toolbar: CanvasToolbar;
    readonly autoGenerateAllOperationsModal: AutoGenerateAllOperationsModal;

    readonly databaseSyncStatusChip: Locator;
    readonly syncToDatabaseButton: Locator;

    readonly entityCard: (technicalName: string) => EntityCard;

    readonly minimap: Locator;
    readonly minimapToggle: Locator;
    readonly fitViewButton: Locator;

    readonly connectionLine: Locator;
    readonly connectionHandle: (attributeTechnicalName: string, side: 'left' | 'right') => Locator;

    constructor(parent: WorkbenchPage) {
        this.parent = parent;
        this.root = parent.root.getByTestId('DB-CanvasContainer-Root');

        this.toolbar = new CanvasToolbar(this);
        this.autoGenerateAllOperationsModal = new AutoGenerateAllOperationsModal(this);

        this.databaseSyncStatusChip = this.root.getByTestId(
            'DB-CanvasContainer-Chip-SyncToDatabase-IxChip-root'
        );
        this.syncToDatabaseButton = this.root.getByTestId(
            'DB-CanvasContainer-IxIconButton-SyncToDatabase-IxIconButton-root'
        );

        this.entityCard = (technicalName: string) => new EntityCard(this, technicalName);

        this.minimap = this.root.locator('div.minimap-wrapper');
        this.minimapToggle = this.root.getByTestId('DB-Minimap-ToggleNavigator-IxIconButton-root');
        this.fitViewButton = this.root.getByTestId('DB-Minimap-FitView-IxIconButton-root');

        this.connectionLine = this.root.locator('.vue-flow__edge-entity-relationship');
    }

    public async showMinimap() {
        if (!(await this.minimap.isVisible())) {
            await this.minimapToggle.click();
        }
    }

    public async hideMinimap() {
        if (await this.minimap.isVisible()) {
            await this.minimapToggle.click();
        }
    }
}
