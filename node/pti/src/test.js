const { exec } = require('child_process'); //子进程，用于打开文件夹

// 使用istanbul进行代码覆盖率测试，需要注意语法不支持ES6，无法生成报告

// 运行指令可通过webpack转换后测试，提供有一个 babel-plugin-istanbul

var test = require('./test1.js').test

var a = 1;
var b = 2;
if(a + b > 10) {
  console.log(a * b)
} else {
  test(b).then(data=>console.log(data))
}


exec('start D:\\Projects\\test\\puppeteer\\coverage\\lcov-report\\index.html');