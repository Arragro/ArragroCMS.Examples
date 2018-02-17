var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        loaders: [
            { test: /\.ts(x?)$/, include: /TypeScript/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.ts(x?)$/, include: /TypeScript/, exclude: /node_modules/, loader: 'ts-loader?silent' },
            {
                test: /\.css$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader', use: [
                        {
                            loader: 'css-loader',
                            options: { autoprefixer: false, sourceMap: true, importLoaders: 1 }
                        },
                        'postcss-loader'
                    ]
                })
            },
            { test: /\.scss/, exclude: /node_modules/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader', 'sass-loader']}) },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
            { test: /\.woff(\?\S*)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
            { test: /\.(ttf|eot|svg)(\?\S*)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    entry: {
        main: ['./TypeScript/index.ts'],
        vendor: ["jquery"]
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin('main.css'),
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Popper: ['popper.js', 'default']
        }),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }) // Moves vendor content out of other bundles
    ]
};
