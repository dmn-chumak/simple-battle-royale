const Path = require("path");

const commonExternals = {};
const commonOutput = Path.resolve(__dirname, "output");
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
			externals: commonExternals,
			output: {
				filename: "client.js",
				path: commonOutput
			}
		});
	}

	if (env.entry == null || env.entry === "server") {
		modules.push({
			...commonConfig,
			target: "node",
			entry: "./source/server.ts",
			externals: commonExternals,
			output: {
				filename: "server.js",
				path: commonOutput
			}
		});
	}

	return modules;
}
