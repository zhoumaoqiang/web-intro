const http = require('http');
const url = require('url');
const util = require('util');
const querystring = require('querystring');

http.createServer(function(req, res) {

  // POST请求: 采用请求体接受数据的事件实现POST请求
  var post = '';

  req.on('data', function(chuck) {
    post += chuck;
  })
  req.on('end', function() {
    // querystring用于解析post方式传递的参数
    post = querystring.parse(post);
    res.end(util.inspect(post));
  })


  // GET请求
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8;'});

  // res.write可以在响应中写入信息
  res.write("在响应中写入信息，包括html格式的字符串");

  /**
   * 所以可以使用文件系统读取html字符串，并传送给客户端
   * 见 httpWeb.js
   */

  // url.parse可以用于解析get方式请求的参数
  res.end(util.inspect(url.parse(req.url, true)));
}).listen(8080)