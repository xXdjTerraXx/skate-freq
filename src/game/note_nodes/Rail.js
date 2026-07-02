import * as THREE from 'three'
import { levelConfig } from '../../config'

export default class Rail {
  constructor(
    app, 
    hitlineZPosition, 
    lane, duration, beat,
    time, 
    levelZRotationOffset, 
    levelSpeed, 
    currentTime, 
    secondsPerBeat, 
    eventEmitter
  ) {
    this.noteNodeType = levelConfig.NOTE_NODE_TYPE.RAIL
    
    this.app = app

    this.hitlineZPosition = hitlineZPosition
    // which lane this ramp is in
    this.lane = lane 
    this.duration = duration
    this.beat = beat

    this.levelZRotationOffset = levelZRotationOffset
    
    this.measurementOfOneSide = (Math.PI * 2) / levelConfig.LANE_COUNT
    // when it should be hit in time   
    this.time = time     
    // start far away from player
    this.levelSpeed = levelSpeed
    this.z = this.hitlineZPosition-(this.levelSpeed * currentTime)      

    this.secondsPerBeat = secondsPerBeat
    this.RAIL_LENGTH = this.duration * this.secondsPerBeat * this.levelSpeed
    // simple placeholder geometry (will replace later)
    const geometry = new THREE.BoxGeometry(0.1, 0.1, this.RAIL_LENGTH)
    const material = new THREE.MeshBasicMaterial({ 
      color: levelConfig.NOTE_COLORS.RAIL, transparent: true, opacity: 0.25 
    })
    material.opacity = .5
    this.mesh = new THREE.Mesh(geometry, material)
    this.mesh.name = 'rail'
    this.mesh.renderOrder = levelConfig.RENDER_ORDER.WORLD_OPAQUE

    //this prevents players double hitting ramps and used for disposal
    this.hit = false

    //this set in init
    this.railContainer = null

    this.eventEmitter = eventEmitter
  }

  init(railContainer) {
    this.railContainer = railContainer
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

      //z offset so rail starts right at time
      this.mesh.position.set(x, y, this.z - this.RAIL_LENGTH/2)

      // rotate to face center (important for tunnel)
      this.mesh.rotation.z = angle
      
      railContainer.add(this.mesh)
  }

  handleOnHit = () => {
    this.hit = true
  }

  killSelf = () => {
      this.mesh.visible = false
      if(this.geometry)this.geometry.dispose()
      if(this.material)this.material.dispose()
      if(this.mesh)this.railContainer.remove(this.mesh)
      
      this.eventEmitter.emit("noteKilled")      
  }

  update(deltaTime, currentTime) {
    //how much time is left before ramp is at player z, essentially
    //a countdown until this ramp at player
    const timeUntilHit = this.time - currentTime
    const dist = Math.abs(timeUntilHit)
    // fade in as it approaches
    // this.mesh.material.opacity = Math.max(0, Math.min(0.6, 1.2 - dist))

    // scale slightly near hit
    // const scale = 1 + Math.max(0, 0.5 - dist) * 1.5
    // this.mesh.scale.set(scale, scale, scale)
    //update ramp z position
    this.z = this.hitlineZPosition - (this.levelSpeed * timeUntilHit)
    this.mesh.position.z = this.z - this.RAIL_LENGTH/2

    //handle disposal
    if(this.hit){
      //call killSelf once player has launched
      if(currentTime > this.time + this.duration * this.secondsPerBeat ){
        this.killSelf()
      }
    }
  }
}