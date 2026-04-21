import { Locator } from '@playwright/test';
import { DataModelsTab } from '../dataModelsTab';
import { TestDataSource } from 'test/factories/dataSourceFactory';

export class ImportFromDatabaseModal {
    readonly parent: DataModelsTab;
    readonly root: Locator;

    readonly importStep1NextButton: Locator;
    readonly sqlSourceTypeButton: Locator;
    readonly openApiSourceTypeButton: Locator;

    readonly openApiFileInput: Locator;
    readonly openApiFileUploadItem: (fileName: string) => Locator;
    readonly openApiStep2NextButton: Locator;
    readonly openApiStep3NextButton: Locator;
    readonly productionBaseUriInput: Locator;
    readonly openApiStep4FinishButton: Locator;

    readonly draftDataSourceSelect: Locator;
    readonly draftDataSourceSelectItem: (technicalName: string) => Locator;
    readonly testDataSourceSelect: Locator;
    readonly testDataSourceSelectItem: (technicalName: string) => Locator;
    readonly previewDataSourceSelect: Locator;
    readonly previewDataSourceSelectItem: (technicalName: string) => Locator;
    readonly productionDataSourceSelect: Locator;
    readonly productionDataSourceSelectItem: (technicalName: string) => Locator;

    readonly importStep2NextButton: Locator;
    readonly importStep4OpenApiSelectAllButton: Locator;
    readonly searchTableInput: Locator;
    readonly tableCheckbox: (tableName: string) => Locator;
    readonly importStep3NextButton: Locator;

    readonly openApiNameInput: Locator;
    readonly openApiTechnicalNameInput: Locator;
    readonly openApiDescriptionInput: Locator;

    readonly sqlDescriptionInput: Locator;
    readonly sqlTechnicalNameInput: Locator;
    readonly sqlNameInput: Locator;

    readonly importStep4SqlFinishButton: Locator;
    readonly importStep4OpenApiFinishButton: Locator;

    readonly openApiStep2DraftBaseUri: Locator;
    readonly openApiStep2TestBaseUri: Locator;
    readonly openApiStep2PreviewBaseUri: Locator;
    readonly openApiStep2ProductionBaseUri: Locator;

