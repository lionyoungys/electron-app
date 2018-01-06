const buildPath = __dirname + '/src/';

const config = {
    devtool: 'eval-source-map',    //生成Source Maps,这里选择eval-source-map
    entry: {
        login: buildPath + 'login.js',
        main: buildPath + 'main.js'
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
          },
          {
            test: /\.css$/,
            use: [
              {loader: "style-loader",options: { url: false, minimize: true }},
              {loader: "css-loader",options: { url: false, minimize: true }}
            ]
          }
        ]
      }
};

module.exports = config;