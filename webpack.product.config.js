const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const configBase = {
	module:{
		loaders: [
			{
				test: /\.json?$/,
				loader: 'json-loader'
			},{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: { compact: false }
			},{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('style-loader','css-loader!less-loader')
			},{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style-loader','css-loader')
			},
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass']
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader?limit=8192'
			},
			{ test: /\.(ttf|eot|svg)$/,
				loader: 'url-loader?limit=100000'
			},
			{
				test: /cheerio\/package$/,
				loader: 'json'
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('css/[name].css'),
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			sourcemap:false,
			compress: {
				sequences: true,
				dead_code: true,
				booleans: true,
				drop_console: true,
				properties: true,
				loops:true,
				if_return:true,
				comparisons:true,
				warnings:false
			}
		}),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	],
	externals: [
    (function () {
      var IGNORES = [
        'electron'
      ];
      return function (context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })()
	],
	resolve: {
		root: path.resolve('./src'),
		extensions: ['', '.js']
	}
};

module.exports = [
	Object.assign(configBase, {
		name: 'chrome',
		entry: {
			app:'./src/app.js',
			background:'./src/platform/chrome-ext/background.js'
		},
		output: {
			path: path.join(__dirname, 'extension_chrome/js'),
			filename: '[name].js'
		}
	}),

	Object.assign(configBase, {
		name: 'electron',
		entry: {
			app:'./src/app.js',
			main:'./src/platform/electron/main.js'
		},
		output: {
			path: path.join(__dirname, 'electron/js'),
			filename: '[name].js'
		}
	})
];
