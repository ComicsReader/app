/* eslint-env node */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const baseConfig = Object.assign({}, require('./webpackBaseConfig'), {
	plugins: [
		new ExtractTextPlugin('css/[name].css')
	],
	devtool: 'eval'
});

const vendorPackages = [
	'react',
	'react-dom',
	'react-router',
	'redux',
	'material-ui',
	'radium',
	'pouchdb',
	'lodash',
	'cheerio',
	'bluebird'
];

module.exports = [
	/* Chrome extension build */
	Object.assign({}, baseConfig, {
		name: 'chrome',
		entry: {
			vendor: vendorPackages,
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
			}),
			new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js')
		]
	}),

	/* Electron build */
	Object.assign({}, baseConfig, {
		name: 'electron',
		entry: {
			vendor: vendorPackages,
			app:'./src/app.js'
		},
		output: {
			path: path.join(__dirname, 'electron/js'),
			filename: '[name].js'
		},
		plugins: [
			new webpack.DefinePlugin({
				PLATFORM: JSON.stringify('electron')
			}),
			new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js')
		],
		target: 'electron-renderer'
	}),

	/* Web Worker build */
	Object.assign({}, baseConfig, {
		name: 'worker',
		entry: {
			worker: './src/services/worker.js'
		},
		output: {
			path: path.join(__dirname, 'extension_chrome/js'),
			filename: '[name].js'
		},
		target: 'webworker'
	}),

	Object.assign({}, baseConfig, {
		name: 'worker',
		entry: {
			worker:'./src/services/worker.js'
		},
		output: {
			path: path.join(__dirname, 'electron/js'),
			filename: '[name].js'
		},
		target: 'webworker'
	})
];
