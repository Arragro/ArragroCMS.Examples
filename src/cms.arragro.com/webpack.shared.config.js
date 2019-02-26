const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { dependencies } = require('./package.json');

const deps = Object.keys(dependencies || {})

module.exports.sharedConfig = {
    dist: path.join(__dirname, 'wwwroot', 'dist', 'dll'),
    vendors: deps.filter(dependency =>
        dependency !== 'bootstrap' &&
        dependency !== 'arragrocms-management'
    )
}

module.exports.commonRules = [
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
            {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [
                        require('autoprefixer')
                    ],
                    sourceMap: true
                }
            },
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