const path = require('path');

const config = {
    devtool: 'eval-source-map',    //生成Source Maps,这里选择eval-source-map
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build'
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' }
        ]
    }
};

module.exports = config;