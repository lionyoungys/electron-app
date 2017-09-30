const buildPath = __dirname + '/src/';
const config = {
    devtool: 'eval-source-map',    //生成Source Maps,这里选择eval-source-map
    entry: {
        login: buildPath + 'login.js',
        main: buildPath + 'main.js',
        ['static/api']: buildPath + 'static/api.js',
        ['static/UI']: buildPath + 'static/UI.js',
        ['index/index']: buildPath + 'index/index.js',
        ['index/menus']:buildPath + 'index/menus.js',
        //['main/main']: buildPath + 'main/main.js',
        //['main/menu']: buildPath + 'main/menu.js',
        //['index/index']: buildPath + 'index/index.js'
    },
    output: {
        filename: '[name].js',
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
          }
        ]
      }
};

module.exports = config;