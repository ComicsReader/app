var Path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

module.exports = {
	entry: {
		app_min:'./src/App.js',
		background:'./src/background.js'
	},
	output:{
		path:Path.resolve(__dirname, 'ComicsScroller/'),
		filename: 'js/[name].js'
	},
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
	]
};
