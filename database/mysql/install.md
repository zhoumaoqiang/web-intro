# 安装设置

1. bin目录下配置my.ini文件，并在该目录层级下输入指令`mysqld --initialize --console`，等待后控制台输出
    ``` init password
    2018-12-25T14:50:21.467410Z 0 [System] [MY-013169] [Server] D:\MySQL\bin\mysqld.exe (mysqld 8.0.13) initializing of server in progress as process 1336
    2018-12-25T14:51:11.076344Z 5 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: init_password0
    2018-12-25T14:51:20.293987Z 0 [System] [MY-013170] [Server] D:\MySQL\bin\mysqld.exe (mysqld 8.0.13) initializing of server has completed
    ```
2. 上面给出的root用户的初始化密码就是`init_password0`，改密码默认有效期为0(操作表后)，所以后面的操作需要改动一次密码，下面首先将数据库初始化，输入指令`mysqld install`，如果安装时出现`Install/Remove of the Service Denied!`，尝试使用管理员身份打开控制台
3. 启动服务`net start mysql`，启动完成后会提示`MySQL 服务已经启动成功。`
4. 使用root权限登入mysql，`mysql -u root -p`，回车后提示输入密码，将上面的初始化密码输入即可
5. 连接完成后会显示信息
    ``` prompt information
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 8
    Server version: 8.0.13

    Copyright (c) 2000, 2018, Oracle and/or its affiliates. All rights reserved.

    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.
    ```
6. 登录成功后，命令提示符会展示为`mysql>`，通过指令`exit`或者`quit`退出
7. 想要操作数据，会提示`You must reset your password using ALTER USER statement before executing this statement.`，所以需要更改密码，由于是此处mysql为`v5.7.6`，使用指令`alter user user() identified by "my_password0"`，如果是该版本之前使用指令`SET PASSWORD = PASSWORD('my_password0');`
8. 修改密码，SET PASSWORD FOR 'root'@'localhost' = PASSWORD('1234560');
9. 连接navicat for mysql 需要先更改加密方式`ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;`，然后更改密码`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`，这样才允许访问