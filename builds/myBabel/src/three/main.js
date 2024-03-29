var scene, camera, renderer, controls;
    var raycaster, vector, cast;
    var clock = new THREE.Clock(), count = 0
    var data = {
      e2e: {
        start: 0,
        end: 0,
        show: false
      },
      capacities: {
        show: false,
        change: false
      },
      wind: {
        show: false
      },
      points: [],
      state: {
        show: false
      },
      panel: {
        show: false
      }
    };
    

    var room = new RoomComponent();

    function init() {
      // 场景、控制器和坐标系
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      renderer.setClearColor(0xeeeeee);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      scene.add(camera);
      camera.position.x = -30;
      camera.position.y = 40;
      camera.position.z = 30;
      camera.lookAt(scene.position);
      let axes = new THREE.AxesHelper(50);
      scene.add(axes);

      // 光源
      let spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(-40, 60, -10);
      spotLight.castShadow = true;
      scene.add(spotLight);

      // 搭建静态对象
      createRaycaster() // 射线检测对象
      createGround() // 地面和墙
      let door = createDoor() // 门
      door.position.z = 20
      let machines = createMachines() // 创建一群机器
      e2e() // 端到端流量
      let capacities = capacity() // 容量显示
      let wind = arrows()
      let stateDom = state()


      document.getElementById('canvas').appendChild(renderer.domElement);
      let stats = initStat();
      render();
      document.addEventListener('mousedown', onDocumentMouseDown, false);



      // 交互事件
      function onDocumentMouseDown() {
        let machineDoors = [], machineTop = [], machineBoard = []
        machines.children.map((machine) => {
          machine.getObjectByName('door').children.forEach((item) => {
            machineDoors.push(item)
          })
          machineTop.push(machine.children[0])
          machineBoard.push(machine.getObjectByName('board'))
        })
   
        raycaster.setFromCamera(vector, camera);
        let intersects = raycaster.intersectObjects([
          ...door.children, 
          ...machineDoors,
          ...machineTop,
          ...machineBoard
        ]);
        if (intersects.length > 0) {
          let obj = intersects[0].object
          // 门
          if (obj.parent.name === 'door') {
            if(obj.parent.opened) {
              obj.parent.close = true
            } else {
              obj.parent.open = true
            }
          }
          // 顶
          if(/^top /.test(obj.name)) {
            if(!obj.lastTime) {
              obj.lastTime = clock.elapsedTime
            } else if(clock.elapsedTime - obj.lastTime < 1) {
              showTextBoard(obj.name)
            }
            obj.lastTime = clock.elapsedTime
          }
          // 机器
          if(obj.name === 'board') {
            if(!obj.lastTime) {
              obj.lastTime = clock.elapsedTime
            } else if(clock.elapsedTime - obj.lastTime < 1) {
              showTextBoard('board' + obj.id)
            }
            obj.lastTime = clock.elapsedTime
          }

        }
      }

      function createRaycaster() {
        raycaster = new THREE.Raycaster();
        vector = new THREE.Vector2();
        window.addEventListener('mousemove', function onMouseMove(event) {
          vector.x = (event.clientX / window.innerWidth) * 2 - 1;
          vector.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }, false);

        // 创建一个粒子用于指示射线相交的位置
        cast = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({
          color: 0xff0000
        }));
        cast.position.y -= 1;
        scene.add(cast);
      }

      // 创建墙体环境
      function createGround() {
        let ground = room.ground('xy', 100, 60, new THREE.TextureLoader().load('../../../assets/JS/three/floor1.jpg'))
        ground.material.side = THREE.DoubleSide
        ground.receiveShadow = true;
        let wall_l = room.ground('-yz', 60, 20, 0xfbfb73)
        wall_l.position.x = -50;
        wall_l.position.y = 10
        let wall_r = room.ground('yz', 60, 20, 0xf6fb73)
        wall_r.position.x = 50
        wall_r.position.y = 10

        let bawn = new THREE.Group()
        bawn.name = 'bawn'
        
        let wall_2 = room.ground('xz', 10, 30, 0xf6f764)
        wall_2.position.x = -25
        wall_2.position.z = -30
        let wall_3 = room.ground('xz', 10, 50, 0xf6f764)
        wall_3.position.x = 15
        wall_3.position.z = -20
        let wall_4 = room.ground('yz', 50, 10, 0xf6f764)
        wall_4.position.x = -40
        wall_4.position.z = -5
        let wall_5 = room.ground('yz', 10, 10, 0xf6f764)
        wall_5.position.x = -10
        wall_5.position.z = -25
        let wall_6 = room.ground('yz', 40, 10, 0xf6f764)
        wall_6.position.x = 40

        scene.add(ground)
        scene.add(wall_l)
        scene.add(wall_r)

        scene.add(bawn)
        bawn.add(wall_2)
        bawn.add(wall_3)
        bawn.add(wall_4)
        bawn.add(wall_5)
        bawn.add(wall_6)

        bawn.children.forEach((mesh) => {
          mesh.material.side = THREE.DoubleSide
          mesh.position.y = 5
          mesh.castShadow = true
        })

        let frontWall = new THREE.Group()
        let frontwall_1 = room.ground('xz', 8, 8, 0xf6f7dd)
        frontwall_1.position.set(-36, 4, 20)
        let frontwall_2 = room.ground('xz', 2, 20, 0xf6f7dd)
        frontwall_2.position.set(-22, 1, 20)
        let frontwall_3 = room.ground('xz', 8, 12, 0xf6f7dd)
        frontwall_3.position.set(-6, 4, 20)
        let frontwall_4 = room.ground('xz', 8, 8, 0xf6f7dd)
        frontwall_4.position.set(8, 4, 20)
        let frontwall_5 = room.ground('xz', 2, 20, 0xf6f7dd)
        frontwall_5.position.set(22, 1, 20)
        let frontwall_6 = room.ground('xz', 8, 8, 0xf6f7dd)
        frontwall_6.position.set(36, 4, 20)
        let frontwall_t = room.ground('xz', 2, 80, 0xf6f7dd)
        frontwall_t.position.set(0, 9, 20)


        scene.add(frontWall)
        frontWall.add(frontwall_1)
        frontWall.add(frontwall_2)
        frontWall.add(frontwall_3)
        frontWall.add(frontwall_4)
        frontWall.add(frontwall_5)
        frontWall.add(frontwall_6)
        frontWall.add(frontwall_t)
        frontWall.children.forEach((mesh) => {
          mesh.material.side = THREE.DoubleSide
        })
      }

      // 创建门
      function createDoor() {
        let door = room.door(4, 8, Math.PI / 2, -1)
        scene.add(door)
        return door
      }

      // 创建机器
      function createMachines() {
        let machines = new THREE.Group()
        let width = 4, height = 8
       
        let machine = room.machine(width, height)
        machine.position.set(25, 0, -5)
        machines.add(machine)

        for(let i = 1; i <= 5; i ++) {
          for(let j = 1; j <= 8; j ++) {
            // setTimeout(() => {
              let machine = room.machine()
              machine.position.set(i*width*4, 0, j*width*1.02)
              machine.name = `r${i}c${j}`
              machines.add(machine)
            // }, 200)
          }
        }
        machines.position.x = -50
        machines.position.z = -18
        scene.add(machines)
        return machines
      }

      // 从 r2c2 到 r4c6 的连线
      function e2e() {
        let height = 10
        let start_p = machines.getObjectByName('r2c2').position
        let end_p = machines.getObjectByName('r4c6').position
        let line_info = new THREE.Group()
        line_info.name = 'line info'
        let geometry = new THREE.Geometry();
        geometry.vertices.push(
          start_p,
          new THREE.Vector3( start_p.x, 10, start_p.z ),
          new THREE.Vector3( start_p.x, 10, 0),
          new THREE.Vector3( end_p.x, 10, 0 ),
          new THREE.Vector3( end_p.x, 10, end_p.z ),
          end_p
        ); 
        let material = new THREE.LineBasicMaterial({
          color: 0x0000ff
        });

        let line = new THREE.Line( geometry, material );
        line.position.set(-50, 0, -18)
        line_info.add( line );

        let startBoard = new THREE.Mesh(
          new THREE.PlaneGeometry(4, 2), 
          new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture( drawTextBoard(data.e2e.start) ), side: THREE.DoubleSide})
        )
        startBoard.name = 'e2e start'
        startBoard.position.set(start_p.x - 50, start_p.y + 11, start_p.z - 20)
        let endBoard = new THREE.Mesh(
          new THREE.PlaneGeometry(4, 2), 
          new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture( drawTextBoard(data.e2e.end) ), side: THREE.DoubleSide})
        )
        endBoard.name = 'e2e end'
        endBoard.position.set(end_p.x - 50, end_p.y + 11, end_p.z - 20)
        line_info.add(startBoard)
        line_info.add(endBoard)
        scene.add(line_info)
      }
      // 绘制显示板
      function drawTextBoard(number) {
        let canvas = document.createElement('canvas')
        canvas.width = 128
        canvas.height = 64
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.font = "16px serif";
        ctx.fillText("current number", 0, 16);
        ctx.fillText("Mb/s", 80, 44)
        ctx.font = "24px serif";
        ctx.fillText(number, 10, 48)
        return canvas
      }

      // 容量占比
      function capacity() {
        let machineFrames = new THREE.Group()
        let frame = room.machineFrame(4, 8)
        frame.position.set(25, 0, -5)
        machineFrames.add(frame)

        for(let i = 1; i <= 5; i ++) {
          for(let j = 1; j <= 8; j ++) {
            // setTimeout(() => {
              let frame = room.machineFrame()
              frame.position.set(i*4*4, 0, j*4*1.02)
              frame.name = `r${i}c${j}`
              machineFrames.add(frame)
            // }, 200)
          }
        }
        machineFrames.position.x = -50
        machineFrames.position.z = -18
        
        scene.add(machineFrames)
        return machineFrames
      }

      // 风向箭头
      function arrows() {
        let arrows = new THREE.Group()
        for(let i = 0; i < 10; i++) {
          let arrow = new THREE.ArrowHelper( new THREE.Vector3( -3, 2, 0 ).normalize(), new THREE.Vector3( 0, 0, 0 ), 8, 0x37ff14 )
          arrow.setLength(7,1,1)
          arrow.position.set(10, 3, i * 3 - 15)
          arrows.add(arrow)
        }
    
        scene.add( arrows );
        return arrows
      }

      // 初始化状态显示
      function state() {
        let state = document.getElementById('state')
        for(let i = 0; i < 41; i++) {
          let div = document.createElement('div')
          div.innerHTML = "使用率：" + Math.ceil(Math.random() * 100) + '%'
          div.className = 'state-item'
          div.style.position = 'absolute'
          div.style.left = data.points[i] ? data.points[i].x : 0
          div.style.top = data.points[i] ? data.points[i].y : 0
          state.appendChild(div)
        }
        return state
      }

      // 面板展示
      function showTextBoard(text) {
        document.getElementById('panel').style.display = 'block'
        document.getElementById('panelName').innerHTML = text
      }

      // 显示帧数
      function initStat() {
        let stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0';
        stats.domElement.style.top = '0';
        document.getElementById('wrapper').appendChild(stats.domElement);
        return stats;
      }

      // 渲染动画等
      function render() {
        stats.update();
        let time = clock.getDelta()
        
    
        // 控制点映射
        let bawn = scene.getObjectByName('bawn').children
        raycaster.setFromCamera(vector, camera);
        let intersects = raycaster.intersectObjects([...bawn]);
        for (let i = 0; i < intersects.length; i++) {
          cast.position.x = intersects[i].point.x;
          cast.position.y = intersects[i].point.y + 1;
          cast.position.z = intersects[i].point.z;
        }

        // 控制门开关
        door.switch()
        machines.children.forEach((machine) => {
          machine.getObjectByName('door').switch()
        })

        // 接线
        if(data.e2e.show != scene.getObjectByName('line info').visible) {
          scene.getObjectByName('line info').visible = data.e2e.show
        }

        // 显示容量
        if(data.capacities.change) {
            capacities.children.forEach((frame) => {
              frame.reset()
            })
            data.capacities.change = false
          }
        if(data.capacities.show) {
          capacities.visible = true
          machines.visible = false
          capacities.children.forEach((frame) => {
            frame.move()
          })
        } else {
          capacities.visible = false
          machines.visible = true
        }

        // 风向
        wind.visible = data.wind.show

        // 由次数控制
        count ++
        if(count > 80) {
          count = 0

          if(data.e2e.show) {
            data.e2e.start = Math.ceil(Math.random() * 10000 + 5000)
            data.e2e.end = Math.ceil(Math.random() * 10000 + 8000)
            scene.getObjectByName('line info').getObjectByName('e2e start').material.map = new THREE.CanvasTexture( drawTextBoard(data.e2e.start) )
            scene.getObjectByName('line info').getObjectByName('e2e end').material.map = new THREE.CanvasTexture( drawTextBoard(data.e2e.end) )
          }
        }

        // 坐标转换
        if(data.state.show) {
          stateDom.style.display = 'block'
          data.points = []
          machines.children.forEach((item) => {
            let changeVector = new THREE.Vector3(item.position.x - 50, 10, item.position.z - 18).project(camera)
            var a = window.innerWidth / 2;
            var b = window.innerHeight / 2;

            data.points.push({
              x: Math.round(changeVector.x * a + a),
              y: Math.round(-changeVector.y * b + b)
            })
          })
          document.querySelectorAll('.state-item').forEach((item, index) => {
            item.style.left = data.points[index].x + 'px'
            item.style.top = data.points[index].y + 'px'
          })
        } else {
          stateDom.style.display = 'none'
        }
        

        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }

    }

    window.onload = init();
    window.onresize = function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    setTimeout(() => {
      document.getElementById('one').onclick = function() {
        data.e2e.show = !data.e2e.show
      }
      document.getElementById('two').onclick = function() {
        data.capacities.show = !data.capacities.show
        data.capacities.change = true
      }
      document.getElementById('three').onclick = function() {
        data.wind.show = !data.wind.show
      }
      document.getElementById('four').onclick = function() {
        data.state.show = !data.state.show
      }
      document.getElementById('panel').onclick = function() {
        this.style.display = 'none'
      }
    })