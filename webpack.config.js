/* eslint-env node */
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const baseConfig = Object.assign({}, require('./baseConfig'), {
	plugins: [
		new ExtractTextPlugin('css/[name].css')
	],
	devtool: '#inline-source-map'
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
		],
		target: 'electron'
	}),

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
