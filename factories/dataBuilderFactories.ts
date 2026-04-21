import { DataSourcesFactory } from './dataBuilderFactory/dataSourcesFactory';
import { DataModelsFactory } from './dataBuilderFactory/dataModelsFactory';

export interface DataBuilderFactories {
    sources: typeof DataSourcesFactory;
    models: typeof DataModelsFactory;
}

export const DataBuilderFactories: DataBuilderFactories = {
    sources: DataSourcesFactory,
    models: DataModelsFactory
};
