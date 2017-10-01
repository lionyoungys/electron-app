const buildPath = __dirname + '/src/';

const config = {
    devtool: 'eval-source-map',    //生成Source Maps,这里选择eval-source-map
    entry: {
        ['login.js']: buildPath + 'login.js',
        ['main.js']: buildPath + 'main.js'
    },
    output: {
        filename: '[name]',
        path: __dirname + '/app/public'
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['env','react']
              }
            }
          },
          {
            test: /\.css$/,
            use: [
              {loader: "style-loader",options: { url: false, minimize: true }},
              {loader: "css-loader",options: { url: false, minimize: true }}
            ]
          },
          {
            test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8192,
                  name: '[name].[ext]',
                  outputPath: 'images/'
                }
              }
            ]
          }
        ]
      }
};

module.exports = config;