    constructor(parent: DataModelsTab) {
        this.parent = parent;
        this.root = parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Import Model'
        });

        this.importStep1NextButton = this.root.getByTestId(
            'DB-ModelsList-ImportModal-IxStepperModal-next-IxButton-root'
        );
        this.sqlSourceTypeButton = this.root.getByTestId('DB-ImportStep1Type-SQL-SourceType');
        this.openApiSourceTypeButton = this.root.getByTestId(
            'DB-ImportStep1Type-OpenAPI-SourceType'
        );

        this.openApiFileInput = this.root
            .getByTestId('DB-ImportStep3OpenAPIImport-v-file-input-Input')
            .locator('input[type="file"]');
        this.openApiFileUploadItem = (fileName: string) =>
            this.root.getByTestId(`DB-ImportStep3OpenAPIImport-v-file-upload-item-${fileName}`);
        this.openApiStep2NextButton = this.root.getByTestId(
            'DB-ModelsList-ImportModal-IxStepperModal-next-IxButton-root'
        );
        this.openApiStep3NextButton = this.root.getByTestId(
            'DB-ImportStep3OpenAPIImport-Next-IxButton-root'
        );
        this.openApiNameInput = this.root
            .getByTestId('DB-ImportStep2OpenAPIDetails-DataModelName-IxInput-root')
            .getByRole('textbox');
        this.openApiTechnicalNameInput = this.root
            .getByTestId('DB-ImportStep2OpenAPIDetails-DataModelId-IxInput-root')
            .getByRole('textbox');
        this.openApiDescriptionInput = this.root
            .getByTestId('DB-ImportStep2OpenAPIDetails-DataModelDescription-IxTextArea-root')
            .locator('textarea');
        this.productionBaseUriInput = this.root.locator('#DB-StagedBaseURIVue-ProductionBaseUri');
        this.openApiStep4FinishButton = this.root.getByTestId(
            'DB-ImportStep4OpenAPIDetails-Finish-IxButton-root'
        );

        this.draftDataSourceSelect = this.root
            .getByTestId('DB-StagedDatasourceVue-DraftDataSource-IxSelect-root')
            .locator('.v-field__input');
        this.draftDataSourceSelectItem = (technicalName: string) =>
            this.parent.parent.page
                .getByTestId(new RegExp(`DraftDataSource-IxSelect-item-.*_1000000`))
                .filter({ hasText: technicalName });
        this.testDataSourceSelect = this.root
            .getByTestId('DB-StagedDatasourceVue-TestDataSource-IxSelect-root')
            .locator('.v-field__input');
        this.testDataSourceSelectItem = (technicalName: string) =>
            this.parent.parent.page
                .getByTestId(new RegExp(`TestDataSource-IxSelect-item-.*_1000000`))
                .filter({ hasText: technicalName });
        this.previewDataSourceSelect = this.root
            .getByTestId('DB-StagedDatasourceVue-PreviewDataSource-IxSelect-root')
            .locator('.v-field__input');
        this.previewDataSourceSelectItem = (technicalName: string) =>
            this.parent.parent.page
                .getByTestId(new RegExp(`PreviewDataSource-IxSelect-item-.*_1000000`))
                .filter({ hasText: technicalName });
        this.productionDataSourceSelect = this.root
            .getByTestId('DB-StagedDatasourceVue-ProductionDataSource-IxSelect-root')
            .locator('.v-field__input');
        this.productionDataSourceSelectItem = (technicalName: string) =>
            this.parent.parent.page
                .getByTestId(new RegExp(`ProductionDataSource-IxSelect-item-.*_1000000`))
                .filter({ hasText: technicalName });

        this.importStep2NextButton = this.root.getByTestId(
            'DB-ModelsList-ImportModal-IxStepperModal-next-IxButton-root'
        );
        this.importStep4OpenApiSelectAllButton = this.root.getByTestId(
            'DB-ImportStep4OpenAPISelect-SelectAll-IxButton-root'
        );
        this.searchTableInput = this.root
            .getByTestId('DB-ReImportModal-SearchInput-IxInput-root')
            .getByRole('textbox');
        this.tableCheckbox = (tableName: string) =>
            this.root
                .getByTestId(/DB-ImportStep4(SQL|OpenAPI)Select-Tree-IxTree-child-/)
                .filter({ hasText: tableName })
                .locator('..')
                .getByRole('checkbox');
        this.importStep3NextButton = this.root.getByTestId(
            'DB-ImportStep3SQLImport-HiddenForm-Next-IxButton-root'
        );
        this.sqlNameInput = this.root
            .getByTestId('DB-ImportStep2SQLDetails-DataModelName-IxInput-root')
            .getByRole('textbox');
        this.sqlTechnicalNameInput = this.root
            .getByTestId('DB-ImportStep2SQLDetails-DataModelId-IxInput-root')
            .getByRole('textbox');
        this.sqlDescriptionInput = this.root
            .getByTestId('DB-ImportStep2SQLDetails-DataModelDescription-IxTextArea-root')
            .locator('textarea');

        this.importStep4SqlFinishButton = this.root.getByTestId(
            'DB-ImportStep4SQLSelect-Finish-IxButton-root'
        );
        this.importStep4OpenApiFinishButton = this.root.getByTestId(
            'DB-ImportStep4OpenAPISelect-Finish-IxButton-root'
        );

        this.openApiStep2DraftBaseUri = this.root
            .getByTestId('DB-StagedBaseURIVue-DraftBaseUri-IxInput-root')
            .getByRole('textbox');
        this.openApiStep2TestBaseUri = this.root
            .getByTestId('DB-StagedBaseURIVue-TestBaseUri-IxInput-root')
            .getByRole('textbox');
        this.openApiStep2PreviewBaseUri = this.root
            .getByTestId('DB-StagedBaseURIVue-PreviewBaseUri-IxInput-root')
            .getByRole('textbox');
        this.openApiStep2ProductionBaseUri = this.root
            .getByTestId('DB-StagedBaseURIVue-ProductionBaseUri-IxInput-root')
            .getByRole('textbox');
    }

    public async selectDataSources({
        draftDataSource,
        testDataSource,
        previewDataSource,
        productionDataSource
    }: {
        draftDataSource: TestDataSource;
        testDataSource?: TestDataSource;
        previewDataSource?: TestDataSource;
        productionDataSource?: TestDataSource;
    }) {
        await this.draftDataSourceSelect.click();

        await this.draftDataSourceSelectItem(draftDataSource.technicalName).click();

        await this.testDataSourceSelect.click();
        await this.testDataSourceSelectItem(
            testDataSource?.technicalName ?? draftDataSource.technicalName
        ).click();

        await this.previewDataSourceSelect.click();
        await this.previewDataSourceSelectItem(
            previewDataSource?.technicalName ?? draftDataSource.technicalName
        ).click();

        await this.productionDataSourceSelect.click();
        await this.productionDataSourceSelectItem(
            productionDataSource?.technicalName ?? draftDataSource.technicalName
        ).click();
    }
}
