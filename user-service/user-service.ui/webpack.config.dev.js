const merge = require("webpack-merge");
const baseConfig = require("./webpack.config.js");
const webpack = require("webpack");

module.exports = merge.strategy({ plugins: "prepend" })(baseConfig, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        contentBase: baseConfig.target,
        compress: true,
        port: 9000,
        historyApiFallback: true
    },
    plugins: [
        new webpack.DefinePlugin({
            MODE: JSON.stringify("standalone")
        })
    ]
});
