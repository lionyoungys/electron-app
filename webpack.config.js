const buildPath = __dirname + '/src/';
const config = {
    devtool: 'eval-source-map',    //生成Source Maps,这里选择eval-source-map
    entry: {
        ['static/UI']: buildPath + 'static/UI.js',
        ['login/login']: buildPath + 'login/login.js',
        ['main/main']: buildPath + 'main/main.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/app'
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