const path = require('path');
const glob = require('glob-all');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PurifyCSSPlugin = require('purifycss-webpack');
const rimraf = require('rimraf');
const { dependencies } = require('./package.json');

rimraf.sync(path.join(__dirname, 'wwwroot', 'dist'));

module.exports = (env, argv) => {
    const mode = argv === undefined ? undefined : argv.mode;
    const devMode = mode === null || mode === undefined || mode === 'development';
    console.log(devMode);

    var purifyPaths = glob.sync([
        path.join(__dirname, './Views/**/*.cshtml'),
        path.join(__dirname, './app/**/*.tsx'),
        path.join(__dirname, './app/**/*.ts')
    ]);

    var purifyPaths = glob.sync([
        path.join(__dirname, './Views/**/*.cshtml'),
        path.join(__dirname, './app/**/*.tsx'),
        path.join(__dirname, './app/**/*.ts')
    ]);

    let config = {
        mode: devMode ? 'development' : 'production',
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: [
                        /node_modules/,
                        /obj/
                    ],
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        browsers: 'last 2 versions'
                                    }
                                }, // or whatever your project requires
                            ],
                            '@babel/preset-typescript'
                        ],
                        plugins: [
                            // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                            // ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ["@babel/plugin-transform-runtime", { "regenerator": true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }]
                        ],
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
                filename: "[name].css"
            }),
            new PurifyCSSPlugin({
                // Give paths to parse for rules. These should be absolute!
                paths: purifyPaths,
                purifyOptions: {
                    info: true,
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
            require('autoprefixer'),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                tslint: true, useTypescriptIncrementalApi: true
            }),
        ].concat(
            devMode ? [
            ] : [
                new CompressionPlugin({
                    algorithm: "gzip",
                    test: /\.js$|\.svg$/,
                    threshold: 10240,
                    minRatio: 0.8
                })
            ])
    }

    return config;
};
