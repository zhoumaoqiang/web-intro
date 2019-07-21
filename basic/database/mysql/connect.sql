-- 连接数据库
-- 指令： mysql -u root -p
-- -u 表示用户，root就是根用户，可以再mysql库中增加用户， -p 是输入密码的指令，所以该指令输入完成后，输入密码就可以连接mysql

-- 查看所有的数据库
-- show DATABASES;

-- 选择数据库，选中之后提示 `Database changed`
use mysql;

-- 查看表
-- show TABLES;

-- 查看表的栏位(列)
-- show COLUMNS FROM user;
-- 展示数据包括数据表的属性，属性类型，主键信息 ，是否为 NULL，默认值等其他信息

-- 只查看表的索引
-- show INDEX FROM user;

-- 查询数据库性能信息等
-- show TABLE STATUS FROM mysql;
-- SHOW TABLE STATUS from mysql LIKE 'alter%';  --库中以alter开头的表
-- SHOW TABLE STATUS from mysql LIKE 'alter%'\G;  --库中以alter开头的表，并格式化成列打印


-- 查看数据
-- SELECT * FROM mysql;
