const fs = require('fs')
const webpack = require('webpack')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"'
        }
      })
    ]
  },
  devServer: {
    port: 8081,
    allowedHosts: ['.localhost'],
    disableHostCheck: true,
    public: process.env.VUE_APP_FRONTEND_HOST
  }
}