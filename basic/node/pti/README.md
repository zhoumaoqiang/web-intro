# 自动化测试

## puppeteer

`Chrome 59`的更新，提出了`Headless Chrome`，`puppeteer`和`Lighthouse`，`Headless Chrome`是指没有界面的浏览器，可以执行一段浏览器的操作，却不用打开浏览器。由于基于`Chromium`内核可以模拟浏览器运行环境，不用展示界面就可以得到运行结果。`Puppeteer`就是用来做这件事情，并进行拓展的。`LightHouse`是用来测试浏览器性能，在下一版本就并入浏览器开发者工具了。

`Puppeteer`是用来控制`Chrome`和`Chromium`的库，除开可以实现在浏览器中完成的事情，`Puppeteer`还可以对页面截图或生成PDF，抓取SPA或者服务端渲染的页面，自动提交、UI测试和自动输入，使用最新的特性完成自动化测试，抓取时间轴诊断显示问题，测试Chrome拓展功能。  
安装`Puppeteer`使用指令:

```doc
npm i puppeteer
```

通过这样命令安装，会在安装时下载`Chromium`，来保证可以正常运行该环境，如果不想要下载可以使用指令`npm i puppeteer-core`，就只会下载依赖。由于没有`Chromium`，所以使用上面的指令，如果有本地的`Chromium`或者可以自己编译一份，那么可以不再安装，启动时指向本地的`Chromium`即可。

## istanbul

`istanbul`是用于测试代码覆盖率的工具，安装完成后可以直接启动测试，也可以在其他模块中引入使用。`istanbul`代码覆盖率测试维度有四个，分别是行(Statements)、函数(Branches)、分支(Functions)、语句(Lines)。

```dos
npm install -g istanbul
```

使用`istanbul`命令执行覆盖率测试，最终会返回四个维度的总数和执行数。

```dos
istanbul cover index.js
```

执行代码中，想要忽略覆盖率测试的，可以写注释代码。需要注意注释代码的位置，应该在语句之前，或者逻辑符号之后

```js
var object = parameter || /* istanbul ignore next */ {};

/* istanbul ignore if  */
if (hardToReproduceError)) {
    return callback(hardToReproduceError);
}
```

执行代码覆盖，无法识别ES6语法，包括`async`、箭头函数等，安装babel尝试。


## puppeteer-to-istanbul

将网页中测试代码覆盖率，使用`puppeteer-to-istanbul`，连通某个网页并获取页面中js，测试其覆盖率

```js
  const pti = require('puppeteer-to-istanbul')
  const puppeteer = require('puppeteer')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Enable both JavaScript and CSS coverage
  await Promise.all([
    page.coverage.startJSCoverage(),
    page.coverage.startCSSCoverage()
  ]);
  // Navigate to page
  await page.goto('http://www.baidu.com/');
  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);
  pti.write(jsCoverage)
  await browser.close()
```

## nwjs

nwjs原来名叫做`node-webkit`，是`chromium + node`的解决方案，使用方法是在`package.json`中，设置`main`为某个入口文件，然后将包含`package.json`的文件夹拖入`nw.exe`即可。

```json
{
  "name": "helloworld",
  "main": "index.html"
}
```

当设置一个`html`文件作为程序入口时，启动程序就可以直接开启目标文件。如果是`js`文件，则需要使用文档提供的方法开启。然后通过指令选择`package.json`目录下，nw可执行文件路径加上`nw.exe .`，启动程序，也可以将文件放在`nw.exe`文件目录下，直接执行`nw.exe .`，也可以将文件夹拖入`nw.exe`启动。

```js
nw.Window.open('index.html', {}, function(win) {});
```

通过`nw.exe`运行的时候，就会向运行程序注入一个全局的`nw`变量，调用`nw`的API能够完成大量操作。除此之外，在应用中还可以直接使用node的原生模块，或者使用经nw添加的npm包。


`nwjs`支持使用`nodejs`，但是`windows`系统需要`npm install -g nw-gyp`，然后替换`<npm-path>\node_modules\node-gyp\src\win_delay_load_hook.cc`。

```c++

#ifdef _MSC_VER

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif

#include <windows.h>

#include <delayimp.h>
#include <string.h>

static HMODULE node_dll = NULL;
static HMODULE nw_dll = NULL;

static FARPROC WINAPI load_exe_hook(unsigned int event, DelayLoadInfo* info) {
  if (event == dliNotePreGetProcAddress) {
    FARPROC ret = NULL;
    ret = GetProcAddress(node_dll, info->dlp.szProcName);
    if (ret)
      return ret;
    ret = GetProcAddress(nw_dll, info->dlp.szProcName);
    return ret;
  }
  if (event == dliStartProcessing) {
    node_dll = GetModuleHandle("node.dll");
    nw_dll = GetModuleHandle("nw.dll");
    return NULL;
  }
  if (event != dliNotePreLoadLibrary)
    return NULL;

  if (_stricmp(info->szDll, "iojs.exe") != 0 &&
      _stricmp(info->szDll, "node.exe") != 0)
    return NULL;

  return (FARPROC) node_dll;
}

decltype(__pfnDliNotifyHook2) __pfnDliNotifyHook2 = load_exe_hook;

#endif
```

### 使用npm包

要在nw中使用依赖， 必须通过`nw-gyp`来管理或者重建依赖的模块。通过`nw-gyp rebuild`使`npm`包起作用，如果没有作用就设置`npm`配置，并重新完整的注册一次。

``` command
npm i -g nw-gyp
set npm_config_target=0.21.6
set npm_config_arch=x64
set npm_config_runtime=node-webkit
set npm_config_build_from_source=true
set npm_config_node_gyp=C:\Users\xxxxxxxxx\AppData\Roaming\npm\node_modules\nw-gyp\bin\nw-gyp.js
npm install --msvs_version=2015
```

### 调试工具

调试必须要使用`SDK`，使用方法相同，可以通过`F12`打开控制台。

### 打包和发布

可使用`nwjs-builder-phoenix`工具进行打包，打包之前需要准备一些材料：

- 源码和资源
- `npm`引入的资源包
- 重新构建的第三方包
- 创建源客户端的二进制文件
- 编译源码并移除源文件
- 生成文件的icon

