const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/index.ts',
	output: {
		library: {
			name: 'webcraft',
			type: 'umd',
		},
	},
	plugins: [new MiniCssExtractPlugin()],
	module: {
		rules: [			
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
	},
};