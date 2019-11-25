module.exports = {
    "extends": [
        "eslint:recommended",
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        }
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