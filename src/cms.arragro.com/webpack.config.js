const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MinifyPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const sharedConfig = require('./webpack.shared.config');

module.exports = (env) => {
    const devMode = env === null || env['run-prod'] === undefined || env['run-prod'] === null || env['run-prod'] === false;
    // const purifyPaths = glob.sync([
    //     path.join(__dirname, './**/*.cshtml'),
    //     path.join(__dirname, './**/*.tsx'),
    //     path.join(__dirname, './node_modules/arragrocms-management/dist/arragrocms-management.js')
    // ]);

    let config = {
        mode: devMode ? 'development' : 'production',
        devtool: 'source-map',
        resolve: {
            alias: {
                react: path.resolve(__dirname, './node_modules/react'),
                React: path.resolve(__dirname, './node_modules/react')
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        devServer: {
            hot: true
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: /ReactApp/,
                    exclude: [
                        /node_modules/,
                        /obj/
                    ],
                    loader: 'babel-loader',
                    options: devMode ? {
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
                            '@babel/preset-typescript',
                            '@babel/preset-react',
                        ],
                        plugins: [
                            // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                            // ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            'react-hot-loader/babel',
                        ],
                    } : {
                            cacheDirectory: true,
                            babelrc: false,
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        targets: {
                                            browsers: 'last 2 versions'
                                        },
                                        modules: false
                                    }, // or whatever your project requires

                                ],
                                '@babel/preset-typescript',
                                '@babel/preset-react',
                            ],
                            plugins: [
                                // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                                // ['@babel/plugin-proposal-decorators', { legacy: true }],
                                ['@babel/plugin-proposal-class-properties', { loose: true }],
                                '@babel/plugin-transform-runtime'
                            ]
                        }
                }
            ].concat(sharedConfig.commonRules)
        },
        entry: {
            main: ['./ReactApp/boot.tsx']
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: '/dist/'
        },
        optimization: devMode ? {} : {
            minimizer: [new MinifyPlugin()],
            namedModules: false,
            namedChunks: false,
            nodeEnv: 'production',
            flagIncludedChunks: true,
            occurrenceOrder: true,
            sideEffects: true,
            usedExports: true,
            concatenateModules: true,
            noEmitOnErrors: true,
            checkWasmTypes: true,
            minimize: true,
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "main.css"
            }),
            require('autoprefixer'),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                tslint: false, useTypescriptIncrementalApi: true
            }),
            // new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypeScript', excludeWarnings: false })
        ].concat(
            devMode ? [
            ] : [
                    new LodashModuleReplacementPlugin(),
                    new CompressionPlugin({
                        algorithm: "gzip",
                        test: /\.js$|\.css$|\.svg$/,
                        threshold: 10240,
                        minRatio: 0.8
                    }),
                    // new BundleAnalyzerPlugin()
                ])
    };

    return config;
};
