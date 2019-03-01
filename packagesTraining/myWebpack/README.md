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

调整html和js中的代码

``` index.html 解除依赖，只保留main.js，也就是打包完成的输出文件
<body>
  <script src="main.js"></script>
</body>
```

``` index.js 引入依赖，多了第一句引入依赖的代码
import _ from 'lodash';
function component() {
  var element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
document.body.appendChild(component());
```

通过指令`npx webpack`，将资源打包输出为一个main.js文件，成功后文件放至`./dist`文件夹中，index.html就可以直接访问。  
但是发现运行报错，查看依赖只有`webpack-cli`，安装`webpack`，再次执行打包的命令`npx webpack`，发现指令执行成功。  
执行命令时，警告信息提示要设置`mode`为生产还是开发，而前面有提过一个指令包含`--config webpack.config.js`，所以的确存在这么一个文件用于配置打包的选项。

## 使用webpack配置

添加配置在根目录创建一个`webpack.config.js`文件，配置文件将会作为一个模块在编译时读取加载。

``` webpack.config.js 例如一个指定入口和出口的配置
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

通过指令`npx webpack --config webpack.config.js`完成编译，完成后再dist下生成了`bundle.js`文件。所以此时可以添加上`mode`属性，设置`production`或者`development`就不会再出现警告了。  
每次通过`npx`指令指定配置进行编译显得很麻烦，可以在`package.json`中设置`scripts`添加指令`"build": "webpack"`。

## 配置加载器

前面提到webpack默认只能对javascript文件打包，想要对其他资源一并打包，需要通过loader添加模块规则。

### CSS loader

要支持CSS加载，首先需要安装两款依赖，通过指令`npm install --save-dev style-loader css-loader`完成。在配置文件中，加入module属性

``` webpack.config.js
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }
  ]
}
```

在介绍核心的时候讲过，上面配置的意思是使用`style-loader`和`css-loader`这两个插件将以`.css`结尾的文件打包到静态资源输出中。  
将CSS文件当做模块处理，意味着CSS文件可以通过js模块的方式引入到js文件中。创建`style.css`文件，并引入`index.js`模块

``` index.js
import './style.css';
```

### file(image) loader

图片如果在webpack支持的模块中使用，那么通过`file-loader`可以将图片一并打包至编译后的包中。分别使用小分辨率的小图片和大分辨率的大图片进行加载。  
在js模块和css模块中引用图片，配置文件`module/rules`添加

``` webpack.config.js file-loader
{
  test: /\.(png|svg|jpg|gif)$/,
  use: [
    'file-loader'
  ]
}
```

需要注意的是，在js中必须通过`import`的方式引入图片，才会将文件作为一个模块对待，引入的对象作为字符串的路径对待即可。并且这里无论图片大小都没有进行数据转换，想要图片转为base64，需要进行额外的配置。  
同一个加载器可以进行多个规则的匹配，例如文件模块还包括字体文件的使用。  

```
{
  test: /\.(woff|woff2|eot|ttf|otf)$/,
  use: [
    'file-loader'
  ]
}
```

### data loaders

加载存储数据的单元，例如json、xml、csv等，json是node内置支持的，其余格式的数据也有类似的加载器。

``` webpack.config.js
{
  test: /\.(csv|tsv)$/,
  use: [
    'csv-loader'
  ]
},
{
  test: /\.xml$/,
  use: [
    'xml-loader'
  ]
}
```

引入一个xml文件，引入为模块查看结果，转换输出为json格式的数据

``` data.xml
<?xml version="1.0" encoding="UTF-8"?>
<note>
  <to>Mary</to>
  <from>John</from>
  <heading>Reminder</heading>
  <body>Call Cindy on Tuesday</body>
</note>
```

## 输出管理

这里的输出管理只是对于输出文件和载体的管理（文档载体、文件清理等），并不是针对多页开发的目录输出。想要实现多页面，自行参考`html-webpack-plugin`的详细使用方案。  
前面的js模块、css、文件等都可以通过加载器完成静态资源的打包处理，但是`index.html`文件始终放在输出的文件夹中并不符合代码书写的习惯。  
因此，我们可以使用插件来处理这一问题，通过指令`npm install --save-dev html-webpack-plugin`安装html的管理插件，。  
在`webpack.config.js`中的主要更改为： 

``` webpack.config.js plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Output Management'
    })
  ]
};
```

插件的详细使用方法可以参考[这里](https://github.com/jantimon/html-webpack-plugin)，主要作用就是在输出管理的文件夹中创建一个`index.html`，并且将所有关联的`bundle.js`添加进去。

前面都是只对`index.js`文件实现输出，也就是单一的输出。前面提到过多个输入可以添加`entry`的属性和值，显然输出文件看上去并不适用，多个输入输出引入html可定义如下：  

```
const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

打包完成后会生成`app.bundle.js`和`print.bundle.js`两个文件，结合上面的`html-webpack-plugin`插件，可以看到html文件中引入了两个js文件。

当输出的文件夹有废弃的文件时，每次打包除去名字重复的覆盖原文件，还有不重名的无效文件，要保证`./dist`文件夹干净，可以引入另一个插件，控制台输入指令`npm install clean-webpack-plugin --save-dev`完成安装，在配置`plugins`中添加。

```
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ]
}
```

每次build之前会清空输出的文件夹，再将打包后的文件写入。

## 开发工具

### 源文件追踪

