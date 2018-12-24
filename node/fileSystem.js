const fs = require('fs');

// 在server和stream中提到些基础的文件读写操作

// 打开文件
// 文件路径、打开行为(r:读取,w:写入,a:追加)、
fs.open("./readFile.txt", "r", function (err, fd) {
  if (err) {
    return console.error(err)
  }
  // 文件描述符用于指向读取的文件，一般用于操作文件
  console.log("文件描述符", fd)
})

// 获取文件信息
fs.stat("./readFile.txt", function (err, stats) {
  if (err) {
    return console.error(err)
  }
  console.log("获取文件信息: ", stats)
  // 除了文件的基本信息外(文件大小、创建时间), stats还具有判断文件类型的方法
  console.log("文件类型file: ", stats.isFile());
  console.log("文件类型socket: ", stats.isSocket());
})


// 写入文件信息
var buffer = Buffer.from('ABC 这是一个测试的pdf写入文件 ABC', 'hex');
fs.writeFile("./output.txt", buffer, {
  encoding: 'base64'
}, function (err) {
  if (err) {
    return console.error(err)
  }
  console.log("写入文件完成");
})


// 读取文件     (打开 => 截取(超出长度被删除) => 读取 => 关闭)
var buf = new Buffer.alloc(1024); // 分配一个1024长度的数据缓冲区，用于后面存储数据
fs.open('./readFile.txt', 'r+', function (err, fd) {
  if (err) {
    return console.error(err);
  }
  fs.ftruncate(fd, 10, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log("文件截取完成");
    // 文件描述符、数据写入的缓冲区、写入缓冲区的偏移量、文件中读取的字节数、文件读取的起始位置、完成回调
    fs.read(fd, buf, 0, buf.length, 0, function (err, bytes) {
      if (err) {
        return console.error(err);
      }
      console.log(bytes + "  字节被读取");

      // 仅输出读取的字节
      if (bytes > 0) {
        console.log("缓冲区数据读取结果为: ", buf.slice(0, bytes).toString());
      }

      fs.close(fd, function (err) {
        if (err) {
          return console.error(err);
        }
        console
      })
    });
  });
});

// 删除文件
fs.unlink('./output.txt', function(err) {
  if (err) {
    return console.error(err);
  }
  console.log("文件删除成功！");
});


// 创建目录
fs.mkdir('/node/testdir', {
  recursive: true   // 允许递归创建目录 
}, function(err) {
  if(err) {
    return console.error(err);
  }
  console.log("创建目录:", '/testdir');
})


// 读取目录
fs.readdir(__dirname, function(err, files) {
  if(err) {
    return console.error(err);
  }
  console.log("当前目录下文件为", files); // files是一个数组
})

// 删除目录
fs.rmdir('/node/testdir2', function(err) {
  if(err) {
    return console.error(err);
  }
  console.log("文件目录已删除");
})