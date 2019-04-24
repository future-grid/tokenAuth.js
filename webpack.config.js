const path = require('path');
const BabiliPlugin = require('babili-webpack-plugin');

module.exports = {
    entry: {
        'fgp-auth.js': './src/fgp-auth.js',
        'fgp-auth.min.js': './src/fgp-auth.js'
    },
    output: {
        filename: '[name]',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {
        angular: 'angular',
        'auth0-js': 'auth0',
        'keycloak-js': 'Keycloak',
        'auth0-lock': 'Auth0Lock'
    },
    plugins: [
        new BabiliPlugin(
            {},
            {
                test: /\.min\.js$/
            }
        )
    ]
};
