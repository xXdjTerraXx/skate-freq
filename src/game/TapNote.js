import * as THREE from 'three'
import { levelConfig } from '../config'

export default class TapNote{
    constructor(app, hitlineZPosition, levelSpeed, levelZRotationOffset, currentTime, lane, subLane, beat, time, eventEmitter){
        this.noteNodeType = levelConfig.NOTE_NODE_TYPE.TAPNOTE
        
        this.app = app 
        this.hitlineZPosition = hitlineZPosition
        this.levelSpeed = levelSpeed
        this.levelZRotationOffset = levelZRotationOffset

        //which of the 8 lanes this note exists in
        this.lane = lane 
        //which sublane of the lane this note exists in: 0, 1, or 2
        this.subLane = subLane
        //the beat this note should reach the player 
        this.beat = beat
        //the time in seconds this note should reach the player
        this.time = time 

        //gets set to true when player hits (or misses) this note. prevents double hits
        this.hit = false

        //set initial z here (applied during init)
        this.z = this.hitlineZPosition-(this.levelSpeed * currentTime)

        //SHAPE AND STUFF
        this.geometry = new THREE.BoxGeometry(0.15, 0.15, 0.05)
                this.material = new THREE.MeshStandardMaterial({
            color: levelConfig.TAP_NOTE_COLORS[this.subLane],
            emissive: new THREE.Color(levelConfig.TAP_NOTE_COLORS[this.subLane]),
            emissiveIntensity: 1.5,
            transparent: true,
            opacity: 0.9,
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = 'tap note'
        this.mesh.renderOrder = levelConfig.RENDER_ORDER.WORLD_OPAQUE

        //sub lane positioning stuff here
        //measurementOfOneSide is the angle size of one side of the level
        this.measurementOfOneSide = (Math.PI * 2) / levelConfig.LANE_COUNT
        this.maxSubLaneOffset = (this.measurementOfOneSide / 2) * 0.8
        this.subLaneOffsets = [
            -this.maxSubLaneOffset, 
            0, 
            this.maxSubLaneOffset
        ]

        this.eventEmitter = eventEmitter
    } 

    init = (tapNotesContainer) => {
        //position the note correctly
        //baseAngle positions the note in the correct lane
        const baseAngle = this.lane * this.measurementOfOneSide 
        const subLaneOffset = this.subLaneOffsets[this.subLane]
        const finalAngle = baseAngle + subLaneOffset - this.levelZRotationOffset

        const radius = levelConfig.TUNNEL_RADIUS
        
        const x = Math.cos(finalAngle) * radius
        const y = Math.sin(finalAngle) * radius
        this.mesh.rotation.z = finalAngle + Math.PI / 4
        this.mesh.position.set(x, y, this.z)

        //set color based on sublane
        // this.mesh.material.color.setHSL(this.subLane/levelConfig.SUB_LANE_COUNT,1,0.5)
        tapNotesContainer.add(this.mesh)
    }

    handleOnHit = () => {
        this.hit = true
        this.mesh.visible = false
        this.killSelf()
    }

    killSelf = () => {
        if(this.geometry)this.geometry.dispose()
        if(this.material)this.material.dispose()
        if(this.mesh)this.mesh.parent.remove(this.mesh)
        
        //emit event
        this.eventEmitter.emit("noteKilled") 
    }

    update(deltaTime, currentTime) {

        ////////////////////////////////
        //how much time is left before tapNote is at player z, essentially
        //a countdown until this tapNote at player
        const timeUntilHit = this.time - currentTime
        const dist = Math.abs(timeUntilHit)

        /////opacity and scale change as note moves
        this.mesh.material.opacity = Math.max(0, Math.min(0.6, 1.2 - dist))
        const scale = 1 + Math.max(0, 0.5 - dist) * 1.5
        this.mesh.scale.set(scale, scale, scale)

        ///////update tapoNote z position
        this.z = this.hitlineZPosition - (this.levelSpeed * timeUntilHit)
        this.mesh.position.z = this.z
  }
}