输出的一个模块如果引入了多个模块，当引入模块报错时，无法定位已经输出的模块中引入模块的错误位置，所以webpack提供了开发者工具`source map`来定位引用模块的错误。定义后，如果引用模块发生错误，控制台会输出错误模块的发声位置，然后对照源码进行检查就可以了。

``` webpack.config.js
module.exports = {
  devtool: 'inline-source-map'
}
```

### 实时刷新

webpack提供了检测文件变化，并实施编译的指令，结合可以开启webpack服务并且实时刷新浏览器的插件`npm install --save-dev webpack-dev-server`，就可以完成代码到展示的实时刷新。

``` package.json scripts 检测文件编译，--config webpack.config.js是默认值，可以不加
"scripts": {
  "watch": "webpack --watch"
}
```
开启服务除了配置devServer，还需要输入指令`webpack-dev-server --open`，或者在`package.json`中添加指令。

``` webpack.config.js webpack-dev-server，可以不引入模块
devServer: {
  contentBase: './dist'
},
```

``` package.json
"scripts": {
  "start": "webpack-dev-server --open"
}
```

### 转接服务

使用`npm install --save-dev express webpack-dev-middleware`，这个指令是安装中间件用于express的服务，也就是用于node开启服务，插件会把打包出来的内容提供给服务器允许资源的访问。  
由此可知，前面安装的`webpack-dev-server`实际上也是用了这个插件，只不过这里可以单独提出来用于其他的服务。想要功能正常运行，需要对配置进行一点小小的调整。 

``` webpack.config.js output
const path = require('path')
module.exports = {
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  }
};
```

## 模块热替换

前面提到实时刷新，如果总是编译打包在重启服务，可想而知性能将会十分的慢。好的是`webpack-dev-server`这个包里面继承了热加载的模块，所以使用`webpack-dev-server`是没有问题的。如果想要自定义，那么就需要进行许多的配置了。  
不使用`webpack-dev-server`直接启动，而是结合nodejs API开启服务，需要引入该模块，并在开启服务的模块中进行一定的设置。  
自定义的模块热替换，会出现无法完全辨识的问题。例如引入一个模块的方法发生了改变，将这个暴露的方法绑定到一个时间处理上，输出方法发现已经热替换了，触发事件却发现仍是原来的函数。  
热加载时对模块有效，意思就是通过加载器引入的文件，已经当做了模块来处理，那么这些模块也会触发热加载。

## tree shaking

摇树优化就是指分析代码并删除未引用的部分，依赖于静态结构`import`和`export`。由于函数副作用，也就是直接或者间接的引用了外部或者全局变量，导致函数不是纯函数而不会被删除，这是很容易发生的，特别针对于使用babel插件转换代码，会把函数定义在原型上。  
webpack针对函数副作用，允许在`package.json`中定义`sideEffects`属性为false，标注定义模块均是安全，没有副作用的，可以放心删除。或者给定一个带有副作用模块的数组。

``` package.json 所有模块都没有副作用
{
  "sideEffects": false
}
```

``` package.json 标注具有副作用的模块
{
  "sideEffects": [
    './src/index.js'
  ]
}
```

优化除了找到未使用部分，将`mode`设置为`production`，webpack将启用`uglifyjs`将代码压缩输出。

## 生产环境构建

### 开发和生产配置

生产环境和开发环境可以通过`webpack-merge`工具，构建出通过、开发、生产的webpack配置，控制台输入指令`npm install --save-dev webpack-merge`完成安装。  

``` 根目录下结构
- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js
```

其中common是通用的配置，总是生效。`dev`和`prod`分别是开发环境和生产环境，属于配置的分支，关键代码如下

``` webpack.common.js
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

``` webpack.dev.js
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
});
```

``` webpack.prod.js
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  plugins: [
    new UglifyJSPlugin()
  ]
});
```

对照前面的配置进行修改配置，那么可想而知，`package.json`中的指令`--config webpack.config.js`应该指向`dev`和`prop`两个配置，对应开发和生产环境。

``` package.json
{
  "scripts": {
    "start": "webpack-dev-server --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  }
}
```

### 代码压缩

webpack提供`uglifyJSPlugin`用于压缩代码，除此之外引入其他的压缩插件也是可行的，`BabelMinifyWebpackPlugin`可以解决babel转换后函数副作用的问题，`ClosureCompilerPlugin`具有项目的流程分析和优化，可以压缩到更小的文件体积。

### source map

浏览器中的source map，对于webpack打包后仍建议显示出，可以通过更改生产配置

``` webpacl.prod.js
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'source-map',  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]
});
```

## 代码分离

### 公共模块依赖切除和样式分离

公共组件的引用可以通过配置进行剔除，插件为`webpack`自身支持，引入`plugins`.

``` webpack.common.js
const webpack = require('webpack)
module.exports = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common' // 指定公共 bundle 的名称。
    })
  ]
}
```

webpack还有一些其他有用的插件，例如`ExtractTextPlugin`用于将CSS代码从主应用程序中分离，`bundle-loader`分离代码和延迟加载生成的`bundle`，使用插件`promise-loader`也可以达到该目的，只不过应用上是使用promise实现。

## 懒加载

懒加载的实现就是在触发某个动作，才进行import操作，例如

``` example
button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
  var print = module.default;
  print();
});
```

更多的时候，懒加载可能是配合框架使用，例如`Vue`，可以参考webpack官网链接。  