/* eslint-env node */
const path = require('path');
const webpack = require('webpack');

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

const baseConfig = Object.assign({}, require('./webpackBaseConfig'), {
	entry: {
		vendor: vendorPackages
	},
	plugins: [
		new webpack.DllPlugin({
			path: path.join(__dirname, 'dll', '[name]-manifest.json'),
			name: '[name]',
			context: path.resolve(__dirname, 'src')
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			mangle: true,
			sourcemap: false,
			compress: {
				sequences: true,
				dead_code: true,
				booleans: true,
				drop_console: true,
				properties: true,
				loops: true,
				if_return: true,
				comparisons: true,
				warnings: false
			}
		})
	]
});

module.exports = [
	Object.assign({}, baseConfig, {
		output: {
			path: path.join(__dirname, 'electron/js'),
			filename: 'dll.[name].js',
			library: '[name]'
		}
	}),

	Object.assign({}, baseConfig, {
		output: {
			path: path.join(__dirname, 'extension_chrome/js'),
			filename: 'dll.[name].js',
			library: '[name]'
		}
	})
];
