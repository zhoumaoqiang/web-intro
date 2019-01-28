# 作用
  three.js是基于webGl能够在浏览器实现3D图形绘制的js文件，通过three.js定义的方法，我们能够便捷快速地完成3D图形绘制和动画，并且在浏览器上实现。由于是基于webGl协议，浏览器支持情况为：IE11+、Firefox4+、Chrome8+、Safari5.1+、Opera11+，另外在移动端的支持情况为iOS Safari8+、Android62+。

# 使用
  three.js定义展现一个效果需要场景（scene）、相机（camera）和渲染器（renderer），这样才能将场景渲染到相机中。然后给出个demo，绘制一块全屏的空白画布。
  ```
  // 创建场景，场景是所有物体的容器，场景只有一个，可以想象场景就是在视线所在空间之内
  var scene = new THREE.Scene();
  // 创建相机，相机用于决定显示场景中的哪些部分，相机有很多种，这里创建的是透视相机，参数表示视场、相机视野窗口纵横比、近面和远面。
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  // 创建渲染器，用于决定页面上通过何种方式渲染到那个元素上
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  ```
  想要显示具体的内容，就需要向场景中添加物体，比如添加一个正方体（创建正方体，配置材料，生成物体，添加至场景）：
  ```
  // 这是提供绘制正方体的方法，三个参数分别为x、y、z轴的长度
  var geometry = new THREE.CubeGeometry(1,1,1); 
  // 这里定义物体的材料，比如配置颜色为橘黄色(建议使用十六进制，字符串可能不准确)
  var material = new THREE.MeshBasicMaterial({color: 'oranged'});
  // 生成物体
  var cube = new THREE.Mesh(geometry, material);
  // 将物体添加至场景
  scene.add(cube);
  ```
  添加完成之后，会发现画布上并没有出现希望出现的正方体，那是因为添加的物体还没有被渲染出来，这时候渲染器就需要出来出把力了，通过渲染器调用render方法，render方法的配置为：```render( scene, camera, renderTarget, forceClear )```，表示场景、相机、渲染目标、重绘之前是否先清除画布。渲染器渲染时有实时渲染和离线渲染，离线渲染就是将渲染区域提前拼凑完成再进行渲染，实时渲染就是同步进行每一次渲染。不过首先需要定义好相机的位置，
  ```
  camera.position.z = 5;
  function render() {
    // 改变x、y坐标的值
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    // 完成渲染
    renderer.render(scene, camera);
    // 执行传递参数，这里相当于形成递归函数
    requestAnimationFrame(render);
  }
  render();
  ```