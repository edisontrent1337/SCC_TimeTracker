const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.js");
const webpack = require("webpack");

module.exports = merge.strategy({ plugins: "prepend" })(baseConfig, {
    mode: "development",
    devtool: "inline-source-map",
    output: {
        path: baseConfig.target,
        filename: "bundle.js",
        chunkFilename: "[id][hash].js",
        libraryTarget: "umd",
        publicPath: "/"
    },
    devServer: {
        contentBase: baseConfig.target,
        compress: true,
        port: 9000,
        historyApiFallback: true
    },
    plugins: [
        new webpack.DefinePlugin({
            MODE: JSON.stringify("standalone"),
            TIMING_SERVICE_BASE_API_URL: JSON.stringify('http://localhost:8080'),
            USER_SERVICE_BASE_API_URL: JSON.stringify('http://localhost:8081')
        })
    ]
});
