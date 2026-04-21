import { Locator } from '@playwright/test';
import { Inspector } from '../inspector';
import { CommandForm, type CommandCondition } from './commandsTab/commandForm';

export type DataModelCommand = {
    commandType: 'INSERT' | 'UPDATE' | 'DELETE';
    name: string;
    technicalName: string;
    dataEntityName: string;
    attributeNames?: string[];
    defaultValues?: Record<string, string>;
    description?: string;
    conditions?: CommandCondition[];
};

export class CommandsTab {
    readonly parent: Inspector;
    readonly root: Locator;

    readonly commandForm: CommandForm;

    readonly searchInput: Locator;
    readonly addCommandButton: Locator;

    readonly commandCard: (commandName: string) => Locator;

    constructor(parent: Inspector) {
        this.parent = parent;
        this.root = parent.root.getByTestId('DB-ErCommands-Root');

        this.commandForm = new CommandForm(this);

        this.searchInput = this.root
            .getByTestId('DB-OperationsList-IxInput-Search-IxInput-root')
            .getByRole('textbox');
        this.addCommandButton = this.root.getByTestId(
            'DB-ErCommandList-AddCommand-Button-IxButton-root'
        );

        this.commandCard = (commandName: string) =>
            this.root
                .getByTestId(/DB-OperationsList-IxCard-.*-Selected-IxCard-root/)
                .filter({ hasText: commandName });
    }

    public async open() {
        await this.parent.commandsTabButton.click();
    }

    public async search(query: string) {
        await this.searchInput.fill(query);
    }

    public async createCommand(command: DataModelCommand) {
        await this.addCommandButton.click();
        await this.commandForm.selectCommandType(command.commandType);
        await this.commandForm.nameInput.fill(command.name);
        await this.commandForm.nameInput.blur();
        await this.commandForm.technicalNameInput.fill(command.technicalName);
        if (command.description) {
            await this.commandForm.descriptionInput.fill(command.description);
        }

        await this.commandForm.selectDataEntity(command.dataEntityName);

        if (command.attributeNames) {
            await this.commandForm.selectAttributes(command.attributeNames);
        }

        if (command.conditions) {
            for (const condition of command.conditions) {
                await this.commandForm.addCondition(condition);
            }
        }

        if (command.defaultValues) {
            for (const [attribute, value] of Object.entries(command.defaultValues)) {
                await this.commandForm.defaultValueInput(attribute).fill(value);
            }
        }
        await this.commandForm.submit();
    }

    public async executeCommandWithPreviewModal(
        commandName: string,
        parameters?: Record<string, string>,
        { closeModal = true }: { closeModal?: boolean } = {}
    ) {
        await this.commandCard(commandName).click();
        await this.commandForm.openPreviewButton.click();
        if (parameters) {
            await this.parent.previewModal.setParameters(parameters);
        }
        await this.parent.previewModal.executeButton.click();
        if (closeModal) {
            await this.parent.previewModal.closeButton.click();
        }
    }
}
