import * as THREE from 'three'
import { levelConfig } from '../config'

export default class Ramp {
  constructor(app, lane, time) {
    this.app = app
    // which lane this ramp is in
    this.lane = lane 
    // position in correct lane
    this.laneAngle = (Math.PI * 2) / levelConfig.LANE_COUNT
    // when it should be hit (seconds for now)    
    this.time = time     
    // start far away from player
    this.z = -10         

    // simple placeholder geometry (we'll replace later)
    const geometry = new THREE.BoxGeometry(1, 0.5, 2)
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })

    this.mesh = new THREE.Mesh(geometry, material)

    //this prevents players double hitting ramps
    //gets reset to false when ramp goes off screen
    this.hit = false
  }

  init(rampContainer) {
    

    // shift so ramp is centered on side
    const angle = (this.lane * this.laneAngle) - Math.PI + (this.laneAngle / 2)

    const radius = levelConfig.TUNNEL_RADIUS

    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    this.mesh.position.set(x, y, this.z)

    // rotate to face center (important for tunnel)
    this.mesh.lookAt(0, 0, this.z)
    
    rampContainer.add(this.mesh)
  }

  update(deltaTime, speed) {
    // move ramp toward player
    this.z += speed * deltaTime
    this.mesh.position.z = this.z

    // reset if it passes player
    if (this.z > 5) {
      this.z = -50
      this.hit = false
    }
  }
}