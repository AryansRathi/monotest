import { faker } from '@faker-js/faker';
import { getNextUniqueId } from './UniqueId';

export class PrimitivesFactory {
    static createWord(minLength?: number, maxLength?: number): string {
        const id = getNextUniqueId();
        const word =
            minLength && maxLength
                ? faker.word.sample({ length: { min: minLength - 5, max: maxLength - 5 } })
                : faker.word.sample();
        return `${word}-${id}`;
    }

    static createSentence(): string {
        const id = getNextUniqueId();
        const sentence = faker.lorem.sentence();
        return `${sentence} ${id}`;
    }

    static createUniqueString(prefix?: string): string {
        const id = getNextUniqueId();
        if (!prefix) {
            prefix = faker.word.sample();
        }
        return `${prefix}-${id}`;
    }

    static createEmail(): string {
        const id = getNextUniqueId();
        return faker.internet.email({ provider: `${id}.com` });
    }

    static createName(): string {
        const id = getNextUniqueId();
        return faker.person.fullName({ lastName: id });
    }

    static createInteger({ min, max }: { min?: number; max?: number } = {}): number {
        return faker.number.int({ min: min, max: max });
    }
}
