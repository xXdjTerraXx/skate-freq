import * as THREE from 'three'
import { levelConfig } from '../config'
import GateRing from './GateRing'
import Ramp from './Ramp'

//the whole scene tree for hte game looks like this:
//            [app scene]_________
//            |                  | 
//  [app.masterGameContainer]   [app.mainUserInterfaceContainer]
//              |
//       ~~~~~~~[mainLevelContainer]~~~~~~~~~~
//       |                      |               |
//   [tunnelsContainer]  [ringsContainer]  [rampsContainer]

export default class Level{
  constructor(app, hitManager){
    this.app = app
    this.hitManager = hitManager

    //bring in some constants from config
    this.levelSpeed = levelConfig.SPEED
    this.laneCount = levelConfig.LANE_COUNT
    this.playerCurrentLane = levelConfig.STARTING_LANE

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

    //MAIN LEVEL CONTAINER, EVERYTHING LEVEL RELATED GOES HERE
    this.mainLevelContainer = new THREE.Group()
    this.mainLevelContainer.name = 'main level container'
    //TUNNELS CONTAINER
    this.tunnelsContainer = new THREE.Group()
    this.tunnelsContainer.name = 'tunnels container'
    //RING CONTAINER
    this.ringContainer = new THREE.Group()
    this.ringContainer.name = 'rings container'
    //RAMPS CONTAINER 
    this.rampContainer = new THREE.Group()
    this.rampContainer.name = 'ramp container'
    //WORLD HIT FX CONTAINER
    this.worldHitFxContainer = new THREE.Group()
    this.worldHitFxContainer.name = 'world hit fx container'
    
    //radians measurement of a face
    this.laneAngle = (Math.PI * 2) / this.laneCount

    //rotate the main container so that a side is at 6 oclock instead of vertex
    //(Math.PI * 2) / (levelConfig.LANE_COUNT / 2)
    //or, simplified: Math.PI / levelConfig.LANE_COUNT
    //zRotationOffset is this value applied to the mainContainer z rotation so that
    //a side is centered at 6oclock instead of a vertex. equal to half the size
    //of one side
    this.zRotationOffset = Math.PI / levelConfig.LANE_COUNT 

    //TUNNELS setup
    //two tunnels for loop
    this.tunnel1 = new THREE.Mesh(this.geometry, this.material)
    //tunnels have to be rotated 90 deg on x so youre going THROUGH it
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
    this.rotationAccumulator = 0
    this.targetRotation = 0
    this.rotationVelocity = 0


    //RAMPS
    this.ramps = []
  }

  init = () => {
    //FOG EFFECT
    this.app.scene.fog = new THREE.Fog(0x000000, 2, 15)

    //position tunnel
    this.tunnel1.position.z = 0
    // position second tunnel exactly one length behind
    this.tunnel2.position.z = -levelConfig.TUNNEL_LENGTH 

    //init gate rings
    for(let i = 0; i < this.ringCount; i++){
        const z = -i * this.ringSpacing
        const ring = new GateRing(this.app, z, this.ringContainer)
        ring.init()
        this.gateRings.push(ring)
    }

    //init ramps
    // lane 1, time 4 sec
    const ramp = new Ramp(this.app, 1, 4.0, this.zRotationOffset) 
    ramp.init(this.rampContainer)
    this.ramps.push(ramp)

     //add tunnels to mainLevelContainer
    this.tunnelsContainer.add(this.tunnel1)
    this.tunnelsContainer.add(this.tunnel2)

    //add everything to mainLevelContainer. on application start, mainLevelContainer
    //gets added to Application.masterGameContainer which gets added to
    //main scene
    this.mainLevelContainer.add(this.tunnelsContainer)
    this.mainLevelContainer.add(this.rampContainer)
    this.mainLevelContainer.add(this.ringContainer)

    this.mainLevelContainer.rotation.z = ((2*Math.PI) / (levelConfig.LANE_COUNT)) * 5
}

  changeLane = (direction) => {
      this.rotationAccumulator += direction
      this.targetRotation = this.rotationAccumulator * this.laneAngle

      //keep track of playerCurrentLane
      this.playerCurrentLane = (this.playerCurrentLane + direction + this.laneCount) % this.laneCount
      console.log('DEBUG: PLAYER CURRENT LANE: ', this.playerCurrentLane)
  }

  applyRotation = (deltaTime) => {
      const lerpFactor = 1 - Math.pow(0.001, deltaTime)
      this.rotation += (this.targetRotation - this.rotation) * lerpFactor
  }

  checkRampHit = () => {
    const playerLane = this.playerCurrentLane
    const playerZ = levelConfig.PLAYER_Z_VALUE

    let closestRamp = null
    let closestDistance = Infinity

    // find closest ramp in front of player
    this.ramps.forEach(ramp => {
      const distance = ramp.z - playerZ
      // skip behind player
      if (distance > 0) return 
      if (distance < closestDistance) {
        closestDistance = distance
        closestRamp = ramp
      }
    })

    if (!closestRamp) {
      console.log("MISS (no ramp)")
      return
    }

    //check to prevent double hit on ramp
    if(closestRamp.hit) return

    // lane check
    if (closestRamp.lane !== playerLane) {
      console.log("MISS (wrong lane)")
      return
    }

    // timing via distance
    const PERFECT_THRESHOLD = 0.5
    const GOOD_THRESHOLD = 1.5

    if (Math.abs(closestDistance) < PERFECT_THRESHOLD) {
      console.log("PERFECT")
      this.hitManager.spawnHitEffect("PERFECT", "ui")
    } else if (Math.abs(closestDistance) < GOOD_THRESHOLD) {
      console.log("GOOD")
      this.hitManager.spawnHitEffect("GOOD", "ui")
    } else {
      console.log("MISS (bad timing)")
      this.hitManager.spawnHitEffect("MISS", "ui")
    }
    closestRamp.hit = true
}

  //ANIMATE//
  update = (deltaTime) => {
    
    // move tunnels toward camera
    this.tunnel1.position.z += this.levelSpeed * deltaTime
    this.tunnel2.position.z += this.levelSpeed * deltaTime
    
    // reset for looping effect
    if (this.tunnel1.position.z > levelConfig.TUNNEL_LENGTH) {
        this.tunnel1.position.z = this.tunnel2.position.z - levelConfig.TUNNEL_LENGTH
    }

    if (this.tunnel2.position.z > levelConfig.TUNNEL_LENGTH) {
        this.tunnel2.position.z = this.tunnel1.position.z - levelConfig.TUNNEL_LENGTH
    }

    //update gate rings
    this.gateRings.forEach(ring => {
        ring.update(deltaTime, this.levelSpeed)

        //resetThreshold is an arbitrary point slightly in front of the camera
        const resetThreshold = this.app.camera.position.z + 3
        if (ring.mesh.position.z > resetThreshold) {
            ring.mesh.position.z -= this.ringCount * this.ringSpacing
        }
    })

    //update ramps
    this.ramps.forEach(ramp => {
      ramp.update(deltaTime, this.levelSpeed)
    })

    //APPLY ROTATION
    this.applyRotation(deltaTime)

    // rotate everything
    this.tunnelsContainer.rotation.z = this.rotation + this.zRotationOffset
    this.rampContainer.rotation.z = this.rotation + this.zRotationOffset
    this.ringContainer.rotation.z = -this.rotation + this.zRotationOffset
    }
}