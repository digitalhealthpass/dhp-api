// (c) Copyright Merative US L.P. and others 2020-2022 
//
// SPDX-Licence-Identifier: Apache 2.0

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
        mocha: true,
    },
    extends: ['airbnb', 'plugin:node/recommended', 'plugin:prettier/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['chai-friendly', 'react', 'prettier'],
    rules: {
        'prettier/prettier': 'off',
        'spaced-comment': ['error', 'always', { exceptions: ['*'] }],
        indent: ['error', 4, {'SwitchCase': 1}],
        'max-depth': ['warn', 5],
        complexity: [
            'warn',
            {
                max: 8,
            },
        ],
        'max-len': ['warn', 120],
        'max-params': ['warn', 7],
        'max-lines-per-function': ['warn', 120],
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
        'node/no-unsupported-features/es-syntax': 'off',
        'react/jsx-indent': 'off',
        'react/jsx-indent-props': 'off',
        'react/destructuring-assignment': 'off',
        'react/state-in-constructor': 'off',
        'react/prop-types': 'off',
        'react/no-access-state-in-setstate': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/forbid-prop-types': 'off',
        'no-shadow': 'off',
        'no-underscore-dangle': ['error', { allow: ['_id', '_rev'] }],
        'no-unused-expressions': 0,
        'chai-friendly/no-unused-expressions': 2,
    },
};
