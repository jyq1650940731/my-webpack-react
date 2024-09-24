
const path = require('path');
const fs = require('fs');
//realpathSync:同步计算规范路径名   确保解析项目中的符号路径名
//根目录
const appDirectory = fs.realpathSync(process.cwd());

// 解析获取绝对路径
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

//获取资源的公共访问路径
const publicUrlOrPath = getPublicUrlOrPath(
    process.env.NODE_ENV === 'development',
    //查看是否使用package.json中homepage的路径
    require(resolveApp('package.json')).homepage,
    //否则在环境变量中查找PUBLIC_URL
    process.env.PUBLIC_URL
    //默认为：/
);

//生产路径
const buildPath = process.env.BUILD_PATH || 'build';
console.log(buildPath);
//扩展名
const moduleFileExtensions = [
    'web.mjs',
    'mjs',
    'web.js',
    'js',
    'web.ts',
    'ts',
    'web.tsx',
    'tsx',
    'json',
    'web.jsx',
    'jsx',
];

//解析模块
const resolveModule = (resolveFn, filePath) => {
    const extension = moduleFileExtensions.find(extension =>
        fs.existsSync(resolveFn(`${filePath}.${extension}`)) // 找到符合当前规则的路径
    );

    //文件解析
    if (extension) {
        return resolveFn(`${filePath}.${extension}`);
    }
    return resolveFn(`${filePath}.js`);
};

module.exports = {
    dotenv: resolveApp('.env'),
    appPath: resolveApp('.'),
    appBuild: resolveApp(buildPath),
    appPublic: resolveApp('dist'),
    appHtml: resolveApp('dist/index.html'),
    appIndexJs: resolveModule(resolveApp, 'src/index'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appTsConfig: resolveApp('tsconfig.json'),
    appJsConfig: resolveApp('jsconfig.json'),
    yarnLockFile: resolveApp('yarn.lock'),
    testsSetup: resolveModule(resolveApp, 'src/setupTests'),
    proxySetup: resolveApp('src/setupProxy.js'),
    appNodeModules: resolveApp('node_modules'),
    appWebpackCache: resolveApp('node_modules/.cache'),
    appTsBuildInfoFile: resolveApp('node_modules/.cache/tsconfig.tsbuildinfo'),
    appEslintCache: resolveApp('node_modules/.cache/.eslintcache'),
    swSrc: resolveModule(resolveApp, 'src/service-worker'),
    publicUrlOrPath,
  };

  module.exports.moduleFileExtensions = moduleFileExtensions;