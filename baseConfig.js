const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	module:{
		loaders: [
			{
				test: /\.json$/,
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
	resolve: {
		root: path.resolve('./src'),
		extensions: ['', '.js']
	}
};
