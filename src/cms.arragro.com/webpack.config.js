const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const { dependencies } = require('./package.json');

const manifest = path.join(__dirname, 'wwwroot', 'dist', 'dll', 'vendor-manifest.json');

const extractLess = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = (env) => {

    const isDevBuild = !(env && env.prod);

    let config = {
        devtool: 'source-map',
        mode: process.env.NODE_ENV,
        resolve: {
            alias: {
                react: path.resolve(__dirname, './node_modules/react'),
                React: path.resolve(__dirname, './node_modules/react')
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: /ReactApp/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'babel-loader' },
                        { loader: 'ts-loader?silent=true' }
                    ]
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
            main: ['./ReactApp/boot.tsx', './wwwroot/less/site.less']
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
                new webpack.DllReferencePlugin({
                    context: process.cwd(),
                    manifest: require(manifest),
                    sourceType: 'var',
                }),
                new ExtractTextPlugin('main.css')
            ] : [
                //new webpack.LoaderOptionsPlugin({
                //    minimize: true,
                //    debug: false
                //}),
                new ExtractTextPlugin('main.css'),
                new webpack.DefinePlugin({
                    'process.env': {
                        // This has effect on the react lib size
                        'NODE_ENV': JSON.stringify('production'),
                    }
                })
            ])
    }

    if (!isDevBuild) {
        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "dll/vendor.dll",
                        chunks: "all"
                    }
                }
            }
        }
    }
    
    return config
};
