const Path = require("path");
const Webpack = require("webpack");

const commonConfig = {
	devtool: "cheap-module-source-map",
	mode: "development",
	resolve: {
		extensions: [ ".tsx", ".ts", ".js" ],
	},
	plugins: [ new Webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }) ],
	optimization: {
		usedExports: true
	}
};

module.exports = function (env, argv) {
	const modules = [];

	if (argv.mode != null) {
		commonConfig.mode = argv.mode;
	}

	if (env.entry == null || env.entry === "client") {
		modules.push({
			...commonConfig,
			entry: "./source/client.ts",
			output: {
				filename: "client.js",
				path: Path.resolve(__dirname, "resource")
			},
			module: {
				rules: [
					{
						test: /.ts(x?)$/,
						use: "ts-loader?configFile=tsconfig.webpack.client.json"
					}
				]
			}
		});
	}

	if (env.entry == null || env.entry === "server") {
		modules.push({
			...commonConfig,
			target: "node",
			entry: "./source/server.ts",
			output: {
				filename: "server.js",
				path: Path.resolve(__dirname, "output")
			},
			module: {
				rules: [
					{
						test: /.ts(x?)$/,
						use: "ts-loader?configFile=tsconfig.webpack.server.json"
					}
				]
			}
		});
	}

	return modules;
}
