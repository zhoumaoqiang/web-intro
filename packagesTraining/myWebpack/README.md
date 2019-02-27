# 通过webpack打包项目

## 核心概念

1. entry（入口）
   - 入口用于指示打包后的项目有哪些起点，通常来说SPA会配置一个入口，如果是MPA会配置多个入口
   - 如果没有指定入口，那么入口的默认值是`./src`，一般将webpack的配置文件放在工程的根目录下，所以源码一般放在根目录的src文件夹下
2. output（出口）
   - 出口是打包文件后，资源放置的位置，可以指定output的path和filename，一般情况下将会将项目打包成一个js文件
   - 没有指定出口时，默认位置是`./dist`文件目录下
3. loader（加载器）
   - 静态资源的打包原本只支持`.js`文件（参考babel转换），由于加载器是针对模块的，所以在使用时应该配置在`module\rules`下，可以使用`test`和`use`属性，分别表示转化类型和使用的加载器插件
   - 设置的规则`rules`是一个数组，每组表示当遇到`test`定义的文件类型时，采用`use`定义的加载器首先进行解析
4. plugins（插件）
   - 插件的使用十分灵活，一般插件是一个数组，用于存放引入插件的实例等

## 安装webpack

安装webpack~~使用指令`npm install --save-dev webpack`~~，4.0以上的版本使用`npm install --save-dev webpack-cli`。可以在package.json中scripts选项配置多个指令，来执行不同的webpack配置，所以需要先通过`npm init -y`初始化一个`package.json`，以控制后面的npx交互，指令中`-y`指的是`-yes`，表示初始化过程中需要输入的选项全部为`yes`.

``` webpack config
"scripts": {
  "start": "webpack --config webpack.config.js"
}
```

安装完依赖后，按照默认的入口设置创建目录文件，添加`index.js`入口，并处于默认的入口文件夹`src`下。根目录的`index.html`是访问服务的默认文件。

```
  |- package.json
+ |- index.html
+ |- /src
+   |- index.js
```

此时如果`index.html`中有其余js的依赖，这种在html中通过scripts标签引入的js和src中的js模块管理不便，而且也不便理解。在没有使用`loader`之前，webpack只能打包js文件，所以讲html中的js依赖转移到src中，按照上面的目录结构代码为

``` index.html 关键代码
<head>
  <script src="https://unpkg.com/lodash@4.16.6"></script>
</head>
<body>
  <script src="./src/index.js"></script>
</body>
```

``` index.js _就是引入lodash的全局变量
function component() {
  var element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(component());
```

采用模块的方式来管理，降低文件之间的耦合···，总之将js单独管理起来，更改文件结构，调整`index.html`文件位置，解除html中JS的依赖，通过指令`npm i lodash`安装依赖到本地

``` structure
  |- package.json
+ |- /dist
+   |- index.html
- |- index.html
```

