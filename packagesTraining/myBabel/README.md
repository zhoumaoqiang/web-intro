# 用于编译JavaScript语法的包

## 安装程序

1. 在文件夹中初始化`package.json`用于后面添加模块的时候完成`npx`交互，控制台输入指令`npm init`，并输入相关信息
2. 创建一些初始化文件，`index.js`和`README.md`
3. 安装依赖模块`babel cli`，通过控制台输入指令`cnpm i --save-dev babel-cli`完成安装
4. 在`package.json`中添加打包的指令，最外层添加指令：
    ```
    "scripts": {
      "build": "babel src -d lib"
    }
    ```
5. 可以通过输入指令`npm run build`将`src`文件夹的内容放到`lib`下
6. 创建src，把目标代码放到src中，尝试

## 代码编译

尝试将src中的代码编辑到lib中，发现箭头函数等语法并没有发生改变，这是由于还需要更多的配置来指定编译过程。  
1. 配置通过在根目录创建一个`.babelrc`文件进行设置，需要应用的配置需要下载
2. 下载转换`ES2015`语法的插件，通过命令`cnpm install babel-preset-env --save-dev`
3. 下载完成后添加在`.babelrc`中定义
    ```
    {
      "presets": ["env"]
    }
    ```
4. 再次执行`npm run build`命令，查看编译结果，结果报错
    ```
    > babel_cli_test@1.0.0 build D:\Projects\test\package-manager\babel
    > babel src -d lib

    internal/modules/cjs/loader.js:583
        throw err;
        ^

    Error: Cannot find module 'core-js/library/fn/object/keys'
        at Function.Module._resolveFilename (internal/modules/cjs/loader.js:581:15)
        at Function.Module._load (internal/modules/cjs/loader.js:507:25)
        at Module.require (internal/modules/cjs/loader.js:637:17)
        at require (internal/modules/cjs/helpers.js:22:18)
        at Object.<anonymous> (D:\Projects\test\package-manager\babel\node_modules\_babel-runtime@6.26.0@babel-runtime\core-js\object\keys.js:1:93)
        at Module._compile (internal/modules/cjs/loader.js:689:30)
        at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
        at Module.load (internal/modules/cjs/loader.js:599:32)
        at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
        at Function.Module._load (internal/modules/cjs/loader.js:530:3)
        npm ERR! code ELIFECYCLE
        npm ERR! errno 1
        npm ERR! babel_cli_test@1.0.0 build: `babel src -d lib`
        npm ERR! Exit status 1
        npm ERR!
        npm ERR! Failed at the babel_cli_test@1.0.0 build script.
        npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

        npm ERR! A complete log of this run can be found in:
        npm ERR!     
    ```

## 纠正依赖

- 经过一系列的排查后，`node_modules`模块中很多依赖文件的后面跟上了版本号，导致运行`npm`无法找到仓库，回退npm版本或者执行npm去重指令都没有用，删除node_modules重新安装两个依赖
