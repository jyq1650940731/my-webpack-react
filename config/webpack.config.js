const path = require('path');
const paths = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin'); //实例对象
// const createEnvironmentHash = require('./webpack/persistentCache/createEnvironmentHash');

require('dotenv').config();

// console.log(createEnvironmentHash);

module.exports = (env) => {
    // const isEnvDevelopment = env === 'development';
    // const isEnvProduction = env === 'production';
    const isEnvDevelopment = env.development;
    const isEnvProduction = env.production;
    const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
    console.log(paths.publicUrlOrPath);
    return {
        // target:['browserslist'],// 指定环境
        stats: 'errors-warnings', //控制bundle打包信息的显示 （发生错误和警告时输出）
        mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
        entry: paths.appIndexJs,
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
                : isEnvDevelopment && 'static/js/bundle.js',
            clean: true,
            //懒加载包的名字（用到时加载）
            chunkFilename: isEnvProduction
                ? 'static/js/[name].[contenthash:8].chunk.js'
                : isEnvDevelopment && 'static/js/[name].chunk.js',
            assetModuleFilename: 'static/media/[name].[hash][ext]',
            // publicPath: paths.publicUrlOrPath
            devtoolModuleFilenameTemplate: isEnvProduction
                ? info =>
                    path
                        .relative(paths.appSrc, info.absoluteResourcePath)
                        .replace(/\\/g, '/')
                : isEnvDevelopment &&
                (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
        },
        // cache: {
        //     type: 'filesystem',
        //     version: createEnvironmentHash(env.raw),
        //     cacheDirectory: paths.appWebpackCache,
        //     store: 'pack',
        //     buildDependencies: {
        //         defaultWebpack: ['webpack/lib/'],
        //         config: [__filename],
        //         tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f =>
        //             fs.existsSync(f)
        //         ),
        //     },
        // },

        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',//使用的html文件模块
                filename: 'app.html',//输出名称
                inject: 'body',//js文件生成位置
            })
        ]
    }
}