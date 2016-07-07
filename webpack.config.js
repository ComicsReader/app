var Path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
	entry: {
		app_min:'./src/App.js',
		background:'./src/background.js'
	},
	output:{
		path: Path.resolve(__dirname, 'ComicsReader/'),
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
			},
			{
				test: /cheerio\/package$/,
				loader: 'json'
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('css/[name].css'),
		// new webpack.IgnorePlugin(/ReactContext|react\/addons/),
		new LiveReloadPlugin({appendScriptTag: true})
	],
	devtool: '#inline-source-map'
};
