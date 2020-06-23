const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const util = require('./util');
const resolve = util.resolve;

module.exports = {
    entry: ['babel-polyfill', resolve('src/app.js')],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // set true is you want JS source map
                uglifyOptions: {
                    ecma: 6,
                    compress: {
                        drop_console: process.env.NODE_ENV === 'production'
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                react: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-timezone|react-slick|react-share|react-router|react-redux|react-router)[\\/]/,
                    priority: -10,
                    chunks: 'all',
                    name: 'react',
                    enforce: true
                },
                antd: {
                    test: /[\\/]node_modules[\\/](antd)[\\/]/,
                    priority: -9,
                    chunks: 'all',
                    name: 'antd',
                    enforce: true
                },

                moment: {
                    test: /[\\/]node_modules[\\/](moment)[\\/]/,
                    priority: -8,
                    chunks: 'all',
                    name: 'moment',
                    enforce: true
                },
                bluebird: {
                    test: /[\\/]node_modules[\\/](bluebird)[\\/]/,
                    priority: -7,
                    chunks: 'all',
                    name: 'bluebird',
                    enforce: true
                },
                lodash: {
                    test: /[\\/]node_modules[\\/](lodash)[\\/]/,
                    priority: -7,
                    chunks: 'all',
                    name: 'lodash',
                    enforce: true
                },
                momenttimezone: {
                    test: /[\\/]node_modules[\\/](moment-timezone)[\\/]/,
                    priority: -6,
                    chunks: 'all',
                    name: 'moment-timezone',
                    enforce: true
                },
                swagger: {
                    test: /[\\/]node_modules[\\/](swagger-ui-react)[\\/]/,
                    priority: -6,
                    chunks: 'all',
                    name: 'swagger',
                    enforce: true
                },
                vendors: {
                    test: /[\\/]node_modules[\\/](socket.io-client|qs|numeral|react-flags|web3|solidity-sha3|tronweb)[\\/]/,
                    priority: -5,
                    chunks: 'all',
                    name: 'vendors',
                    enforce: true
                },
                app: {
                    test: /[\\/]src[\\/]/,
                    priority: -15,
                    chunks: 'all',
                    name: 'app',
                    enforce: true
                },
                styles: {
                    name: 'styles',
                    test: /\.(scss|css)$/,
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    resolve: {
        extensions: ['.js', '.json', '.css', '.less', '.scss', '.sass', '.jsx'],
        alias: {
            '@': resolve('src'),
            img: resolve('src/img')
        }
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'src/assets',
                to: 'assets'
            }
        ])
    ]
};
