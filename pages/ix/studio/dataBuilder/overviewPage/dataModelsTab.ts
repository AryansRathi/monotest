import { basename } from 'node:path';
import { Locator } from '@playwright/test';
import { OverviewPage } from '../overviewPage';
import { DataModelCard } from './dataModelsTab/dataModelCard';
import { CreateDataModelModal } from './dataModelsTab/createDataModelModal';
import { ImportFromDatabaseModal } from './dataModelsTab/importFromDatabaseModal';
import { ImportFromExportModal } from './dataModelsTab/importFromExportModal';
import { RenameDataModelModal } from './dataModelsTab/renameDataModelModal';
import { TestErDataModel, TestRestDataModel } from 'test/factories/dataModelFactory';
import { TestDataSource } from 'test/factories/dataSourceFactory';

export class DataModelsTab {
    readonly parent: OverviewPage;
    readonly root: Locator;

    readonly createDataModelModal: CreateDataModelModal;
    readonly importFromDatabaseModal: ImportFromDatabaseModal;
    readonly importFromExportModal: ImportFromExportModal;
    readonly renameDataModelModal: RenameDataModelModal;

    readonly searchInput: Locator;
    readonly clearSearchButton: Locator;

    readonly sortBySelect: Locator;
    readonly sortBySelectOption: (option: string) => Locator;

    readonly gridViewButton: Locator;

    readonly importSplitButton: Locator;
    readonly importFromDatabaseMenuItem: Locator;
    readonly importFromExportMenuItem: Locator;

    readonly createDataModelButton: Locator;

    readonly dataModelCard: (name: string) => DataModelCard;

    constructor(parent: OverviewPage) {
        this.parent = parent;
        this.root = parent.root.locator('main.contentWrapper');

        this.createDataModelModal = new CreateDataModelModal(this);
        this.importFromDatabaseModal = new ImportFromDatabaseModal(this);
        this.importFromExportModal = new ImportFromExportModal(this);
        this.renameDataModelModal = new RenameDataModelModal(this);

        this.searchInput = this.root
            .getByTestId('DB-ModelsList-IxOverview-searchbar-IxInput-root')
            .getByPlaceholder('Search');
        this.clearSearchButton = this.root
            .getByTestId('DB-ModelsList-IxOverview-searchbar-IxInput-root')
            .getByRole('button', { name: 'Clear' });

        this.sortBySelect = this.root.getByTestId(
            'DB-ModelsList-IxOverview-sortbutton-IxIconButton-root'
        );
        this.sortBySelectOption = (option: string) =>
            this.parent.page.getByTestId(
                `DB-ModelsList-IxOverview-IxMenu-sort-${option}-IxMenuListItem-root`
            );

        this.gridViewButton = this.root.getByTestId(
            'DB-ModelsList-IxOverview-togglegridview-IxIconButton-root'
        );

        this.importSplitButton = this.root.getByTestId(
            'DB-ModelsList-IxOverview-importsplitbutton-IxSplitButton-OpenMenu'
        );
        this.importFromDatabaseMenuItem = this.parent.page.getByTestId(
            'DB-ModelsList-IxOverview-importsplitbutton-IxSplitButton-importFromDatabase-IxMenuListItem-root'
        );
        this.importFromExportMenuItem = this.parent.page.getByText('Import from Export');

        this.createDataModelButton = this.root.getByTestId(
            'DB-ModelsList-IxOverview-addbutton-IxButton-root'
        );

        this.dataModelCard = (name: string) => new DataModelCard(this, name);
    }

    public async getDataModelCards(): Promise<DataModelCard[]> {
        const elements = await this.root.getByTestId(/IxOverviewCard-Card/).all();
        const cards: DataModelCard[] = [];
        for (const element of elements) {
            const displayName = (
                await element.getByTestId(/IxOverviewCard-Title/).textContent()
            ).trim();
            cards.push(new DataModelCard(this, displayName));
        }
        return cards;
    }

    public async search(query: string) {
        await this.searchInput.fill(query);
    }

    public async sortByNameAscending() {
        await this.sortBySelect.click();
        await this.sortBySelectOption('name_asc').click();
    }

    public async sortByNameDescending() {
        await this.sortBySelect.click();
        await this.sortBySelectOption('name_desc').click();
    }

    public async sortByCreatedNewest() {
        await this.sortBySelect.click();
        await this.sortBySelectOption('created_desc').click();
    }

    public async sortByCreatedOldest() {
        await this.sortBySelect.click();
        await this.sortBySelectOption('created_asc').click();
    }

    public async sortByUpdatedNewest() {
        await this.sortBySelect.click();
        await this.sortBySelectOption('updated_desc').click();
    }

    public async sortByUpdatedOldest() {
        await this.sortBySelect.click();
        await this.sortBySelectOption('updated_asc').click();
    }

