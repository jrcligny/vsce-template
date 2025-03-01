import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from "globals";

export default tseslint.config({
    files: ['src/**/*.ts', 'test/**/*.ts'],
    extends: [
        eslint.configs.recommended,
        tseslint.configs.recommended,
        tseslint.configs.strict,
        tseslint.configs.stylistic,
    ],
}, {
    files: ['tasks/**/*.js', 'tasks/**/*.mjs'],
    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
    extends: [
        eslint.configs.recommended,
    ],
});