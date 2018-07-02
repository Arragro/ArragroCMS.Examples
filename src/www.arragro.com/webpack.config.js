const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');

module.exports = (env) => {

    const isDevBuild = !(env && env.prod);

    var purifyPaths = glob.sync([
        path.join(__dirname, './Views/**/*.cshtml'),
        path.join(__dirname, './app/**/*.tsx'),
        path.join(__dirname, './app/**/*.ts')
    ]);

    let config = {
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        module: {
            loaders: [
                {
                    test: /\.ts$/,
                    include: /app/,
                    exclude: [
                        /node_modules/,
                        /obj/
                    ],
                    use: [
                        { loader: 'babel-loader' },
                        { loader: 'ts-loader?silent=true' }
                    ]
                },
                { 
                    test: /\.scss?/, 
                    exclude: /node_modules/, 
                    use: [
                        'css-hot-loader'                        
                    ].concat(ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader', 'sass-loader']}))
                },
                { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
                { test: /\.woff(\?\S*)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.(ttf|eot|svg)(\?\S*)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
            ]
        },
        entry: {
            main: ['./app/index.ts'],
            vendor: ['jquery', 'jquery-validation', 'jquery-validation-unobtrusive', 'bootstrap', 'popper.js']
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            filename: '[name].js',
            publicPath: '/dist/'
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery",
                Popper: ['popper.js', 'default']
            }),
            new ExtractTextPlugin('main.css'),
            new PurifyCSSPlugin({
                // Give paths to parse for rules. These should be absolute!
                paths: purifyPaths,
                purifyOptions: {
                    info: false,
                    minify: false,
                    rejected: true,
                    whitelist: [
                        '*carousel-*',
                        '*background-wrap',
                        'infinite-clouds',
                        '*cloud*',
                        '*banner-text',
                        'carousel-fade',
                        'carousel-item*',
                        'header#standardHeader*',
                        'header#errorNotFoundPageHeader*',
                        'header#errorPageHeader*',
                        'header#landingPageHeader*',
                        '*whatWeveDone*',
                        '*tileBulletPage*',
                        '*digital-signage*',
                        '*case-study-bayleys-web*',
                        '*what-weve-done-img*',
                        '*bayleys-case-study*',
                        '*navbar*',
                        'nav-link*',
                        '*collapse*',
                        'navbar-collapse'
                    ]
                }
            }),
        ].concat(
            isDevBuild ? [
                new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' })
            ] : [
                    new UglifyJSPlugin(),
                    new webpack.LoaderOptionsPlugin({
                        minimize: true,
                        debug: false
                    }),
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
                    }),
                    require('autoprefixer'),
                    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js' }),
                    new CompressionPlugin({
                        test: /\.(js|css)/
                    })
                ])
    }

    return config
};
