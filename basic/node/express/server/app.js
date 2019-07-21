const express = require('express')
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// 测试 接口
app.get('/socket/client/index.html', function (req, res) {
    res.send('<h1>welcome</h1>');
})

app.use('/client', express.static('client'));   // 聊天
app.use(express.static('public'));   // 全景图

//在线用户
let onlineUser = {}, onlineCount = 0;

io.on('connection', function (socket) {

    // =================================================  聊天信息
    //监听新用户加入
    socket.on('login', function (obj) {
        socket.name = obj.userid;
        //检查用户在线列表
        if (!onlineUser.hasOwnProperty(obj.userid)) {
            onlineUser[obj.userid] = obj.username;
            //在线人数+1
            onlineCount++;
        }
        //广播消息
        io.emit('login', {
            onlineUser: onlineUser,
            onlineCount: onlineCount,
            user: obj
        });
        console.log(obj.username + "加入了聊天室");
    })

    //监听用户退出
    socket.on('disconnect', function () {
        //将退出用户在在线列表删除
        if (onlineUser.hasOwnProperty(socket.name)) {
            //退出用户信息
            var obj = {
                userid: socket.name,
                username: onlineUser[socket.name]
            };
            //删除
            delete onlineUser[socket.name];
            //在线人数-1
            onlineCount--;
            //广播消息
            io.emit('logout', {
                onlineUser: onlineUser,
                onlineCount: onlineCount,
                user: obj
            });
            console.log(obj.username + "退出了聊天室");
        }
    })

    //监听用户发布聊天内容
    socket.on('message', function (obj) {
        //向所有客户端广播发布的消息
        io.emit('message', obj);
        console.log(obj.username + '说：' + obj.content);
    });


    // ================================================= 全景图远程控制
    socket.on('toggleAutorotate', function (obj) {
        io.emit('toggleAutorotate', obj);
    })

})






http.listen(4000, '172.20.10.11', function () {
    console.log('listening on *:4000');
});