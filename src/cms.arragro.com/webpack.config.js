const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const sharedConfig = require('./webpack.shared.config');

module.exports = (env) => {

    const isDevBuild = !(env && env.prod);

    let config = {
        devtool: 'source-map',
        resolve: {
            alias: {
                react: path.resolve(__dirname, './node_modules/react'),
                React: path.resolve(__dirname, './node_modules/react')
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            plugins: [
                new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
            ]
        },
        module: {
            loaders: [
                {
                    test: /\.ts(x?)$/,
                    include: /ReactApp/,
                    exclude: [
                        /node_modules/,
                        /obj/
                    ],
                    loader: 'awesome-typescript-loader',
                    query: {
                        useBabel: true,
                        useCache: true
                    }
                },
                {
                    test: /\.(less|css)$/,
                    use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' })
                },
                { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
                { test: /\.woff(\?\S*)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.(ttf|eot|svg)(\?\S*)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
            ]
        },
        entry: {
            main: ['./ReactApp/boot.tsx'],
            vendor: [
                'babel-polyfill',
            ].concat(sharedConfig.vendors)
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            filename: '[name].js',
            publicPath: '/dist/'
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin()
        ].concat(
            isDevBuild ? [
                new ExtractTextPlugin('main.css'),
                new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' })
            ] : [
                new webpack.optimize.UglifyJsPlugin({
                    beautify: false,
                    mangle: {
                        screw_ie8: true,
                        keep_fnames: true
                    },
                    compress: {
                        screw_ie8: true
                    },
                    comments: false
                }),
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                }),
                new ExtractTextPlugin('main.css'),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
                }),
                new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' })
            ])
    }
    
    return config
};
