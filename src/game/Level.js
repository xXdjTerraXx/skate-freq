import * as THREE from 'three'
import { levelConfig } from '../config'
import GateRing from './GateRing'

export default class Level{
  constructor(app){
    this.app = app

    this.levelSpeed = levelConfig.SPEED

    //SHAPE setup
    this.geometry = new THREE.CylinderGeometry(
      levelConfig.TUNNEL_RADIUS,     // radius top
      levelConfig.TUNNEL_RADIUS,     // radius bottom
      levelConfig.TUNNEL_LENGTH,    // length of tunnel
      levelConfig.LANE_COUNT,     // sides (hexagon)
      1,
      true   // open ended
    )

    //MATERIAL setup
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      side: THREE.BackSide // THIS puts you inside the tunnel
    })

    //MAIN LEVEL CONTAINER
    this.mainContainer = new THREE.Group()
    
    //rotate the main container so that a side is at 6 oclock instead of vertex
    //oki so a full circle is 2*Math.PI radians, each side is 2*Math.PI / lane count
    //then divide THAT by 2 and that is rotating from a vertex at 6oclock to
    //the side being centered:
    //(Math.PI * 2) / (levelConfig.LANE_COUNT / 2)
    //or, simplified: Math.PI / levelConfig.LANE_COUNT
    //zRotationOffset is this value applied to the mainContainer z rotation so that
    //a side is centered at 6oclock instead of a vertex
    this.zRotationOffset = Math.PI / levelConfig.LANE_COUNT
    this.mainContainer.rotation.z += this.zRotationOffset 

    //RING CONTAINER
    this.ringContainer = new THREE.Group()

    //TUNNELS setup
    //two tunnels for loop
    this.tunnel1 = new THREE.Mesh(this.geometry, this.material)
    this.tunnel1.rotation.x = Math.PI / 2

    this.tunnel2 = new THREE.Mesh(this.geometry, this.material)
    this.tunnel2.rotation.x = Math.PI / 2
    
    
    //EDGES
    this.edges = new THREE.EdgesGeometry(this.geometry)
    this.line1 = new THREE.LineSegments(
      this.edges,
      new THREE.LineBasicMaterial({ color: 0xF57927 })
    )
     this.tunnel1.add(this.line1)

    this.line2 = new THREE.LineSegments(
      this.edges,
      new THREE.LineBasicMaterial({ color: 0xF57927 })
    )
    this.tunnel2.add(this.line2)

    //gate rings set up
    this.gateRings = []
    //how many rings
    this.ringCount = levelConfig.RING_COUNT
    //distance between each one
    this.ringSpacing = levelConfig.RING_SPACING


    //positioning
    this.rotation = 0
    this.targetRotation = 0
    this.rotationVelocity = 0

    this.laneCount = levelConfig.LANE_COUNT
    this.currentLane = 0
  }

  init = (player) => {
    //give level player
     this.player = player
    //FOG EFFECT
    this.app.scene.fog = new THREE.Fog(0x000000, 2, 15)

    //position tunnel
    this.tunnel1.position.z = 0
    // position second tunnel exactly one length behind
    this.tunnel2.position.z = -levelConfig.TUNNEL_LENGTH 

    //add tunnel to scene
    this.mainContainer.add(this.tunnel1)
    this.mainContainer.add(this.tunnel2)

    //init gate rings
    for(let i = 0; i < this.ringCount; i++){
        const z = -i * this.ringSpacing
        const ring = new GateRing(this.app, z, this.ringContainer)
        ring.init()
        this.gateRings.push(ring)
    }

    //add everything to main scene
    this.app.scene.add(this.mainContainer)
    this.app.scene.add(this.ringContainer)
}



  changeLane = (direction) => {
      console.log("lane change")
      this.currentLane += direction

      if (this.currentLane < 0) {
          this.currentLane = this.laneCount - 1
      }

      if (this.currentLane >= this.laneCount) {
          this.currentLane = 0
      }

      const laneAngle = (Math.PI * 2) / this.laneCount
      this.targetRotation = this.currentLane * laneAngle
  }

  applyRotation = () => {
      this.rotation += (this.targetRotation - this.rotation) * 0.2
  }

  //ANIMATE//
  update = () => {
    
    // move tunnels toward camera
    this.tunnel1.position.z += this.levelSpeed
    this.tunnel2.position.z += this.levelSpeed
    
    // reset for looping effect
    if (this.tunnel1.position.z > levelConfig.TUNNEL_LENGTH) {
        this.tunnel1.position.z = this.tunnel2.position.z - levelConfig.TUNNEL_LENGTH
    }

    if (this.tunnel2.position.z > levelConfig.TUNNEL_LENGTH) {
        this.tunnel2.position.z = this.tunnel1.position.z - levelConfig.TUNNEL_LENGTH
    }

    //update gate rings
    this.gateRings.forEach(ring => {
        ring.update(this.levelSpeed)

        //resetThreshold is an arbitrary point slightly in front of the camera
        const resetThreshold = this.app.camera.position.z + 3
        if (ring.mesh.position.z > resetThreshold) {
            ring.mesh.position.z -= this.ringCount * this.ringSpacing
        }
    })

    //APPLY ROTATION
    this.applyRotation()

    // rotate everything
    this.mainContainer.rotation.z = this.rotation + this.zRotationOffset
    this.ringContainer.rotation.z = -this.rotation + this.zRotationOffset


    }
}