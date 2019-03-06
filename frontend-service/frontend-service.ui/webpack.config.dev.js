const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var target = path.resolve(
	__dirname,
	"../frontend-service.app/src/main/resources/static/dist"
);
const BASE_API_URL = 'http://iamtrent.de:8762';

module.exports = {
	mode: 'development',
	entry: {
		// Set the single-spa config as the project entry point
		"single-spa.config": "single-spa.config.js"
	},
	output: {
		publicPath: "/",
		filename: "[name].js",
		chunkFilename: "[id][hash].js",
		libraryTarget: "umd",
		path: target
	},
	module: {
		rules: [
			{
				// Webpack style loader added so we can use materialize
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.js$/,
				exclude: [path.resolve(__dirname, "node_modules")],
				loader: "babel-loader"
			},
			{
				// This plugin will allow us to use html templates when we get to the angularJS app
				test: /\.html$/,
				exclude: /node_modules/,
				loader: "html-loader"
			},
			{
				test: /\.(png|jpg|gif|jpeg|ttf|svg)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							name: "[path][name].[ext]"
						}
					}
				]
			}
		]
	},
	node: {
		fs: "empty"
	},
	resolve: {
		modules: [__dirname, "node_modules"]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: "Webgit  Platform Service",
			template: __dirname + "/public/index.html",
			inject: "body",
			filename: "index.html"
		}),
		//
		new webpack.DefinePlugin({
			BASE_API_URL: JSON.stringify(BASE_API_URL),
			TIMING_SERVICE_BASE_API_URL: JSON.stringify('http://localhost:8080'),
			USER_SERVICE_BASE_API_URL: JSON.stringify('http://localhost:8081'),
			PYTHON_TEST_SERVICE_BASE_API_URL: JSON.stringify('http://localhost:8084')

		}),
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	],
	externals: [],
	devServer: {
		historyApiFallback: true,
		contentBase: target
	}
};

exports.target = target;