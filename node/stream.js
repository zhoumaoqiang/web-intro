const fs = require("fs");
const zlib = require('zlib');

// 读取文件流
var readFileStr = '';
var readerStream = fs.createReadStream('./readFile.txt'); // 创建可读流
readerStream.setEncoding('UTF8'); // 设置编码为 utf8。
// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
   readFileStr += chunk;
});
readerStream.on('end',function(){
   console.log(readFileStr);
});
readerStream.on('error', function(err){
   console.log(err.stack);
});


// 写入文件流
var data = "写入文件的字符串：Hello World!";
var writerStream = fs.createWriteStream('output.txt');
// 直接写入其他格式(如pdf)，文件结构不正确，无法正常识别
writerStream.write(data,'UTF8');
writerStream.end(); // 标记文件末尾
writerStream.on('finish', function() {
    console.log("写入完成。");
});
writerStream.on('error', function(err){
   console.log(err.stack);
});


// 数据流的流转——管道
// 将读取流的数据写入到输出流，由于前面有写入操作，所以管道传输待前面写入完成再执行
setTimeout(function() {
    readerStream.pipe(writerStream);
}, 2000)

// 文件压缩和解压
// 通过管道流和链式流压缩和解压文件，链式是通过连接输出流到另外一个流并创建多个流操作链的机制
fs.createReadStream('./readFile.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));

fs.createReadStream('./input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('input.txt'));