const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
const path = require('path');

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer: {
          static: {
            directory: path.join(__dirname, '../src'),
          },
          liveReload: true,
          hot: true,
          compress: true,
          port: 9000,
          historyApiFallback: true,
        },
      }
)
