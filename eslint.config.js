import oxlint from 'eslint-plugin-oxlint';
import typescriptParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        name: 'Base',
        ignores: ['node_modules/**', 'test-results/**', '**/dist/**', 'reporters/a11y-reporter.ts']
    },
    {
        name: 'oxlint',
        plugins: { oxlint },
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser
        },
        rules: {
            ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json').recommended
        }
    }
]);
