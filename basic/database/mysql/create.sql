
--------------------------------------------------  命令行
-- 创建数据库， 注意不能选中数据库上下文时操作
CREATE DATABASE HOUSE;
-- 打印： Query OK, 1 row affected

-- 或者登陆时使用 `mysqladmin` 指令， 等同于 `mysqladmin -u root -p create HOUSE;` ，输入密码后创建成功。

-- 删除数据库， 注意不能选中数据库上下文时操作
DROP DATABASE HOUSE;
-- 实际操作没有提示(空库)

-- 选择数据库
use house;


-- 创建数据表, 需要在数据库的上下文操作
CREATE TABLE ROOM ( RoomId int, Area varchar(255), Color varchar(255), Intro varchar(255) );
-- 创建表时，每一个栏位都可以添加约束
CREATE TABLE ROOM ( RoomId int NOT NULL, Area varchar(255) , Color varchar(255), Intro varchar(255) );  -- NOT NULL 非空值
CREATE TABLE ROOM ( RoomId int UNIQUE, Area varchar(255) , Color varchar(255), Intro varchar(255) );  -- UNIQUE  唯一值
CREATE TABLE ROOM ( RoomId int PRIMARY KEY, Area varchar(255) , Color varchar(255), Intro varchar(255) ); -- 主键(必须存在且唯一)
CREATE TABLE ROOM ( RoomId int UNIQUE, Area varchar(255) , Color varchar(255), Intro varchar(255) FOREIGN KEY (RoomId) REFERENCES HOUSEROOM(RoomId)); -- 外键，其他表(HOUSEROOM)的主键
CREATE TABLE ROOM ( RoomId int CHECK (RoomId>0), Area varchar(255) , Color varchar(255), Intro varchar(255) ); -- 限制值的判断条件
CREATE TABLE ROOM ( RoomId int , Area varchar(255) DEFAULT "0", Color varchar(255), Intro varchar(255) )  -- 默认值



-- 删除数据表, 需要在数据库的上下文操作
DROP TABLE ROOM;

-- 删除数据表索引
ALTER TABLE ROOM DROP INDEX Area;

-- 清空数据表(释放空间)
TRUNCATE TABLE ROOM;

-- 清空数据表(不释放空间)
DELETE FROM ROOM;
---------------------------------------------------  命令行