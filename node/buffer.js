/**
 * =====  编码格式
 * ascii - 仅支持 7 位 ASCII 数据。如果设置去掉高位的话，这种编码是非常快的。
 * utf8 - 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8 。
 * utf16le - 2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。
 * ucs2 - utf16le 的别名。
 * base64 - Base64 编码。
 * latin1 - 一种把 Buffer 编码成一字节编码的字符串的方式
 * binary - latin1 的别名。
 * hex - 将每个字节编码为两个十六进制字符。
 */

//创建buffer实例的方式，创建对象都是数字(十六进制)
var buf1 = Buffer.alloc(10);
var buf2 = Buffer.alloc(10, 1);
var buf3 = Buffer.allocUnsafe(10);  // 该方法创建对象不会被初始化，重写数据只会替换有效的部分(长度)，可以fill后write
var buf4 = Buffer.from([1, 2, 3]);
var buf5 = Buffer.from('tést');
var buf6 = Buffer.from('tést', 'latin1');
// console.log(buf1, buf2, buf3, buf4, buf5, buf6);

// 写入缓冲区
var buf7 = Buffer.allocUnsafe(50);
var len7 = buf7.write("hello world! 好");
// 长度不足时写入部分字符串，长度未填满是剩余都是0
console.log('Buffer类的值为:' + buf7);
console.log("写入字节数长度: " +  len7);

// 读取缓冲区数据
console.log(buf7.toString()); // 默认utf8，全部长度
console.log(buf7.toString('ascii'));
console.log(buf7.toString('base64'));

// 转换成json
var json = buf7.toJSON();   // json
var jsonStr = JSON.stringify(buf7);   // string
console.log('转成json格式字符串是先调用toJSON :', jsonStr);

// 拼接buffer缓冲区
var buf8 = Buffer.from(('12345'));
var buf9 = Buffer.from(('abcde'));
var buf10 = Buffer.concat([buf8, buf9]);
console.log("拼接后内容: " + buf10.toString());

// 比较buffer
var buf11 = Buffer.from('ABC');
var buf12 = Buffer.from('B');
var result = buf11.compare(buf12);
// 同ASCII码比较方式，返回-1,0,1
console.log(result) // -1

// 复制粘贴
var buf13 = Buffer.from('0123456789abcde');
var buf14 = Buffer.from('你好');
buf14.copy(buf13, 4);   // 将buf14复制到buf13的第四位开始
console.log(buf13.toString())

// 截取
var buf15 = Buffer.from('0123456789');
var buf16 = buf15.slice(0, 6);
// 返回的buffer不是一个新的存储区域，而是原存储数据
console.log("截取的值为: " + buf16.toString());