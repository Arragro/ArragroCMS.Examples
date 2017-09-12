var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    resolve: {
        alias: {
            react: path.resolve(__dirname, './node_modules/react'),
            React: path.resolve(__dirname, './node_modules/react')
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        loaders: [
            { test: /\.ts(x?)$/, include: /ReactApp/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.ts(x?)$/, include: /ReactApp/, exclude: /node_modules/, loader: 'ts-loader?silent' },
            { test: /\.css$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }) },
            { test: /\.less/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' }) },
            { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
            { test: /\.woff(\?\S*)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
            { test: /\.(ttf|eot|svg)(\?\S*)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    entry: {
        main: ['./ReactApp/boot.tsx'],
        vendor: ['react', 'react-dom', 'react-intl', 'react-router']
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
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }) // Moves vendor content out of other bundles
    ]
};
