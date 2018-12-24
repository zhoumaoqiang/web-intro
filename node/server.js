const http = require('http');
const fs = require('fs');
const events = require('events');


// 创建一个http服务并返回"Hello World"
http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8888);

console.log("Server running at http://127.0.0.1:8888");


// 文件读取
var data = fs.readFileSync('./readFile.txt');//(没有文件报错阻塞，使用下面的异步方法不会)
console.log(data.toString());
console.log('同步读取文件完成');

fs.readFile('./readFile.txt', function(err, data) {
  if(err) console.error(err);
  console.log(data.toString());
  eventEmitter.emit('fileLoaded');
});
console.log('异步读取文件');

// 事件监听(一般不作为自定义使用)
const eventEmitter = new events.EventEmitter(); // 通过事件绑定(on)和事件触发(emit)
eventEmitter.on('portOpened', function() {
  console.log('==== 事件：端口已开启 ===');
  eventEmitter.emit('onServer');
});
eventEmitter.on('onServer', function() {
  console.log('==== 事件：服务已启动 ===');
});
eventEmitter.on('fileLoaded', function() {
  console.log('==== 事件：文件读取完成 ===');
});
eventEmitter.addListener('fileLoaded', function() {
  console.log('=== 事件监听：增加的事件监听 ===');
})
// 上面创建http服务是同步的，无法正确出发改事件，所以放在后面
eventEmitter.emit('portOpened');

