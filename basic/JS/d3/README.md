# D3js

## 条形图

### 还原提示demo

官网提供条形图[demo](https://bl.ocks.org/mbostock/4061961)，由于d3js版本有v3变成v5，并且fetch Api的用法是的d3.json方法回调调用方式不一致等，代码需要重新研究更改。中文版文档同步更新并不同步

1. d3.json(url, callback) => d3.json(url).then(callback)
2. d3.scale.linear() => d3.scaleLiner()
3. d3.timer.flush() => d3.timerFlush()

最后的更改只是Api提供的方法有些变化而已，数据填入svg并通过d3绘制成图形，update调用randomizer在一定阈值修改数据并重新动态绘制。其中svg图形的绘制和动作都是在bullet.js中，initBullet函数中定义的，包括条形图(rect)、标志点(line)和坐标轴(g => tick)。

### 绘制一组条形图

1. 创建数据，包括4组，每组六条数据
2. 创建svg > g > rect ~ g > line ~ text，填入数据创建矢量元素，由于坐标一样，直接使用selectAll完成即可，每组数据不同遍历数据单独绘制