-- 查询一定数量
SELECT TOP 50 * FROM room;  -- 50条
SELECT TOP 50 PERCENT * FROM room;  -- 50%
-- SELECT * FROM room limit 50;   -- mysql语法
-- SELECT * FROM room WHERE ROWNUM <= 50; -- Oracle语法

-- 查询条件的正则通配符
SELECT * FROM ROOM WHERE Color LIKE "white%"; -- 以white开头
SELECT * FROM ROOM WHERE Color LIKE "whi__";  -- 以 whi 开头，并且后面有且只有两位字符
SELECT * FROM ROOM WHERE Color LIKE "[Ww]hite"; -- 值为 White 或者 white
SELECT * FROM ROOM WHERE Color LIKE "[^w]hite";  -- 只要首字母不是 w ，后面匹配就行

-- 别名(将展示的表名或者列名替换为想要展示的名称)
SELECT Intro AS introduction FROM ROOM; -- 展示的列名为introduction，实际上是Intro的那一列
SELECT * FROM ROOM AS r WHERE Color = "white";  -- 表的别名可以使查询条件写起来简化一些

