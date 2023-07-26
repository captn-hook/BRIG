const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const pages = [
    'index',
    'editor',
    'account',
]

module.exports = {
    entry: pages.reduce((config, page) => {
        config[page] = path.resolve(__dirname, `../src/${page}.js`)
        return config
    }, {}),
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
        new MiniCSSExtractPlugin()
    ].concat(
        pages.map(page => new HtmlWebpackPlugin({
            template: path.resolve(__dirname, `../src/${page}.html`),
            filename: `${page}.html`,
            chunks: [page]
        }))
    ),
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