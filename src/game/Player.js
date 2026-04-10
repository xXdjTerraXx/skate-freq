import * as THREE from 'three'
import { levelConfig } from '../config'

export default class Player {
  constructor(app) {
    this.app = app

    //GEOMETRY
    this.geometry = new THREE.SphereGeometry(0.15, 16, 16)

    //MATERIAL
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ffff
    })

    //MESH
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // POSITIONING
    // match tunnel radius
    this.radius = levelConfig.TUNNEL_RADIUS 

    // position around tunnel   
    this.angle = 1  

    this.updatePosition()
  }

  init = () => {
    this.app.scene.add(this.mesh)
  }

  updatePosition = () => {
    // // place player on inner wall of tunnel
    // const x = Math.cos(this.angle) * this.radius
    // const y = Math.sin(this.angle) * this.radius

    this.mesh.position.set(0, -this.radius, 0)
  }

  update = () => {
    // smooth interpolation when switching lane
    this.angle += (this.targetAngle - this.angle) * 0.2
    // for now just keep it locked in place
    this.updatePosition()
  }
}

