const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	entry: ['@babel/polyfill', './src/index.js'],
	module: {
		rules: [
			{
				test: /\.(js|jsx|json)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.html$/,
				use: {
					loader: "html-loader"
			  }
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							modules: true
						}
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif)$/,
        use: 'file-loader'
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			filename: "./index.html"
		})
	],
	externals: {
		'Config': JSON.stringify(process.env.NODE_ENV === 'production' ? require('./config/prod.json') : require('./config/dev.json'))
	}
};