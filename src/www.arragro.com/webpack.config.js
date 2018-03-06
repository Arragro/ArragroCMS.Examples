const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {

    const isDevBuild = !(env && env.prod);

    let config = {
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
                {
                    test: /\.ts(x?)$/,
                    include: /ReactApp/,
                    exclude: /node_modules/,
                    use: [
                        { loader: 'babel-loader' },
                        { loader: 'ts-loader?silent=true' }
                    ]
                },
                { test: /\.scss/, exclude: /node_modules/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader', 'sass-loader']}) },
                { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
                { test: /\.woff(\?\S*)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.(ttf|eot|svg)(\?\S*)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
            ]
        },
        entry: {
            main: ['./Typescript/index.ts'],
            vendor: ["jquery"]
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
                new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })
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
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
                    }),
                    require('autoprefixer'),
                    new webpack.ProvidePlugin({
                        $: "jquery",
                        jQuery: "jquery",
                        "window.jQuery": "jquery",
                        Popper: ['popper.js', 'default']
                    }),
                    new ExtractTextPlugin('main.css'),
                    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' })
                ])
    }

    return config
};
