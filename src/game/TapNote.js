import * as THREE from 'three'
import { levelConfig } from '../config'

export default class TapNote{
    constructor(app, hitlineZPosition, levelSpeed, levelZRotationOffset, currentTime, lane, subLane, time){
        this.app = app 
        this.hitlineZPosition = hitlineZPosition
        this.levelSpeed = levelSpeed
        this.levelZRotationOffset = levelZRotationOffset

        //which of the 8 lanes this note exists in
        this.lane = lane 
        //which sublane of the lane this note exists in: 0, 1, or 2
        this.subLane = subLane
        //the time in seconds this note should reach the player
        this.time = time 

        //gets set to true when player hits (or misses) this note. prevents double hits
        this.hit = false

        //set initial z here (applied during init)
        this.z = this.hitlineZPosition-(this.levelSpeed * currentTime)

        //SHAPE AND STUFF
        this.geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
        this.material = new THREE.MeshBasicMaterial({ 
            color: 0xff00ff, transparent: true, opacity: 0.5 
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.name = 'tap note'

        //sub lane positioning stuff here
        //measurementOfOneSide is the angle size of one side of the level
        this.measurementOfOneSide = (Math.PI * 2) / levelConfig.LANE_COUNT
        this.maxSubLaneOffset = (this.measurementOfOneSide / 2) * 0.8
        this.subLaneOffsets = [
            -this.maxSubLaneOffset, 
            0, 
            this.maxSubLaneOffset
        ]
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
        this.mesh.material.color.setHSL(this.subLane/levelConfig.SUB_LANE_COUNT,1,0.5)
        tapNotesContainer.add(this.mesh)
    }

    killSelf = () => {
        if(this.geometry)this.geometry.dispose()
        if(this.material)this.material.dispose()
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

