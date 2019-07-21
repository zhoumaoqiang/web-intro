(function () {

  // 基于d3.v3版本，现已过期，该方法用于生成矢量条形图

  // 访问改js就会执行立即执行函数，返回 initBullet 对象

  // 未区分，对d3的属性 bullet 和函数 bullet 用作不同的名字，
  // 由于函数是在模块内部，所以将函数名改为initBullet
  d3.bullet = function () {
    var orient = "left", // 方向
      reverse = false,
      duration = 0,
      ranges = bulletRanges,
      markers = bulletMarkers,
      measures = bulletMeasures,
      width = 380,
      height = 30,
      tickFormat = null;

    // 将所有的svg引入生成，分别生成条形图、线段、x轴坐标
    function initBullet(g) {
      g.each(function (d, i) {
        // 下面的方法参考上面的声明，引用后返回相应的数组，并进行排序
        var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
          markerz = markers.call(this, d, i).slice().sort(d3.descending),
          measurez = measures.call(this, d, i).slice().sort(d3.descending),
          g = d3.select(this); // 指向g元素

        // 计算新的底部的x轴标尺
        var x1 = d3.scaleLinear() // 构建线型刻度
          .domain([0, Math.max(rangez[0], markerz[0], measurez[0])]) // 设置比例尺的定义域，按照三个值最大的设定
          .range(reverse ? [width, 0] : [0, width]); // 设置比例尺输出范围，从左到右是 0 到 最值，还是 最值 到 0

        // 更新时检索旧的 x 轴，存在就不重新计算了
        // x0 => x1 的动态变化需要这两个数据
        var x0 = this.__chart__ || d3.scaleLinear()
          .domain([0, Infinity])
          .range(x1.range());

        // 更新新的标尺标志
        this.__chart__ = x1;

        // 计算x轴标尺长度尺寸，x0 和 x1 军事比例尺函数
        var w0 = bulletWidth(x0),
          w1 = bulletWidth(x1);

        // 更新json数据range的值
        var range = g.selectAll("rect.range")
          .data(rangez);

        // 添加range条形图，以及变化
        range.enter().append("rect")
          .attr("class", function (d, i) {
            return "range s" + i;
          })
          .attr("width", w0)
          .attr("height", height)
          .attr("x", reverse ? x0 : 0)
          .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

        range.transition()
          .duration(duration)
          .attr("x", reverse ? x1 : 0)
          .attr("width", w1)
          .attr("height", height);

        // json数据measure
        var measure = g.selectAll("rect.measure")
          .data(measurez);

        measure.enter().append("rect")
          .attr("class", function (d, i) {
            return "measure s" + i;
          })
          .attr("width", w0)
          .attr("height", height / 3)
          .attr("x", reverse ? x0 : 0)
          .attr("y", height / 3)
          .transition()
          .duration(duration)
          .attr("width", w1)
          .attr("x", reverse ? x1 : 0);

        measure.transition()
          .duration(duration)
          .attr("width", w1)
          .attr("height", height / 3)
          .attr("x", reverse ? x1 : 0)
          .attr("y", height / 3);

        // json数据marker
        var marker = g.selectAll("line.marker")
          .data(markerz);

        marker.enter().append("line")
          .attr("class", "marker")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6)
          .transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1);

        marker.transition()
          .duration(duration)
          .attr("x1", x1)
          .attr("x2", x1)
          .attr("y1", height / 6)
          .attr("y2", height * 5 / 6);

        // 标注 x轴 的数字和点
        var format = tickFormat || x1.tickFormat(8);

        // 更新点的值
        var tick = g.selectAll("g.tick")
          .data(x1.ticks(8), function (d) {
            return this.textContent || format(d);   // 加载每个点，如：0,50,100,150,200……
          });

        // 使用上一次更新的 x0 轴初始化坐标
        var tickEnter = tick.enter().append("g")
          .attr("class", "tick")
          .attr("transform", bulletTranslate(x0))
          .style("opacity", 1e-6);
        // 坐标点的竖线
        tickEnter.append("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);
        // 坐标点的文字
        tickEnter.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", height * 7 / 6)
          .text(format);

        // 替换长度
        tickEnter.transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

        
        var tickUpdate = tick.transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1);

        tickUpdate.select("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

        tickUpdate.select("text")
          .attr("y", height * 7 / 6);

        
        tick.exit().transition()
          .duration(duration)
          .attr("transform", bulletTranslate(x1))
          .style("opacity", 1e-6)
          .remove();
      });
      // svg绘制完成，总是执行合适的计时器
      d3.timerFlush();
    }

    // 下面的方法都是允许更改实例上的方法，替换绘制svg图形的配置，否则仍使用默认的配置
    initBullet.orient = function (x) {
      if (!arguments.length) return orient;
      orient = x;
      reverse = orient == "right" || orient == "bottom";
      return initBullet;
    };

    initBullet.ranges = function (x) {
      if (!arguments.length) return ranges;
      ranges = x;
      return initBullet;
    };

    initBullet.markers = function (x) {
      if (!arguments.length) return markers;
      markers = x;
      return initBullet;
    };

    initBullet.measures = function (x) {
      if (!arguments.length) return measures;
      measures = x;
      return initBullet;
    };

    initBullet.width = function (x) {
      if (!arguments.length) return width;
      width = x;
      return initBullet;
    };

    initBullet.height = function (x) {
      if (!arguments.length) return height;
      height = x;
      return initBullet;
    };

    initBullet.tickFormat = function (x) {
      if (!arguments.length) return tickFormat;
      tickFormat = x;
      return initBullet;
    };

    initBullet.duration = function (x) {
      if (!arguments.length) return duration;
      duration = x;
      return initBullet;
    };
    // 调用d3.bullet()，就会返回绘制svg图形的initBullet方法
    return initBullet;
  };

  // 下面的方法都是在绘制svg图形内部应用，获得json对应数据的方法
  function bulletRanges(d) {
    return d.ranges;
  }

  function bulletMarkers(d) {
    return d.markers;
  }

  function bulletMeasures(d) {
    return d.measures;
  }

  // 下面两个函数，参数 x 是一个比例尺对象，这里是绘制比例尺运动的辅助函数
  function bulletTranslate(x) {
    return function (d) {
      return `translate(${x(d)}, 0)`;
    };
  }

  function bulletWidth(x) {
    var x0 = x(0);
    return function (d) {
      return Math.abs(x(d) - x0);
    };
  }

})();