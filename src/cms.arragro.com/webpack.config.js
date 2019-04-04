const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AsyncChunkNames = require('webpack-async-chunk-names-plugin');
const TSIgnoreNotFoundExportPlugin = require('ignore-not-found-export-plugin');
const rimraf = require('rimraf');
const sharedConfig = require('./webpack.shared.config');

const ignoreNotFoundExportPlugin = new TSIgnoreNotFoundExportPlugin([
    'AccountAction',
    'AssetAction',
    'ComponentAction',
    'ContentAction',
    'ContentIndexAction',
    'FieldControlAction',
    'NavigationAction',
    'OptionAction',
    'SiteAction',
    'TagAction',
    'TemplateAction',
    'UserAction',
    'UsersAction',
    'ImportExportAction',
    'RulesExceptionDto',
    'IAdminFieldControlExtender',
    'IRenderFieldControlExtender',
    'IAdminFieldControlExtender',
    'IGenericListProps',
    'StoreState'
]);

rimraf.sync(path.join(__dirname, 'wwwroot', 'dist'));

module.exports = (env, argv) => {
    const mode = argv === undefined ? undefined : argv.mode;
    const devMode = mode === null || mode === undefined || mode === 'development';
    console.log(devMode)
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
                    include: __dirname,
                    exclude: [
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
                            '@babel/preset-typescript',
                            '@babel/preset-react',
                        ],
                        plugins: [
                            // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
                            // ['@babel/plugin-proposal-decorators', { legacy: true }],
                            ["@babel/plugin-transform-runtime", { "regenerator": true }],
                            ['@babel/plugin-proposal-class-properties', { loose: true }],
                            'react-hot-loader/babel',
                            'syntax-dynamic-import',
                        ],
                    }
                }
            ].concat(sharedConfig.commonRules)
        },
        entry: {
            main: ['./ReactApp/boot.tsx']
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist'),
            filename: '[name].[hash].js',
            chunkFilename: '[name].[hash].js',
            publicPath: '/dist/'
        },
        optimization: devMode ? {} : {
            minimizer: [
                new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
                }),
            ],
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
                filename: "main.[hash].css"
            }),
            require('autoprefixer'),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                tslint: true, useTypescriptIncrementalApi: true
            }),
            ignoreNotFoundExportPlugin,
            new AsyncChunkNames(),
            // new ForkTsCheckerNotifierWebpackPlugin({ title: 'TypeScript', excludeWarnings: false })
        ].concat(
            devMode ? [
            ] : [
                    new LodashModuleReplacementPlugin(),
                    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
                    new CompressionPlugin({
                        algorithm: "gzip",
                        test: /\.js$|\.svg$/,
                        threshold: 10240,
                        minRatio: 0.8
                    }),
                    // new BundleAnalyzerPlugin()
                ])
    };

    return config;
};
