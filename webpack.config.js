const buildPath = __dirname + '/src/';

const config = {
    devtool: 'eval-source-map',    //生成Source Maps,这里选择eval-source-map
    entry: {
        ['login.js']: buildPath + 'login.js',
        ['main.js']: buildPath + 'main.js',
        //['static/api.js']: buildPath + 'static/api.js',
        //['static/UI.js']: buildPath + 'static/UI.js',
        //['index/index.js']: buildPath + 'index/index.js',
        //['index/index.css']: buildPath + 'index/index.css',
        //['index/menus.js']:buildPath + 'index/menus.js',
        //['main/main']: buildPath + 'main/main.js',
        //['main/menu']: buildPath + 'main/menu.js',
        //['index/index']: buildPath + 'index/index.js'
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
              {loader: "style-loader",options: { url: false }},
              {loader: "css-loader",options: { url: false }}
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