// d3.axex 提供了一系列生成坐标系的方法

/* example
  d3.select("#chart")
    .selectAll("svg")
    .data([])   
    .enter()  
    .append("svg")  
    .attr("class", "bullet")  
    .attr("width", 1200)  
    .attr("height", 100)  
    .append("g")  
    .call(axis);
 */

(function () {
  /**
   * 将绘制轴的封装放在 d3.drawAxis 上，调用该函数返回一个在 selection 绘制坐标轴的方法
   * 
   * @param {boolean} showX 显示X轴   true
   * @param {boolean} showY 显示Y轴   true
   * @param {number} x0 x轴起始坐标   0
   * @param {number} x1 x轴截至坐标   10
   * @param {number} xStep x轴划分数量    10
   * @param {number} y0 y轴起始坐标   0
   * @param {number} y1 y轴截至坐标   10
   * @param {number} yStep y轴划分数量    10
   * @param {array} defineX 是否使用自定义X轴数据  false
   * @param {array} defineXData 自定义x轴数据 []
   * @param {array} defineY 是否使用自定义y轴数据  false
   * @param {array} defineYData 自定义y轴数据 []
   * @param {string} unitxText 自定义x轴单位    ""
   * @param {string} unityText 自定义y轴单位    ""
   * @param {number} width x轴的宽度  960
   * @param {number} height x轴的宽度  300
   * @param {number} duration 动画时间 1000
   */
  d3.drawAxis = function () {

    let showX = true,
      showY = true;
    let x0 = 0,
      x1 = 10,
      xStep = 10,
      y0 = 0,
      y1 = 10,
      yStep = 10;
    let defineX = false,
      defineXData = [],
      defineY = false,
      defineYData = [];
    let unitxText = "",
      unityText = "";
    let width = 960,
      height = 300;
    let duration = 10;

    // 坐标系留白默认为：x轴 30， y轴 50
    let xSpace = 30,
      ySpace = 50;

    /**
     * 绘制的控制逻辑
     * @param {d3.selection} gEle 一个d3的选择器，用于绘制坐标系，一般是一个 g 元素 
     */
    function draw(gEle) {
      // 注意： y坐标系是反的，从下往上走的
      let axisX = gEle.selectAll("g.x-axis"),
        axisY = gEle.selectAll("g.y-axis");

      if (showX) {
        // x坐标轴线
        let axisXLine = axisX.data(["line"])
          .enter()
          .append("g")
          .attr("class", "x-line")
          .attr("transform", `translate(0, ${height - xSpace / 2})`);

        axisXLine.append("line")
          .attr("class", "x-axis-line")
          .style("stroke", "#000")
          .style("stroke-width", "0.5px")
          .attr("x1", ySpace / 2)
          .attr("x2", width);

        if(unitxText) {
          gEle.append("g")
          .style("text-anchor", "end")
          .attr("transform", "translate(-6," + height / 2 + ")")
          .append("text")
          .attr("class", "title")
          .text(unitxText);
        }

        let axisXData;

        let axisXPoints = axisX.data(["points"])
          .enter()
          .append("g")
          .attr("class", "x-points")
          .attr("transform", `translate(${ySpace}, ${height - xSpace})`);
        // 自定义 x轴 数据绘制的坐标系
        if (defineX) {

          axisXData = axisXPoints.data(defineXData, function () {
            return this;
          });

          defineXData.forEach(function (data, index) {

            let axisXIndex = axisXData
              .append("g")
              .attr("class", function (val, i) {
                return "x-axis-index" + i
              })
              .attr("transform", `translate(${(width-ySpace) * index / xStep - ySpace/2}, ${ xSpace/2})`);

            axisXIndex.append("line")
              .style("stroke", "#222")
              .style("stroke-width", "0.5px")
              .attr("y1", 0)
              .attr("y2", xSpace / 6);

            axisXIndex.append("text")
              .attr("text-anchor", "middle")
              .attr("dy", "1em")
              .attr("y", xSpace / 6)
              .style("font-size", "12px")
              .text(data);
          })

        } else {
          let xScale = d3.scaleLinear()
            .domain([x0, x1])
            .range([0, width - ySpace])

          axisXData = axisXPoints.data(xScale.ticks(xStep), function (val) {
            return xScale.tickFormat(xStep)
          })

          let tickEnter = axisXData.enter().append("g")
            .attr("class", "tick")
            .attr("transform", function(val, index) {
              return `translate(${(width-ySpace) * index / xStep + ySpace/2}, ${height - xSpace/2})`
            });
 
          tickEnter.append("line")
            .style("stroke", "#111")
            .style("stroke-width", "0.5px")
            .attr("y1", 0)
            .attr("y2", xSpace / 6);

          tickEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1em")
            .attr("y", xSpace / 6)
            .style("font-size", "12px")
            .text( xScale.tickFormat(xStep) );

        }

      } else {
        axisX.data([])
          .exit()
          .transition()
          .duration(duration)
          .style("opacity", 1e-6)
          .remove();
      }

      if (showY) {

        // y坐标轴线
        let axisYLine = axisY.data(["line"])
          .enter()
          .append("g")
          .attr("class", "y-line")
          .attr("transform", `translate(${ySpace/2}, 0)`);

        axisYLine.append("line")
          .attr("class", "x-axis-line")
          .style("stroke", "#000")
          .style("stroke-width", "0.5px")
          .attr("y1", height - xSpace / 2)
          .attr("y2", 0);

        let axisYData;

        let axisYPoints = axisY.data(["points"])
          .enter()
          .append("g")
          .attr("class", "y-points")
          .attr("transform", `translate(${ySpace/2}, 0)`);

        

        if (defineY) {
          axisYData = axisYPoints.data(defineYData, function () {
            return this;
          });

          defineYData.forEach(function (data, index) {

            let axisYIndex = axisYData
              .append("g")
              .attr("class", function (val, i) {
                return "y-axis-index" + i
              })
              .attr("transform", `translate(0, ${height - (height-xSpace)*index/yStep - xSpace/2})`);

            axisYIndex.append("line")
              .style("stroke", "#222")
              .style("stroke-width", "0.5px")
              .attr("x1", 0)
              .attr("x2", xSpace / 6)
              .attr("transform", `translate(${-xSpace / 6}, 0)`)

            axisYIndex.append("text")
              .attr("text-anchor", "middle")
              .attr("dx", "1em")
              .attr("x", 0)
              .style("font-size", "12px")
              .attr("transform", `translate(${-xSpace}, 0)`)
              .text(data);
          })
        } else {
          let yScale = d3.scaleLinear()
            .domain([y0, y1])
            .range([0, height - xSpace])

          axisYData = axisYPoints.data(yScale.ticks(yStep), function (val) {
            return yScale.tickFormat(yStep)
          })

          let tickEnter = axisYData.enter().append("g")
            .attr("class", "tick")
            .attr("transform", function(val, index) {
              return `translate(${ySpace/2}, ${height - (height-xSpace)*index/yStep - xSpace/2})`
            });
 
          tickEnter.append("line")
            .style("stroke", "#111")
            .style("stroke-width", "0.5px")
            .attr("x1", 0)
            .attr("x2", xSpace / 6)
            .attr("transform", `translate(${-xSpace / 6}, 0)`)

          tickEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("dx", "1em")
            .attr("x", 0)
            .style("font-size", "12px")
            .attr("transform", `translate(${-xSpace}, 0)`)
            .text( yScale.tickFormat(yStep) )
        }

      } else {
        axisY.data([])
          .exit()
          .transition()
          .duration(duration)
          .style("opacity", 1e-6)
          .remove();
      }
    }

    // 下面是定义更改配置和进行链式调用的方法
    draw.showX = function (isShow) {
      if (!arguments.length) return showX;
      showX = isShow;
      return draw;
    }
    draw.showY = function (isShow) {
      if (!arguments.length) return showY;
      showY = isShow;
      return draw;
    }
    draw.x0 = function (x) {
      if (!arguments.length) return x0;
      x0 = x;
      return draw;
    }
    draw.x1 = function (x) {
      if (!arguments.length) return x1;
      x1 = x;
      return draw;
    }
    draw.xStep = function (step) {
      if (!arguments.length) return xStep;
      xStep = step;
      return draw;
    }
    draw.y0 = function (y) {
      if (!arguments.length) return y0;
      y0 = y;
      return draw;
    }
    draw.y1 = function (y) {
      if (!arguments.length) return y1;
      y1 = y;
      return draw;
    }
    draw.yStep = function (step) {
      if (!arguments.length) return yStep;
      yStep = step;
      return draw;
    }
    draw.defineX = function (isDefineX) {
      if (!arguments.length) return defineX;
      defineX = isDefineX;
      return draw;
    }
    draw.defineXData = function (data) {
      if (!arguments.length) return defineXData;
      defineXData = data;
      if (defineX) xStep = defineXData.length - 1;
      return draw;
    }
    draw.defineY = function (isDefineY) {
      if (!arguments.length) return defineY;
      defineY = isDefineY;
      return draw;
    }
    draw.defineYData = function (data) {
      if (!arguments.length) return defineYData;
      defineYData = data;
      if (defineY) yStep = defineYData.length - 1;
      return draw;
    }
    draw.unitxText = function (text) {
      if (!arguments.length) return unitxText;
      unitxText = text;
      return draw;
    }
    draw.unityText = function (text) {
      if (!arguments.length) return unityText;
      unityText = text;
      return draw;
    }
    draw.width = function (defineWidth) {
      if (!arguments.length) return width;
      width = defineWidth;
      return draw;
    }
    draw.height = function (defineHeight) {
      if (!arguments.length) return height;
      height = defineHeight;
      return draw;
    }
    draw.duration = function (defineduration) {
      if (!arguments.length) return duration;
      duration = defineduration;
      return draw;
    }

    return draw;
  }


})();