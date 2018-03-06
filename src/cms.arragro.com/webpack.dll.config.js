var webpack = require('webpack');
var path = require('path');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//var baseConfig = require('./webpack.config.base');
var { dependencies } = require('./package.json');

const dist = path.join(__dirname, 'wwwroot', 'dist', 'dll');

console.log(dist);

module.exports = (env) => {

    const isDevBuild = !(env && env.prod)

    console.log('env:', env)
    console.log(process.env.NODE_ENV)
    console.log('isDev', isDevBuild)

    let config = {
        devtool: 'source-map',
        mode: process.env.NODE_ENV,
        module: {
            rules: [
                { test: /\.(css|less)$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' }) },
                { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
                { test: /\.woff(\?\S*)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.(ttf|eot|svg)(\?\S*)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
            ]
        },

        entry: {
            vendor: [
                'babel-polyfill',
                ...Object.keys(dependencies || {})
            ]
                .filter(dependency => dependency !== 'bootstrap'),
            //.filter(dependency => dependency !== 'font-awesome'),
        },

        output: {
            library: '[name]_dll',
            path: dist,
            filename: '[name].dll.js',
            libraryTarget: 'var',
            sourceMapFilename: "[name].map",
            pathinfo: true
        },

        plugins: [
            new ExtractTextPlugin('main.dll.css'),
            new webpack.DllPlugin({
                path: path.join(dist, '[name]-manifest.json'),
                name: '[name]_dll',
            }),

            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            })
        ].concat(
            isDevBuild ? [
            ] : [
                    new webpack.LoaderOptionsPlugin({
                        minimize: true,
                        debug: false
                    })
                ])
    }

    return config
};
