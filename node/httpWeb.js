const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function (req, res) {

  // 解析请求，获取文件路径和文件名
  var pathname = url.parse(req.url).pathname;

  // 输出请求的文件名
  console.log("请求文件路径为: " + pathname);

  // 从文件系统中读取请求的文件内容
  fs.readFile(pathname.substr(1), function (err, data) {
    if (err) {
      console.log(err);
      res.writeHead(404, {
        'Content-Type': 'text/html'
      });
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });

      // 响应文件内容
      res.write(data.toString());
    }
    //  发送响应数据
    res.end();
  });

}).listen(8080);


// 服务端向服务端发送请求(没有效果)
var req = http.request({
  host: '127.0.0.1',
  port: '8080',
  path: 'test.html'
}, function(res){
  var body = "";
  res.on('data', function(data) {
    body += data;
  });
  res.on('end', function() {
    console.log("body:", body)
  })
})
setTimeout(function(){
  req.end();
}, 1000);