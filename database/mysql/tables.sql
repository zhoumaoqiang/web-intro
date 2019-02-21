-- 操作多张表的数据

-- 创建第二张表，并插入一些数据
CREATE TABLE HOUSEROOM ( RoomId int, Area varchar(255), Color varchar(255), Intro varchar(255) );
-- 插入数据
INSERT INTO HOUSEROOM VALUES (5, "130", "red", "play room");
INSERT INTO HOUSEROOM VALUES (6, "20.9", "white", "living room");

-- INNER JOIN 匹配另一个数据库筛选条件(泛选条件)，展示数据库数据
SELECT * FROM ROOM INNER JOIN HOUSEROOM ON ROOM.Color = HOUSEROOM.Color;  -- 显示条件完全相同的数据
-- SELECT * FROM ROOM LEFT JOIN HOUSEROOM ON ROOM.Color = HOUSEROOM.Color;   -- 显示两表所有数据，左右比较 < mysql 不支持此语法>
SELECT * FROM ROOM LEFT JOIN HOUSEROOM ON ROOM.Color = HOUSEROOM.Color; -- 左右分别显示两张表的数据，room表全量，houseroom表只有匹配项，不匹配全部为null
SELECT * FROM ROOM RIGHT JOIN HOUSEROOM ON ROOM.Color = HOUSEROOM.Color;  -- 与LEFT对应

-- 合并查询结果(用于多张表之间的查找)
SELECT * FROM ROOM UNION SELECT * FROM HOUSEROOM;
SELECT * FROM ROOM WHERE Color = "white" UNION SELECT * FROM HOUSEROOM WHERE Color = "white";

-- 多个表之间，数据的复制粘贴
-- CREATE TABLE NEWROOM AS SELECT * FROM ROOM; -- 复制表结构+数据， 新建表
SELECT * INTO ROOM FROM HOUSEROOM;  -- 将houseroom中的所有数据复制到room中，可以指定列、条件、多条数据或表 < mysql 不支持这个语法 >
INSERT INTO ROOM SELECT * FROM HOUSEROOM WHERE RoomId = 6;  -- 功能同上，语法支持
