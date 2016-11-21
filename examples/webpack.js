let webpack = require('webpack')
let path = require('path')
module.exports = {
  devtool: 'source-map',
  entry: './examples/index.js',
  output: {
    path: path.resolve('./examples'),
    filename: 'bundle.js'
  },
  module: {
    rules: [ {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        plugins: [ path.join(__dirname, '../lib/babel.js') ]
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    } ]  
  },  
  resolve: {
    alias: {
      'markdown-in-js': '../src'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  devServer: {
    contentBase: 'examples/',
    historyApiFallback: true,
    compress: true, 
    inline: true
  }
}
