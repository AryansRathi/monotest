import { Locator } from '@playwright/test';
import { DataModelsTab } from '../dataModelsTab';

export class CreateDataModelModal {
    readonly parent: DataModelsTab;
    readonly root: Locator;

    readonly erModelTypeButton: Locator;
    readonly restModelTypeButton: Locator;

    readonly nameInput: Locator;
    readonly technicalNameInput: Locator;
    readonly descriptionInput: Locator;

    readonly restDraftBaseUriInput: Locator;
    readonly restTestBaseUriInput: Locator;
    readonly restPreviewBaseUriInput: Locator;
    readonly restProductionBaseUriInput: Locator;

    readonly submitButton: Locator;

    constructor(parent: DataModelsTab) {
        this.parent = parent;
        this.root = parent.parent.page.locator('div.v-overlay__content', {
            hasText: 'Create Data Model'
        });

        this.erModelTypeButton = this.root.getByTestId(
            'DB-CreateModel-ModelType-IxButton-ER-IxButton-root'
        );
        this.restModelTypeButton = this.root.getByTestId(
            'DB-CreateModel-ModelType-IxButton-REST-IxButton-root'
        );

        this.nameInput = this.root
            .getByTestId('DB-CreateModel-DataModelName-IxInput-root')
            .getByRole('textbox');
        this.technicalNameInput = this.root
            .getByTestId('DB-CreateModel-DataModelId-IxInput-root')
            .getByRole('textbox');
        this.descriptionInput = this.root
            .getByTestId('DB-CreateModel-DataModelDescription-IxTextArea-root')
            .locator('textarea');

        this.restDraftBaseUriInput = this.root
            .getByTestId('DB-StagedBaseURIVue-DraftBaseUri-IxInput-root')
            .getByRole('textbox');
        this.restTestBaseUriInput = this.root
            .getByTestId('DB-StagedBaseURIVue-TestBaseUri-IxInput-root')
            .getByRole('textbox');
        this.restPreviewBaseUriInput = this.root
            .getByTestId('DB-StagedBaseURIVue-PreviewBaseUri-IxInput-root')
            .getByRole('textbox');
        this.restProductionBaseUriInput = this.root
            .getByTestId('DB-StagedBaseURIVue-ProductionBaseUri-IxInput-root')
            .getByRole('textbox');

        this.submitButton = this.root.getByTestId('DB-CreateModel-Create-IxButton-root');
    }
}
