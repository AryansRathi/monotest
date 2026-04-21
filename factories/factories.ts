import { AdminFactory } from './adminFactory';
import { DataBuilderFactories } from './dataBuilderFactories';
import { PrimitivesFactory } from './primitivesFactory';

export interface Factories {
    dataBuilder: typeof DataBuilderFactories;
    admin: typeof AdminFactory;
    primitives: typeof PrimitivesFactory;
}

export const factories: Factories = {
    dataBuilder: DataBuilderFactories,
    admin: AdminFactory,
    primitives: PrimitivesFactory
};
