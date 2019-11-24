module.exports = {
    "extends": [
        "eslint:recommended",
    ],
    "plugins": [
        "dependencies",
    ],
    "parserOptions": {
        "ecmaVersion": 6,
    },
    "env": {
        "es6": true,
        "node": true,
    },
    "rules": {
        "semi": ["error", "always"],
        "comma-dangle": ["warn", "always-multiline"],
    },
};