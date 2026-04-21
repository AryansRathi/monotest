import { Locator } from '@playwright/test';
import { OverviewPage } from '../overviewPage';
import { TestExternalDataSource } from 'test/factories/dataSourceFactory';
import { TestUsernamePasswordCredential } from 'test/factories/adminFactory';
import { CreateDataSourceModal } from './dataSourcesTab/createDataSourceModal';

export class DataSourcesTab {
    readonly parent: OverviewPage;
    readonly root: Locator;

    readonly createDataSourceModal: CreateDataSourceModal;

    readonly searchInput: Locator;
    readonly createDataSourceButton: Locator;

    readonly dataSourceStageChip: (dataSourceName: string) => Locator;

    constructor(parent: OverviewPage) {
        this.parent = parent;
        this.root = parent.root.locator('main.contentWrapper');

        this.createDataSourceModal = new CreateDataSourceModal(this);

        this.searchInput = this.root
            .getByTestId('DB-ModelsList-IxOverview-searchbar-IxInput-root')
            .getByRole('textbox');
        this.createDataSourceButton = this.root.getByTestId(
            'DB-SourcesList-Overview-IxOverview-addbutton-IxButton-root'
        );

        this.dataSourceStageChip = (dataSourceTechnicalName: string) => {
            return this.root.getByTestId(
                `DB-SourcesList-ListRow-${dataSourceTechnicalName}-Stage-IxChip-root`
            );
        };
    }

    public async open() {
        await this.parent.dataSourcesTabButton.click();
    }

    public async createExternalDataSource(
        dataSource: TestExternalDataSource,
        credential: TestUsernamePasswordCredential
    ) {
        await this.createDataSourceButton.click();
        await this.createDataSourceModal.nameInput.fill(dataSource.name);
        await this.createDataSourceModal.nameInput.blur();
        await this.createDataSourceModal.technicalNameInput.fill(dataSource.technicalName);
        await this.createDataSourceModal.descriptionInput.fill(dataSource.description);
        await this.createDataSourceModal.nextButton.click();

        if (dataSource.type === 'postgres') {
            await this.createDataSourceModal.postgreSQLSourceItem.click();
        } else if (dataSource.type === 'sqlserver') {
            await this.createDataSourceModal.sqlServerSourceItem.click();
        }
        await this.createDataSourceModal.nextButton.click();

        await this.createDataSourceModal.hostInput.fill(dataSource.host);
        await this.createDataSourceModal.databaseInput.fill(dataSource.database);
        if (dataSource.type === 'sqlserver') {
            await this.createDataSourceModal.encryptionSelect.click();
            await this.createDataSourceModal.encryptionSelectItem('none').click();
        }
        await this.createDataSourceModal.selectCredential(credential.name);
        await this.createDataSourceModal.credentialTestButton.click();
        await this.createDataSourceModal.credentialApplyButton.click();
    }
}
