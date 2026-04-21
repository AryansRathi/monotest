import { faker } from '@faker-js/faker';
import { getNextUniqueId } from '../UniqueId';

export interface TestDataSource {
    name: string;
    technicalName: string;
    description: string;
}

export interface TestExternalDataSource extends TestDataSource {
    type: 'postgres' | 'sqlserver';
    host: string;
    database: string;
}

export class DataSourcesFactory {
    static createDataSource(overrides: Partial<TestDataSource> = {}): TestDataSource {
        const id = getNextUniqueId();
        const name = faker.word.sample({ length: { min: 1, max: 14 } });
        return {
            name: `${name} Data Source ${id}`,
            technicalName: `${name} Data Source ${id}`,
            description: `${name} Data Source ${id} description`,
            ...overrides
        };
    }

    static createExternalDataSource(
        type: TestExternalDataSource['type'],
        overrides: Partial<TestExternalDataSource> = {}
    ): TestExternalDataSource {
        const id = getNextUniqueId();
        const name = faker.word.sample({ length: { min: 1, max: 14 } });
        const hosts: Record<TestExternalDataSource['type'], string> = {
            postgres: 'external_postgres',
            sqlserver: 'external_sqlserver'
        };
        return {
            type,
            name: `${name} Data Source ${id}`,
            technicalName: `${name}-DataSource-${id}`.toLowerCase(),
            description: `${name} Data Source ${id} description`,
            host: hosts[type],
            database: 'externaldb',
            ...overrides
        };
    }
}
