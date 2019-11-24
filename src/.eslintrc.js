module.exports = {
    "extends": [
        "plugin:react/recommended",
    ],
    "parserOptions": {
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
        },
    },
    "env": {
        "browser": true,
        "es6": true,
        "jest": true,
    },
    "settings": {
        "import/resolver": {
            "node": {
                "extensions": [
                    ".js",
                    ".jsx",
                ],
            },
        },
        "react": {
            "version": "16",
        },
    },
    "rules": {
        "semi": ["error", "always"],
    },
};