# EXPRESS

## 安装express

由于之前已经创建过`express`并同步到github上，这次操作的时候没有本地的依赖包，重新安装`express`提示拒绝注册同名的包，所以将`package.json`里面包的名字改为`express-server`，再重新`npm i express`完成依赖安装。  
还有一种安装方式，使用express迭代器安装完成后，会自动搭建出一个服务骨架，这个结构也可以由自己手动搭建，可灵活应用。

``` command
npm install express-generator -g
npm install
```

## 设置为服务器代理

现在应用是在内网，但是想调用外网的高德地图服务，所有的请求依赖于引用高德的一个js文件。  
安装服务器代理中间件，并在入口程序中引入设置。

``` command
npm i http-proxy-middleware
```

``` entry index.js
const proxy = require('http-proxy-middleware')

app.use('/api', proxy({ target: 'https://vdata.amap.com', changeOrigin: true }))
```

这样的设置相当于将`protal://localhost:port/api`的服务转交给`https://vdata.amap.com/api`，当多个接口都要进行服务代理，参考`index.js`中的写法。