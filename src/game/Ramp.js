import * as THREE from 'three'
import { levelConfig } from '../config'

export default class Ramp {
  constructor(app, lane, time, levelZRotationOffset, levelSpeed, currentTime, patternLengthTime) {
    this.app = app
    // which lane this ramp is in
    this.lane = lane 

    this.levelZRotationOffset = levelZRotationOffset
    
    this.measurementOfOneSide = (Math.PI * 2) / levelConfig.LANE_COUNT
    // when it should be hit (seconds for now)    
    this.time = time     
    // start far away from player
    this.levelSpeed = levelSpeed
    this.z = -(this.levelSpeed * currentTime)      

    //this value is the patternLengthBeats of the song pattern
    //multiplied by the secondsPerBeat of the song. atm it functions as a
    //loop offset for looping the song pattern
    this.patternLengthTime = patternLengthTime

    // simple placeholder geometry (we'll replace later)
    const geometry = new THREE.BoxGeometry(0.15, 0.4, 1.2)
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xff00ff, transparent: true, opacity: 0.25 
    })
    material.opacity = .5
    this.mesh = new THREE.Mesh(geometry, material)

    //this prevents players double hitting ramps
    //gets reset to false when ramp goes off screen
    this.hit = false

    //for testing purposes while level is looping tunnel
    this.loopOffset = 2.0
  }

  init(rampContainer) {
    

  //ok some weird notes here....subtracting 1 from this.lane is the 
  //only way i found currently to fix offset problem im 
  //having between player's lane index and the ramp's. subtracting levelZRotationOffset
  //is to do with making the ramps centered in a face rather than on a vertex.
    // const angle = ((this.lane) * this.measurementOfOneSide - this.levelZRotationOffset)
    const angle = this.lane * this.measurementOfOneSide - this.levelZRotationOffset
    const radius = levelConfig.TUNNEL_RADIUS
  //and the whole angle has to be made negative bc it was the only way to 
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    this.mesh.position.set(x, y, this.z)

    // rotate to face center (important for tunnel)
    this.mesh.rotation.z = angle
    
    this.mesh.material.color.setHSL(
      this.lane / levelConfig.LANE_COUNT,
      1,
      0.5
    )
    
    rampContainer.add(this.mesh)
  }

  update(deltaTime, speed, currentTime) {
    //how much time is left before ramp is at player z, essentially
    //a countdown until this ramp at player
    const timeUntilHit = this.time - currentTime
    const dist = Math.abs(timeUntilHit)
    // fade in as it approaches
    this.mesh.material.opacity = Math.min(0.6, 1.2 - dist)

    // scale slightly near hit
    const scale = 1 + Math.max(0, 0.5 - dist) * 1.5
    this.mesh.scale.set(scale, scale, 1)
    //update ramp z position
    this.z = -(speed * timeUntilHit)
    this.mesh.position.z = this.z
    //reset ramp
    if(timeUntilHit < -2.0 ){
      this.time += (this.patternLengthTime + this.loopOffset)
      this.hit = false
    }
  }
}