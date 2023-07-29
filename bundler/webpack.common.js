const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const pages = [
    'viewer',
    'editor',
    'account',
]

module.exports = {
    entry: {
        index: path.resolve(__dirname, '../src/index.js'),
        viewer: path.resolve(__dirname, '../src/viewer/viewer.js'),
        editor: path.resolve(__dirname, '../src/editor/editor.js'),
        account: path.resolve(__dirname, '../src/account/account.js'),
    },
    output: {
        filename: 'bundle.[name].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        libraryTarget: "var",
        library: "FileExt",
        library: "Point",
        library: "Tracer",
        library: "Data",
        library: "Panel",
        library: "ScreenSizes",
        library: "UserTable"
    },
    target: 'web',
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, '../static')
            }]
        }),
        new MiniCSSExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            filename: 'index.html',
            chunks: ['index']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/viewer/viewer.html'),
            filename: 'viewer.html',
            chunks: ['viewer']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/editor/editor.html'),
            filename: 'editor.html',
            chunks: ['viewer', 'editor']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/account/account.html'),
            filename: 'account.html',
            chunks: ['account']
        }),
    ],
    module: {
        rules: [
            // HTML
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader'
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg|ico)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/images/'
                    }
                }]
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/fonts/'
                    }
                }]
            },

            // GLB
            {
                test: /\.(glb|gltf)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/models/'
                        }
                    }
                ]
            },

            //OBJ
            {
                test: /\.(obj)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/models/'
                        }
                    }
                ]
            },

            //MTL
            {
                test: /\.(mtl)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/models/'
                        }
                    }
                ]
            },
            //CSV, TXT
            {
                test: /\.(csv|txt)$/,
                use:
                [
                    {
                        loader: 'raw-loader'
                    }
                ]
            }
        ]
    },
    externals: {
        fs: 'fs'
    }
}