    public async createRestDataModel(dataModel: TestRestDataModel) {
        await this.createDataModelButton.click();
        await this.createDataModelModal.restModelTypeButton.click();
        await this.createDataModelModal.technicalNameInput.fill(dataModel.technicalName);
        await this.createDataModelModal.technicalNameInput.blur();
        await this.createDataModelModal.nameInput.fill(dataModel.name);
        await this.createDataModelModal.descriptionInput.fill(dataModel.description);
        await this.createDataModelModal.restDraftBaseUriInput.fill(dataModel.draftUri);
        await this.createDataModelModal.restTestBaseUriInput.fill(dataModel.testUri);
        await this.createDataModelModal.restPreviewBaseUriInput.fill(dataModel.previewUri);
        await this.createDataModelModal.restProductionBaseUriInput.fill(dataModel.productionUri);
        await this.createDataModelModal.submitButton.click();
    }

    public async createErDataModel(dataModel: TestErDataModel) {
        await this.parent.open();
        await this.createDataModelButton.click();
        await this.createDataModelModal.erModelTypeButton.click();
        await this.createDataModelModal.technicalNameInput.fill(dataModel.technicalName);
        await this.createDataModelModal.technicalNameInput.blur();
        await this.createDataModelModal.nameInput.fill(dataModel.name);
        await this.createDataModelModal.descriptionInput.fill(dataModel.description);
        await this.createDataModelModal.submitButton.click();
    }

    public async importFromExport(dataModel: TestErDataModel, filePath: string) {
        await this.importSplitButton.click();
        await this.importFromExportMenuItem.click();

        await this.importFromExportModal.fileInput.setInputFiles(filePath);
        await this.importFromExportModal.technicalNameInput.fill(dataModel.technicalName);
        await this.importFromExportModal.technicalNameInput.blur();
        await this.importFromExportModal.nameInput.fill(dataModel.name);
        await this.importFromExportModal.nameInput.blur();
        await this.importFromExportModal.submitButton.click();
    }

    public async importFromDatabase({
        dataModel,
        dataSource,
        tableNames,
        productionDataSource
    }: {
        dataModel: TestErDataModel;
        dataSource: TestDataSource;
        tableNames?: string[];
        productionDataSource?: TestDataSource;
    }) {
        await this.importSplitButton.click();
        await this.importFromDatabaseMenuItem.click();

        await this.importFromDatabaseModal.sqlSourceTypeButton.click();
        await this.importFromDatabaseModal.importStep1NextButton.click();

        await this.importFromDatabaseModal.sqlTechnicalNameInput.fill(dataModel.technicalName);
        await this.importFromDatabaseModal.sqlTechnicalNameInput.blur();
        await this.importFromDatabaseModal.sqlNameInput.fill(dataModel.name);
        await this.importFromDatabaseModal.sqlDescriptionInput.fill(dataModel.description);
        await this.importFromDatabaseModal.importStep2NextButton.click();

        await this.importFromDatabaseModal.selectDataSources({
            draftDataSource: dataSource,
            productionDataSource: productionDataSource ?? dataSource
        });
        await this.importFromDatabaseModal.importStep3NextButton.click();

        if (tableNames) {
            for (const tableName of tableNames) {
                await this.importFromDatabaseModal.searchTableInput.fill(tableName);
                await this.importFromDatabaseModal.tableCheckbox(tableName).check();
            }
        } else {
            await this.importFromDatabaseModal.importStep4OpenApiSelectAllButton.click();
        }
        await this.importFromDatabaseModal.importStep4SqlFinishButton.click();
    }

    public async importFromOpenApi(
        dataModel: TestRestDataModel,
        filePath: string,
        tableNames?: string[]
    ) {
        await this.importSplitButton.click();
        await this.importFromDatabaseMenuItem.click();

        await this.importFromDatabaseModal.openApiSourceTypeButton.click();
        await this.importFromDatabaseModal.importStep1NextButton.click();
        await this.importFromDatabaseModal.openApiTechnicalNameInput.fill(dataModel.technicalName);
        await this.importFromDatabaseModal.openApiTechnicalNameInput.blur();
        await this.importFromDatabaseModal.openApiNameInput.fill(dataModel.name);
        await this.importFromDatabaseModal.openApiDescriptionInput.fill(dataModel.description);

        await this.importFromDatabaseModal.openApiStep2DraftBaseUri.fill(dataModel.draftUri);
        await this.importFromDatabaseModal.openApiStep2TestBaseUri.fill(dataModel.testUri);
        await this.importFromDatabaseModal.openApiStep2PreviewBaseUri.fill(dataModel.previewUri);
        await this.importFromDatabaseModal.openApiStep2ProductionBaseUri.fill(
            dataModel.productionUri
        );

        await this.importFromDatabaseModal.openApiStep2NextButton.click();

        await this.importFromDatabaseModal.openApiFileInput.setInputFiles(filePath);
        await this.importFromDatabaseModal
            .openApiFileUploadItem(basename(filePath))
            .waitFor({ state: 'visible' });
        await this.importFromDatabaseModal.openApiStep3NextButton.click();

        if (tableNames) {
            for (const tableName of tableNames) {
                await this.importFromDatabaseModal.searchTableInput.fill(tableName);
                await this.importFromDatabaseModal.tableCheckbox(tableName).check();
            }
        } else {
            await this.importFromDatabaseModal.importStep4OpenApiSelectAllButton.click();
        }
        await this.importFromDatabaseModal.importStep4OpenApiFinishButton.click();
    }

    public async downloadExport(dataModel: TestErDataModel) {
        await this.dataModelCard(dataModel.name).export();
        return await this.parent.page.waitForEvent('download');
    }
}
