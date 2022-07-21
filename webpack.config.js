const Path = require("path");

const commonConfig = {
	devtool: "cheap-module-source-map",
	mode: "development",
	resolve: {
		extensions: [ ".tsx", ".ts", ".js" ],
	},
	optimization: {
		usedExports: true
	},
	module: {
		rules: [
			{
				test: /.ts(x?)$/,
				exclude: /node_modules/,
				use: "ts-loader"
			}
		]
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
			}
		});
	}

	return modules;
}
