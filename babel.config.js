module.exports = {
    //插件集合
    //babel-preset-react-app：提供了react和js的配置
    //@babel/preset-env：代码转换为es5，允许使用最新的js代码语法
    //@babel/preset-react：react语法转换
    //@babel/plugin-transform-runtime：转换过程中重用辅助函数，不会在每次转换时重新生成，这意味着相同的辅助函数在输出的代码中只会出现一次，从而减少了代码的体积和重复。
    //（babel会为每一个文件都插入辅助代码，使代码体积变大   如_extend: 会对每个需要它的文件都添加进去  ---- 可以对辅助代码作为一个独立模块避免重复引入）
    //core.js :处理poly-fill  promise  Array.includes
        presets: ['react-app']
}