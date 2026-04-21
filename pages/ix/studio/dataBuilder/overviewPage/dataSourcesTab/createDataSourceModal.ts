import { Locator } from '@playwright/test';
import { DataSourcesTab } from '../dataSourcesTab';
import { scrollUntilVisible } from '../../../../../../utils/playwright';

export class CreateDataSourceModal {
    readonly parent: DataSourcesTab;
    readonly root: Locator;

    readonly nameInput: Locator;
    readonly technicalNameInput: Locator;
    readonly descriptionInput: Locator;

    readonly postgreSQLSourceItem: Locator;
    readonly sqlServerSourceItem: Locator;

    readonly hostInput: Locator;
    readonly databaseInput: Locator;
    readonly credentialSelect: Locator;
    readonly credentialSelectItem: (credentialName: string) => Locator;
    readonly encryptionSelect: Locator;
    readonly encryptionSelectItem: (encryptionOption: 'none' | 'ssl+trust' | 'ssl') => Locator;
    readonly credentialTestButton: Locator;
    readonly credentialApplyButton: Locator;

    readonly nextButton: Locator;

    constructor(parent: DataSourcesTab) {
        this.parent = parent;
        this.root = parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Create Data Source'
        });

        this.nameInput = this.root
            .getByTestId('DB-CommonPage-Name-IxInput-root')
            .getByRole('textbox');
        this.technicalNameInput = this.root
            .getByTestId('DB-CommonPage-TechnicalName-IxInput-root')
            .getByRole('textbox');
        this.descriptionInput = this.root
            .getByTestId('DB-CommonPage-Description-IxTextArea-root')
            .locator('textarea');

        this.postgreSQLSourceItem = this.root.getByTestId('DB-TypePage-SourceItem-PostgreSQL');
        this.sqlServerSourceItem = this.root.getByTestId('DB-TypePage-SourceItem-SQL Server');

        this.hostInput = this.root
            .getByTestId(/DB-(Pg|MsSql)Page-Host-IxInput-root/)
            .getByRole('textbox');
        this.databaseInput = this.root
            .getByTestId(/DB-(Pg|MsSql)Page-Database-IxInput-root/)
            .getByRole('textbox');
        this.credentialSelect = this.root.getByTestId(/DB-(Pg|MsSql)Page-credential-IxSelect-root/);
        this.credentialSelectItem = (credentialName: string) =>
            this.parent.parent.page
                .locator('.v-overlay__content.ix-list')
                .getByText(credentialName);
        this.credentialTestButton = this.root.getByTestId('DB-ConnectPage-Test-IxButton-root');
        this.credentialApplyButton = this.root.getByTestId('DB-ConnectPage-Apply-IxButton-root');
        this.encryptionSelect = this.root.getByTestId(
            /DB-(Pg|MsSql)Page-Select-Encryption-IxSelect-root/
        );
        this.encryptionSelectItem = (encryptionOption: 'none' | 'ssl+trust' | 'ssl') =>
            this.parent.parent.page.locator(
                `[data-testid$="Page-Select-Encryption-IxSelect-item-${encryptionOption}"]`
            );

        this.nextButton = this.root.getByTestId(
            'DB-SourcesList-CreateModal-IxStepperModal-next-IxButton-root'
        );
    }

    public async selectCredential(credentialName: string) {
        await this.credentialSelect.click();
        await scrollUntilVisible(
            this.credentialSelectItem(credentialName),
            this.parent.parent.page.locator('.v-overlay__content.ix-list')
        );
        await this.credentialSelectItem(credentialName).click();
    }
}
