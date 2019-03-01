const express = require('express');
const app = express();
const fs = require('fs');
const util = require('util');
const proxy = require('http-proxy-middleware')

// 引入中间键
const bodyParser = require('body-parser') // 获取post请求参数
const multer = require('multer') // 接收解析formData
const cookieParser = require('cookie-parser') // 获取解析cookie(转换成对象)

// 应用中间键
app.use(express.static('public')); // 静态文件中间键，静态资源全匹配可直接访问
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/' }).array('image'));
app.use(cookieParser())

// 服务器代理
app.use(proxy(['/maps', '/theme', 'count'], {
  target: 'https://webapi.amap.com', 
  changeOrigin: true 
}))
app.use('/api', proxy({
  target: 'https://vdata.amap.com', 
  changeOrigin: true 
}))


// GET
app.get('/', function (req, res) {
  console.log("主页 GET 请求");
  res.send('GET Hello World');
})

// POST
app.post('/get_user', function (req, res) {
  // 使用中间键后在res上面获取的参数是对象形式的
  console.log("/get_user 响应 DELETE 请求");
  res.send(JSON.stringify({
    name: '小王',
    age: '21',
    sex: 'male'
  }));
})

// COOKIE
app.get('/get_cookie', function(req, res){
  console.log('Cookie: ' + util.inspect(req.cookie));
})

// POST 上传文件(formData)
app.post('upload', function (req, res) {
  console.log(res.files[0]);
  var des_file = __dirname + "/public/upload/" + req.files[0].originalname;
  fs.readFile(req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        console.log(err);
      } else {
        response = {
          message: 'File uploaded successfully',
          filename: req.files[0].originalname
        };
      }
      console.log(response);
      res.end(JSON.stringify(response));
    });
  });
})


var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

server.on('request',function(request, response) {

})