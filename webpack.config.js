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
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
            //   options: {
            //     presets: ['env','react']
            //   }
            }
          }
        ]
      }
};

module.exports = config;