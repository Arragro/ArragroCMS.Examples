const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const PurifyCSSPlugin = require('purifycss-webpack');
const { dependencies } = require('./package.json');

module.exports = (env) => {
    const devMode = env === null || env['run-prod'] === undefined || env['run-prod'] === null || env['run-prod'] === false;

    var purifyPaths = glob.sync([
        path.join(__dirname, './Views/**/*.cshtml'),
        path.join(__dirname, './app/**/*.tsx'),
        path.join(__dirname, './app/**/*.ts')
    ]);

    let config = {
        mode: devMode ? 'development' : 'production',
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            plugins: [
                new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
            ]
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: [
                        /node_modules/,
                        /obj/
                    ],
                    loader: 'awesome-typescript-loader',
                    query: {
                        useBabel: true,
                        useCache: devMode
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        'css-hot-loader',
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                sourceMap: true
                            }
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                },
                { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
                { test: /\.woff(\?\S*)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.(ttf|eot|svg)(\?\S*)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' }
            ]
        },
        entry: {
            main: ['./app/index.ts']
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: '/dist/'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    },
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendor",
                        chunks: "all"
                    }
                }
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "main.css",
                chunkFilename: "vendor.css"
            }),
            new PurifyCSSPlugin({
                // Give paths to parse for rules. These should be absolute!
                paths: purifyPaths,
                purifyOptions: {
                    info: devMode,
                    minify: false,
                    rejected: devMode,
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
            require('autoprefixer')
        ].concat(
            devMode ? [
            ] : [
                new CompressionPlugin({
                    asset: "[path].gz[query]",
                    //include: /\/wwwroot/,
                    algorithm: "gzip",
                    test: /\.js$|\.css$|\.svg$/,
                    threshold: 10240,
                    minRatio: 0.8
                })
            ])
    }

    return config
};
