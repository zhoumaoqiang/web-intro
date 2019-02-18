class RoomComponent {
  /**
   * create a wall 
   * @param {string} direction 'xy' means from bottom to top, etc
   * @param {number} width wall's width, directions first face
   * @param {number} height wall's height, directions second face
   * @param {THREE.texture} texture how the walls look, surport color string
   */
  ground(direction, width, height, texture) {
    let geometry = new THREE.PlaneGeometry(width, height);
    let material = new THREE.MeshBasicMaterial(texture instanceof THREE.Texture ? {map: texture} : {color: texture})
    let plane = new THREE.Mesh(geometry, material);
    switch(direction) {
      case 'xy':
        plane.rotation.x = -0.5 * Math.PI;
        break;
      case '-xy':
        plane.rotation.x = 0.5 * Math.PI;
        break;
      case 'xz':
        plane.rotation.z = -0.5 * Math.PI;
        break;
      case '-xz':
        plane.rotation.z = 0.5 * Math.PI;
        break;
      case 'yz':
        plane.rotation.y = -0.5 * Math.PI;
        break;
      case '-yz':
        plane.rotation.y = 0.5 * Math.PI;
        break;
    }
    return plane;
  }

  /**
   * create a door
   * @param {number} width door's wdith
   * @param {number} height door's height
   * @param {number} angle the angle that the door rotates
   * @param {number} direction default 1, means rotation direction clockwise, anti-clock is -1
   */
  door(width, height, angle, direction) {
    let door = new THREE.Group();
    door.opened = false;
    door.open = false;
    door.close = false;
    direction = direction || 1
    const THICK = 0.2
    let geometry_b = new THREE.BoxGeometry(width, THICK, THICK)
    let geometry_t = new THREE.BoxGeometry(width, THICK, THICK)
    let geometry_l = new THREE.BoxGeometry(THICK, THICK, height)
    let geometry_r = new THREE.BoxGeometry(THICK, THICK, height)
    let material = new THREE.MeshLambertMaterial({color: 0x544d28})
    let frame_b = new THREE.Mesh(geometry_b, material)
    let frame_t = new THREE.Mesh(geometry_t, material)
    frame_t.position.z = height - THICK / 2
    let frame_l = new THREE.Mesh(geometry_l, material)
    frame_l.position.x = width / 2
    frame_l.position.z = height / 2
    let frame_r = new THREE.Mesh(geometry_r, material)
    frame_r.position.x = - width / 2
    frame_r.position.z = height / 2

    door.add(frame_b)
    door.add(frame_t)
    door.add(frame_l)
    door.add(frame_r)

    let glassGeometry = new THREE.PlaneGeometry(width, height)
    let glassMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0.2, color: 0xffffff})
    let glass = new THREE.Mesh(glassGeometry, glassMaterial)
    glass.position.z = height / 2
    glass.rotation.x = Math.PI / 2

    door.add(glass)

    let handleGeometry = new THREE.BoxGeometry(THICK, THICK, height / 4)
    let handle = new THREE.Mesh(handleGeometry, material)
    handle.position.x = width / 2 - 2 * THICK
    handle.position.y = THICK * direction
    handle.position.z = height / 2

    door.add(handle)

    door.children.forEach((mesh) =>{
      mesh.position.x += width / 2
    })

    door.rotation.x = -Math.PI / 2

    door.switch = function() {
      if(door.opened && door.close) {
        door.rotation.z -= angle / 200 * direction
        if(direction === 1 && door.rotation.z <= 0) {
          door.close = false;
          door.rotation.z = 0
          door.opened = false
        } else if(direction === -1 && door.rotation.z >= 0) {
          door.close = false;
          door.rotation.z = 0
          door.opened = false
        }
      }
      if(!door.opened && door.open) {
        door.rotation.z += angle / 200 * direction
        if(door.rotation.z >= angle ||  door.rotation.z <= -angle) {
          door.rotation.z = direction === 1 ? angle : - angle
          door.open = false
          door.opened = true
        }
      }
    }

    return door
  }

}