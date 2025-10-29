import path from 'path';
import {fileURLToPath} from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import DebuggerConsoleValidatorPlugin from "./DebuggerConsoleValidatorPlugin.js";

const isProd = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    entry: path.resolve(__dirname, "client/src/main.tsx"),
    devtool: isProd ? false : "source-map",
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: 'single',
        minimize: isProd,
        minimizer: [`...`, new CssMinimizerPlugin()],

    },
    output: {
        path: path.resolve(__dirname, "dist/public"),
        filename: process.env.NODE_ENV === "production" ? "js/[name].[contenthash].js" : "js/[name].js",
        assetModuleFilename: "assets/[hash][ext][query]",
        clean: true,
        publicPath: "/",
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "client/src"),
            "@shared": path.resolve(__dirname, "shared"),
            "@assets": path.resolve(__dirname, "attached_assets"),
        },
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            "@babel/preset-env",
                            ["@babel/preset-react", {runtime: "automatic"}],
                            "@babel/preset-typescript",
                        ],
                    },
                },
            },
            {
                test: /\.module\.css$/i,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    {
                        loader: "css-loader",
                        options: {modules: true},
                    },
                    "postcss-loader",
                ],
            },
            {
                test: /\.css$/i,
                exclude: /\.module\.css$/i,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : "style-loader",
                    "css-loader",
                    "postcss-loader"
                ],
            },
            {
                test: /\.(png|jpe?g|gif|webp|ico|bmp)$/i,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024,
                    },
                },
            },
            {
                test: /\.svg$/i,
                issuer: /\.[jt]sx?$/,
                use: ["@svgr/webpack"],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new DebuggerConsoleValidatorPlugin({
            forbidden: [
                /\bdebugger\b/,
                /\bconsole\.log\s*\(/
            ],
            failOnError: true
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "client/index.html"),
            inject: "body",
        }),
        new MiniCssExtractPlugin({
            filename: isProd ? "css/[name].[contenthash].css" : "css/[name].css",
        })
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, "dist/public"),
        },
        hot: true,
        port: 3002,
    },
    mode: process.env.NODE_ENV || "development",
};