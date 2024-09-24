
const path = require('path');
const paths = require('./paths');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //实例对象
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const EslintWebpackPlugin = require('eslint-webpack-plugin');
//const createEnvironmentHash = require('./webpack/persistentCache/createEnvironmentHash');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const modules = require('./modules');

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
const shouldUseReactRefresh = process.env.REACT_REFRESH;

const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
);

const useTsConfig = fs.existsSync(paths.appTsConfig);

//处理样式loader函数
const getStyleLoaders = (preOption) => {
    const loaders = [
        "style-loader",
        "css-loader",
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env'] //处理样式兼容问题
                }
            }
        },
        preOption
    ].filter(Boolean); //过滤
    return loaders;
}

module.exports = (env) => {
    return {
        // target:['browserslist'],// 指定环境
        stats: 'errors-warnings', //控制bundle打包信息的显示 （只在发生错误和警告时输出）
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        entry: {
            // cs: paths.appSrc + '\\ceshifuy.js',
            main: paths.appIndexJs,
        },
        bail: isEnvProduction, //打包出错时退出打包过程
        devtool: isEnvProduction
            ? shouldUseSourceMap
                ? 'source-map'
                : false
            : isEnvProduction && 'cheap-module-source-map',
        output: {
            path: paths.appBuild,
            filename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].js'
                : isEnvDevelopment && 'static/js/[name].js',
            clean: true,
            //懒加载包名称（用到时加载）
            chunkFilename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].chunk.js'
                : isEnvDevelopment && 'static/js/[name].chunk.js',
            assetModuleFilename: 'static/media/[name].[hash][ext][query]',
            // publicPath: paths.publicUrlOrPath
            devtoolModuleFilenameTemplate: isEnvProduction
                ? info =>
                    path
                        .relative(paths.appSrc, info.absoluteResourcePath)
                        .replace(/\\/g, '/')
                : isEnvDevelopment &&
                (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
        },
        optimization: {
            //只在生产环境压缩bundle
            minimize: isEnvProduction,
            minimizer: [
                //js代码压缩
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            //是否输出警告
                            warnings: false,
                            // 是否删除代码中所有的console语句，默认为不删除，开启后，会删除所有的console语句
                            drop_console: true,
                        },
                        output: {
                            //是否保留注释
                            comments: false,
                        }
                    }
                }
                ),
                new CssMinimizerPlugin(),
                // 压缩图片
                new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminGenerate,
                        options: {
                            plugins: [
                                ["gifsicle", { interlaced: true }],
                                ["jpegtran", { progressive: true }],
                                ["optipng", { optimizationLevel: 5 }],
                                [
                                    "svgo",
                                    {
                                        plugins: [
                                            "preset-default",
                                            "prefixIds",
                                            {
                                                name: "sortAttrs",
                                                params: {
                                                    xmlnsOrder: "alphabetical",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            ],
                        },
                    },
                }),
            ],
            splitChunks: {
                chunks: 'all',//所有模块进行分割
                //默认值
                minSize: 0, // >20kb时分割打包
                // minRemainingSize: 0,
                // minChunks: 1,
                // maxAsyncRequests: 30,
                // maxInitialRequests: 30,
                // enforceSizeThreshold: 50000,
                cacheGroups: {//打包模块组
                    react: {//组名
                        //react react-dom
                        test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
                        name: 'chunk-react',
                        priority: 50,
                    },
                    antd: {
                        test: /[\\/]node_modules[\\/]antd[\\/]/,
                        name: 'chunk-antd',
                        priority: 30,
                    },
                    lid: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'chunk-libs',
                        priority: 1,
                        // reuseExistingChunk: true,
                    },
                    // default: {
                    //     minSize: 0,
                    //     minChunks: 2, //多入口
                    //     priority: -20,
                    //     reuseExistingChunk: true, //从主bundle包中拆分出来的模块，会被复用，而不是生成新的
                    // },
                },
            },
            runtimeChunk: isEnvProduction && {
                // 保存引入文件的模块的依赖文件，当引入模块更新时，只需更新当前依赖文件(runtime)即可，无需更新主文件
                name: (entrypoint) => `runtime~${entrypoint.name}`  //entrypoint 入口文件
            }
        },
        //模块解析相关配置
        resolve: {
            //模块解析时搜索的目录,避免逐层查找
            modules: ['node_modules', paths.appNodeModules].concat(
                modules.additionalModulePaths || []
            ),
            //自动补全扩展名
            extensions: paths.moduleFileExtensions.map(ext => `.${ext}`).filter(ext => useTsConfig || !ext.includes('ts')),//过滤ts
            alias: {
                '@': paths.appSrc,
            }
        },
        //资源模块处理
        module: {
            rules: [
                shouldUseSourceMap && {
                    enforce: 'pre',
                    exclude: /@babel(?:\/|\\{1,2})runtime/,
                    test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                    loader: require.resolve('source-map-loader'),
                },
                {
                    //oneOf: 只使用第一个匹配的规则
                    oneOf: [
                        {
                            test: [/\.css$/],
                            use: getStyleLoaders()
                        },
                        {
                            test: [/\.s[ac]ss$/],
                            use: getStyleLoaders("sass-loader")
                        },
                        {
                            test: [/\.less$/],
                            use: getStyleLoaders("less-loader")
                        },
                        {
                            test: [/\.avif$/],
                            type: 'asset',
                            //使 rules 配置与 data 的 uri 进行匹配。
                            mimetype: 'image/avif',
                            //解析器配置
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit
                                }
                            }
                        },
                        {
                            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png/],
                            type: 'asset',
                            parser: {
                                dataUrlCondition: {
                                    maxSize: imageInlineSizeLimit
                                }
                            }
                        },
                        {
                            test: [/\.svg$/i],
                            use: [
                                {
                                    //loader:使用到的第三方loader
                                    loader: require.resolve('@svgr/webpack'),
                                    options: {
                                        prettier: false,
                                        svgo: false,
                                        svgoConfig: {
                                            plugins: [{ removeViewBox: false }],
                                        },
                                        titleProp: true,
                                        ref: true,
                                    }
                                },
                                {
                                    loader: require.resolve('file-loader'),
                                    options: {
                                        name: 'static/media/[name].[hash].[ext]',
                                    },
                                }
                            ]
                        },
                        {
                            test: [/\.(tsx?|js)$/],
                            // babel- loader：转换js代码
                            include: paths.appSrc,
                            loader: require.resolve('babel-loader'),
                            options: {
                                //对指定目录的转换做缓存
                                cacheDirectory: true,
                                //会使用 Gzip 压缩每个 Babel transform 输出
                                cacheCompression: false,
                                plugins: [
                                    isEnvDevelopment && shouldUseReactRefresh && require.resolve('react-refresh/babel') //激活js的HMR
                                ].filter(Boolean)
                            },

                        },
                        // {
                        //     test: /\.tsx?$/,
                        //     use: 'ts-loader',
                        //     exclude: /node_modules/,
                        // }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',//使用的html文件模块
                filename: 'index.html',//输出名称
                inject: 'body',//js文件生成位置
            }),
            !disableESLintPlugin && new EslintWebpackPlugin({
                extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
                context: paths.appSrc,
                exclude: 'node_modules',
                //任何警告都会导致模块构建失败
                failOnWarning: true,
                cache: true,
                //缓存路径
                cacheLocation: paths.appEslintCache
            }),
            isEnvProduction && new MiniCssExtractPlugin({
                filename: 'static/style/[name].css',
                chunkFilename: 'static/css/[name].chunk.css'
            }),
            //react热更新
            !isEnvProduction && new ReactRefreshWebpackPlugin()
        ].filter(Boolean),
        devServer: {
            host: 'localhost',
            port: 3000,
            open: true,
            hot: true,//热更新
            static: {
                directory: paths.appHtml,
            },
            historyApiFallback: true//history刷新问题
        },
        performance: false  //是否开启性能分析   （会降低打包速度）
    }
}