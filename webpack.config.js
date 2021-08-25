/*
 * @Author: your name
 * @Date: 2021-08-23 00:27:14
 * @LastEditTime: 2021-08-23 20:47:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \express\webpack.config.js
 */
const path = require('path');

// 这个配置文件，其实就是一个JS文件，通过Node中的模块操作，向外暴露了一个配置对象。
module.exports = {
    // 配置webpack 生产环境 development  和开发环境 production
    mode: 'development',
    entry: path.join(__dirname, './ts/app.ts'), // 入口表示要使用webpack打包那个文件

    output: {
        path: path.join(__dirname, './dist/app'), // 出口 指定打包好的文件输出到那个目录中去
        filename: 'buddle.js' // 这是指定输出文件的名称
    },
    module: {
        rules: [
            //   {
            //     test: /\.js$/,
            //     use: {
            //       loader: "babel-loader",
            //       options: {
            //         presets: ["@babel/preset-env", "@babel/preset-react"],
            //         plugins: ["@babel/plugin-proposal-class-properties"],
            //       },
            //     },
            //   },
            //   {
            //     test: /\.less$/,
            //     exclude: /node_modules/,
            //     use: ["style-loader", "css-loader", "less-loader"],
            //   },
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader'
                },
                exclude: /node_modules/
            }
        ]
    }
};
