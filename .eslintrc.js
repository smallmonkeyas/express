/*
 * @Author: your name
 * @Date: 2021-08-23 20:13:57
 * @LastEditTime: 2021-08-23 20:53:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\.eslintrc.js
 */

const config = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint'],
    env: {
        browser: true,
        node: true
    },
    globals: {},
    rules: {
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        'no-eval': 2,
        'no-use-before-define': [
            2,
            {
                functions: false
            }
        ],
        'no-undef': 0,
        'no-unused-vars': 1,
        'no-caller': 2,
        'no-eq-null': 1,
        'guard-for-in': 2,
        'no-implicit-coercion': [
            2,
            {
                boolean: false,
                string: true,
                number: true
            }
        ],
        'no-with': 2,
        // 'no-mixed-spaces-and-tabs': 2,
        // 'no-multiple-empty-lines': 2,
        'dot-location': [2, 'property'],
        'operator-linebreak': [0, 'after'],
        'keyword-spacing': [2, {}],
        'space-unary-ops': [
            2,
            {
                words: false,
                nonwords: false
            }
        ],
        'no-spaced-func': 2,
        'space-before-function-paren': [
            1,
            {
                anonymous: 'ignore',
                named: 'never'
            }
        ],
        'comma-dangle': [2, 'never'],
        'no-trailing-spaces': 0,
        'max-len': [2, 160],
        'comma-style': [2, 'last'],
        curly: [2, 'all'],
        'space-infix-ops': 2,
        'spaced-comment': 1,
        'space-before-blocks': [2, 'always'],
        indent: [
            2,
            4,
            {
                SwitchCase: 1
            }
        ]
    }
};

module.exports = config;
