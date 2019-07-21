var map;
const positions = [
  {name: "洛带古镇", position: [104.3246, 30.637014]},
  {name: "桃花故里景区", position: [104.321854, 30.551902]},
  {name: "成都大熊猫繁育研究基地", position: [104.148132, 30.732086]},
  {name: "国色天香乐园", position: [103.822662, 30.720281]},
  {name: "香草湖湿地公园", position: [103.962052, 30.836498]},
  {name: "天府公园", position: [104.074661, 30.43475]},
  {name: "梨花溪风景区", position: [103.810303, 30.363681]},
  {name: "黄龙溪", position: [103.970978, 30.310345]},
  {name: "三岔湖景区", position: [104.271729, 30.273585]},
  {name: "百花潭公园", position: [104.043333, 30.656213]},
  {name: "文化公园", position: [104.043419, 30.660274]},
  {name: "人民公园", position: [104.056551, 30.659093]},
  {name: "锦里", position: [104.04977, 30.644177]}
]

window.onload = init

function init() {
  map = new AMap.Map('container');

  var markers = [], cluster
  // 如果没有携带位置参数访问，那么现实所有定位
  if(!location.search) {

    positions.forEach((item) => {
      // 添加点
      var marker = new AMap.Marker({
        position: item.position
      })
      map.add(marker);

      markers.push(marker)
      
      // 现实信息窗口
      var infoWindow = new AMap.InfoWindow({ //创建信息窗体
        isCustom: true,  //使用自定义窗体
        content:`<div style="background: rgba(255,255,255,.5);border: 1px solid #000;">${item.name}</div>`, //信息窗体的内容可以是任意html片段
        offset: new AMap.Pixel(16, -45)
      });
      var onMarkerClick  =  function(e) {
        infoWindow.open(map, e.target.getPosition());//打开信息窗体
        //e.target就是被点击的Marker
      } 
      marker.on('click',onMarkerClick);
    })

    // 实例化 AMap.MassMarks，使用海量点添加标记位置
    // let data = positions.map((item, index) => {
    //   return {
    //     lnglat: item.position,
    //     name: item.name,
    //     id: index,
    //     style: 0
    //   }
    // })
    // markers = new AMap.MassMarks(data, {
    //   zIndex: 5, 	// 海量点图层叠加的顺序
    //   zooms: [3, 19],	 // 在指定地图缩放级别范围内展示海量点图层
    //   style: [{
    //     url: '../../assets/CSS3/bgScroll/img1.jpg',
    //     size: new AMap.Size(10,10),
    //     offset: new AMap.Pixel(-24,-45),
    //     anchor: new AMap.Pixel(5,5) // 图标显示位置偏移量，基准点为图标左上角
    //   }] 	//多种样式对象的数组
    // });
    // // 将 massMarks 添加到地图实例
    // markers.setMap(map);


    // 点聚合
    // map.plugin(["AMap.MarkerClusterer"], function() {
      cluster = new AMap.MarkerClusterer(map, markers, {
        gridSize: 80,
        renderClusterMarker: function(context) {
          var count = positions.length
          var factor = Math.pow(context.count / count, 1 / 18);
          var div = document.createElement('div');
          var Hue = 180 - factor * 180;
          var bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
          var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
          var borderColor = 'hsla(' + Hue + ',100%,40%,1)';
          var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
          div.style.backgroundColor = bgColor;
          var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
          div.style.width = div.style.height = size + 'px';
          div.style.border = 'solid 1px ' + borderColor;
          div.style.borderRadius = size / 2 + 'px';
          div.style.boxShadow = '0 0 1px ' + shadowColor;
          div.innerHTML = context.count;
          div.style.lineHeight = size + 'px';
          div.style.color = fontColor;
          div.style.fontSize = '14px';
          div.style.textAlign = 'center';
          context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
          context.marker.setContent(div)
        }
      });



    map.on('zoomend', function() {

    })

  } else {
    // 如果定位，只显示一个marker
    var p = location.search.slice(1).split("=")[1].split(",")
    p[0] = parseFloat(p[0])
    p[1] = parseFloat(p[1])
    var marker = new AMap.Marker({
      position: p
    })
    map.add(marker);

  }
}
