/* eslint-env node */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const baseConfig = Object.assign(require('./baseConfig'), {
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
	]
});

module.exports = [
	Object.assign({}, baseConfig, {
		name: 'chrome',
		entry: {
			app:'./src/app.js',
			background:'./src/platform/chrome-ext/background.js'
		},
		output: {
			path: path.join(__dirname, 'extension_chrome/js'),
			filename: '[name].js'
		},
		plugins: [
			new webpack.DefinePlugin({
				PLATFORM: JSON.stringify('chrome')
			})
		]
	}),

	Object.assign({}, baseConfig, {
		name: 'electron',
		entry: {
			app:'./src/app.js',
			main:'./src/platform/electron/main.js'
		},
		output: {
			path: path.join(__dirname, 'electron/js'),
			filename: '[name].js'
		},
		plugins: [
			new webpack.DefinePlugin({
				PLATFORM: JSON.stringify('electron')
			})
		]
	})
];
