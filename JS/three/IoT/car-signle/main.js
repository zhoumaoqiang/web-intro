var data = [{
    name: '一汽丰田',
    model: '../models/dae/elf.dae'
}, {
    name: '更多的车',
    model: '../models/fbx/002.FBX'
}, {
    name: '更多的11',
    model: '../models/fbx/003.FBX'
}, {
    name: '更多的车22',
    model: '../models/fbx/004.FBX'
}]

var scene, camera, renderer
var fixedAngle = Math.PI / 4, diffAngle = 2*Math.PI/3;   // 将默认X轴正向设定为指向屏幕外方法的修正角度，以及每块之间的角度差
var radius; // 呈现环形的圆形半径，该半径大小与相机位置成正比
// var cameraBestPosition, cameraBestRotation; // 调整相机来展示最佳的展示视角，包括相加的位置和偏向角，设定相机指向(0, 0, 0)
var baseScale = 5;  // 用于调整场景显示的大小，匹配模型尺寸
var holderGroup;    // 用于模型展示的站位，每次旋转就是转动这个 group
var models = [], activeIndex = 0 // 加载完成的模型的数组
var FBXLoader = new THREE.FBXLoader()
var fbxReg = /\.fbx$/i, daeReg = /\.dae$/i
var ready = true, holderFull = false;   // 是否可切换模型位置，可切换时模型自转； 模型占位控制是否已经填充完成

// 初始化场景、光线、相机、辅助器等
initScene()
initPositionGroup()
initLoadModels()
lazyLoadedModels()
animate()

// 初始化场景
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xeeeeee);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    scene.add(camera);
    radius = 30 * baseScale;
    camera.position.x = -35 * baseScale;
    camera.position.y = 14 * baseScale;
    camera.position.z = 36 * baseScale;
    camera.rotation.x = -0.38 * baseScale;
    camera.rotation.y = -0.74 * baseScale;
    camera.rotation.z = -0.26 * baseScale;
    camera.lookAt(scene.position);

    // 坐标轴
    var axes = new THREE.AxesHelper(50);
    scene.add(axes);

    // 环境光，提升亮度
    var light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    light.position.set( 0, 200, 0 );
    scene.add( light );

    // 射线光源，从x轴正向投过来
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(50 * baseScale, 50 * baseScale, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 用于辅助的地面，最终将会用于投射阴影（与背景设置相同的颜色）
    var ground = new THREE.Mesh(new THREE.PlaneGeometry( 100 * baseScale, 100 * baseScale, 32 ), new THREE.MeshBasicMaterial({color: 0xeeeeee}))
    ground.receiveShadow = true;
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)

    // 纯粹用于辅助的圆
    var circleHelper = new THREE.Mesh( new THREE.CircleGeometry( radius, 32 ), new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
    circleHelper.rotation.x = -Math.PI / 2
    scene.add( circleHelper );

    document.querySelector('.wrapper').appendChild(renderer.domElement)
}

// 初始化占位的3块模型的分组
function initPositionGroup() {
    holderGroup = new THREE.Group()
    holderGroup.name = 'holderGroup'
    scene.add(holderGroup)

    var angle = fixedAngle - diffAngle

    for(var i = 0; i < 3; i++) {
        var group = new THREE.Group()
        group.name = 'holder' + i
        group.position.x = -Math.cos(angle) * radius
        group.position.y = 0
        group.position.z = Math.sin(angle) * radius
        holderGroup.add(group)
        angle += diffAngle
    }
}

// 初始化加载模型，来填充位置
function initLoadModels() {
    data.forEach(function(item, index) {
        // 数量固定为3，后面的暂时不加载
        if(index > 2) {
            return
        }
        if(fbxReg.test(item.model)) {
            FBXLoader.load( item.model, function ( object ) {
                object.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                models[index] = object
                if(index == 2) {
                    holderGroup.getObjectByName('holder0').add(object)
                } else {
                    holderGroup.getObjectByName('holder' + (index+1)).add(object)
                }
            });
        } else if(daeReg.test(item.model)) {
            var temp;
            var loadingManager = new THREE.LoadingManager( function () {
                temp.traverse( function ( child ) {
                    if ( child.isMesh ) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                models[index] = temp
                if(index == 2) {
                    holderGroup.getObjectByName('holder0').add(temp)
                } else {
                    holderGroup.getObjectByName('holder' + (index+1)).add(temp)
                }
            });
    
            var loader = new THREE.ColladaLoader( loadingManager );
            loader.load( item.model, function ( collada ) {
                temp = collada.scene;
            } );
        }
    })
    
}

// 加载剩余模型，来填充位置选项
function lazyLoadedModels() {
    data.forEach(function(item, index) {
        // 
        if(index > 0) {

        }
    })
}

function animate() {
    holderGroup.children.forEach(function(group) {
        if(ready && group.children.length > 0) {
            group.children[0].rotation.z += 0.02
        }
    })
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
