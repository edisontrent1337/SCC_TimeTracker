const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var target = path.resolve(
	__dirname,
	"../python-test.app/src/main/resources/static/dist"
);


module.exports = {
	entry: {
		index: "./src/index.js"
	},

	output: {
		path: target,
		filename: "bundle.js",
		chunkFilename: "[id][hash].js",
		libraryTarget: "umd"
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				loader: "babel-loader",
				options: {
					presets: [
						"babel-preset-env",
						"babel-preset-react",
						"babel-preset-stage-2"
					]
				}
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
			},
			{
				test: /\.(html)$/,
				use: {
					loader: "html-loader",
					options: {
						attrs: [":data-src"],
						minimize: true
					}
				}
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

	plugins: [
		new HtmlWebpackPlugin({
			title: "Python Test UI",
			template: __dirname + "/public/index.html",
			inject: "body",
			filename: "index.html"
		}),
		// defines the mode in which the external component is rendered
		new webpack.DefinePlugin({
			MODE: JSON.stringify("external-component"),
			PYTHON_TEST_SERVICE_BASE_API_URL: JSON.stringify('http://localhost:8084')
		})
	],
	externals: {
		React: "react"
	},
	mode: "production"
};

exports.target = target;
