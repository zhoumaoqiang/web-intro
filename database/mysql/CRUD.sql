-- 添加数据
INSERT INTO ROOM VALUES (1, "16.5", "white", "second bedroom");
INSERT INTO ROOM (RoomId, Area, Intro) VALUES (1, "16.5", "second bedroom");

-- 查询数据
SELECT * FROM ROOM;
-- 只显示查询项
SELECT RoomId, Intro FROM ROOM ;
-- 显示时去处重复的数据
SELECT DISTINCT RoomId FROM table_name;  
-- 根据条件查询
SELECT Intro FROM ROOM WHERE Color="white"; -- 等于
SELECT * FROM ROOM WHERE RoomId <> 1; -- 不等于
SELECT * FROM ROOM WHERE RoomId > 1;  -- 大于
SELECT * FROM ROOM WHERE RoomId >= 1;  -- 大于等于
SELECT * FROM ROOM WHERE RoomId < 1 OR RoomId > 5; -- 或
SELECT * FROM ROOM WHERE RoomId BETWEEN 1 AND 2;  -- 范围(且)
SELECT * FROM ROOM WHERE NOT RoomId > 1;  -- 非
SELECT * FROM ROOM WHERE Color IS NULL; -- 空值
SELECT * FROM ROOM WHERE Color IN ("white", "yellow", "green");  -- 集合中取值
SELECT * FROM ROOM WHERE Color LIKE "white%"; -- 正则匹配 ， % 表示多个字值，_ 下划线表示一个字符；

-- 排序查(默认ASC升序, 使用DESC表示降序)
SELECT * FROM ROOM ORDER BY RoomId DESC;

-- 修改数据
UPDATE ROOM SET RoomId=2 WHERE Color IS NULL;
UPDATE ROOM SET Area = 18; -- 没有添加 WHERE  条件会修改所有数据，可以设置 `set sql_safe_updates=1;` 使修改语句必须使用条件

-- 删除数据
DELETE FROM ROOM WHERE RoomId = 1;