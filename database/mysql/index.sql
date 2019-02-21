-- 创建索引可以提高查找速度

-- 创建索引
CREATE UNIQUE INDEX RIndex ON ROOM (RoomId);
CREATE INDEX RIndex ON ROOM (RoomId, Intro);

-- 创建自增的列
CREATE TABLE ROOM (RoomId INT IDENTITY(1,1)); -- 从1开始自增，每次增加1
-- CREATE TABLE ROOM (RoomId INT AUTO INCREMENT); -- mysql

-- 修改已有表结构
-- ALTER TABLE ROOM CHANGE RoomId RoomId INT( 11 ) NOT NULL AUTO_INCREMENT;  -- mysql

-- 创建视图
-- CREATE VIEW room_time AS SELECT * FROM ROOM WHERE RoomId NOT NULL;   -- 创建视图使用sql函数
SELECT * FROM room_time; -- 之后的操作直接使用视图的名称

-- CREATE VIEW [useful room name] AS SELECT * FROM ROOM WHERE RoomId NOT NULL; -- 一个较长的名字


