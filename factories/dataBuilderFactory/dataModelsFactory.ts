import { faker } from '@faker-js/faker';
import { getNextUniqueId } from '../UniqueId';

export interface TestErDataModel {
    type: 'ER';
    name: string;
    technicalName: string;
    description: string;
}

export interface TestRestDataModel {
    type: 'REST';
    name: string;
    technicalName: string;
    description: string;
    draftUri: string;
    testUri: string;
    previewUri: string;
    productionUri: string;
}

export interface TestDataEntityAttribute {
    name: string;
    technicalName: string;
    description: string;
    dataType:
        | 'char'
        | 'varchar'
        | 'text'
        | 'int16'
        | 'int32'
        | 'int64'
        | 'decimal'
        | 'real'
        | 'double'
        | 'date'
        | 'time'
        | 'timestamp'
        | 'boolean'
        | 'binary'
        | 'uniqueidentifier'
        | 'file';
    isNullable: boolean;
    isPrimaryKey: boolean;
    size?: number;
    scale?: number;
}

export interface TestDataModelEntity {
    name: string;
    technicalName: string;
    description: string;
    attributes: TestDataEntityAttribute[];
}

export class DataModelsFactory {
    static createErDataModel(overrides: Partial<TestErDataModel> = {}): TestErDataModel {
        const id = getNextUniqueId();
        const name = faker.word.sample({ length: { min: 1, max: 12 } });
        return {
            type: 'ER',
            technicalName: `${name}-model-${id}`.toLowerCase(),
            name: `${name} Model ${id}`,
            description: `${name} Model ${id} description`,
            ...overrides
        };
    }

    static createRestDataModel(overrides: Partial<TestRestDataModel> = {}): TestRestDataModel {
        const id = getNextUniqueId();
        const name = faker.word.sample({ length: { min: 1, max: 12 } });
        const baseDomain = `${name}-model-${id}.${faker.internet.domainSuffix()}`.toLowerCase();

        return {
            type: 'REST',
            technicalName: `${name}-model-${id}`.toLowerCase(),
            name: `${name} Model ${id}`,
            description: `${name} Model ${id} description`,
            draftUri: `https://draft.${baseDomain}/api`,
            testUri: `https://test.${baseDomain}/api`,
            previewUri: `https://preview.${baseDomain}/api`,
            productionUri: `https://${baseDomain}/api`,
            ...overrides
        };
    }

    static createDataEntityAttribute(
        dataType: TestDataEntityAttribute['dataType'],
        overrides: Partial<TestDataEntityAttribute> = {}
    ): TestDataEntityAttribute {
        const id = getNextUniqueId();
        const name = faker.word.sample({ length: { min: 1, max: 20 } });
        let size: number;
        let scale: number;
        if (['char', 'varchar', 'decimal', 'binary'].includes(dataType)) {
            size = 100;
        }
        if (dataType === 'decimal') {
            scale = 2;
        }
        return {
            name: `${name} ${id}`,
            technicalName: `${name}-${id}`.toLowerCase(),
            description: `${name} ${id} description`,
            dataType: dataType,
            size: size,
            scale: scale,
            isNullable: true,
            isPrimaryKey: false,
            ...overrides
        };
    }

    static createDataModelEntity(
        overrides: Partial<TestDataModelEntity> = {}
    ): TestDataModelEntity {
        const id = getNextUniqueId();
        const name = faker.word.sample({ length: { min: 1, max: 20 } });
        return {
            technicalName: `${name}-${id}`.toLowerCase(),
            name: `${name} ${id}`,
            description: `${name} ${id} description`,
            attributes: [],
            ...overrides
        };
    }
}
