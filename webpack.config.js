const path = require('path');

const config = {
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
        ]
    }
};

module.exports = config;