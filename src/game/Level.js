import * as THREE from 'three'
import { levelConfig } from '../config'
import GateRing from './GateRing'
import Ramp from './Ramp'
import TapNote from './TapNote'

//the whole scene tree for the game looks like this:
//           [app scene]
//                |                      
//            [playing state container]___________________________  
//              |                                                 |
//       ______[mainLevelContainer]______________            [app.ui.mainContainer]
//      |                      |                 |
//   [tunnelsContainer]  [ringContainer]  [rampContainer]

export default class Level{
  constructor(app, hitManager){
    this.app = app
    this.hitManager = hitManager
    this.levelMap = null
    
    //bring in some constants from config
    this.levelSpeed = levelConfig.SPEED
    this.laneCount = levelConfig.LANE_COUNT
    //radians measurement of a face
    this.laneAngle = (Math.PI * 2) / this.laneCount
    this.playerCurrentLane = levelConfig.STARTING_LANE
    this.playerCurrentSubLane = levelConfig.STARTING_SUB_LANE
    //4/4 time
    this.beatsPerBar = 4
    this.beatSubdivision = levelConfig.GATE_RING_BEAT_SUBDIVISION
    //how many gate rings
    this.ringCount = levelConfig.RING_COUNT    
    //hitline aka where the notes are being timed to (also where the player sits in space)
    this.hitlineZPosition = levelConfig.PLAYER_Z_VALUE


    //time-related stuff (<--there's a reset function for all this below)
    this.currentTime = 0.00
    this.lastBeat = 3
    this.currentBeat = 0
    this.currentBar = 0

   //establish some arrays to hold things
    this.gateRings = []
    this.tapNotes = []
    this.ramps = []

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
    //NOTES CONTAINER
    this.tapNotesContainer = new THREE.Group()
    this.tapNotesContainer.name = 'tap notes container'
    //WORLD HIT FX CONTAINER
    this.worldHitFxContainer = new THREE.Group()
    this.worldHitFxContainer.name = 'world hit fx container'
    
  

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

    //positioning
    this.rotation = 0
    this.rotationAccumulator = 0
    this.targetRotation = 0
    this.rotationVelocity = 0

    //add tunnels to mainLevelContainer
    this.tunnelsContainer.add(this.tunnel1)
    this.tunnelsContainer.add(this.tunnel2)

    //add everything to mainLevelContainer. on application start, mainLevelContainer
    //gets added to Application.masterGameContainer which gets added to
    //main scene
    this.mainLevelContainer.add(this.tunnelsContainer)
    this.mainLevelContainer.add(this.tapNotesContainer)
    this.mainLevelContainer.add(this.rampContainer)
    this.mainLevelContainer.add(this.ringContainer)
  }

  init = (noteMap) => {
    //first set this levels map to selected song's note map in audio manager
    this.levelMap = noteMap 
    //sets song-dependant variables like bpm, secondsPerBeat
    this.setSongState()
    //FOG EFFECT
    this.app.scene.fog = new THREE.Fog(0x000000, 2, 15)

    //position tunnel
    this.tunnel1.position.z = 0
    // position second tunnel exactly one length behind
    this.tunnel2.position.z = -levelConfig.TUNNEL_LENGTH 

    //init gate rings
    for(let i = 0; i < this.ringCount; i++){
        const ring = new GateRing(this.app, this.ringContainer, i, this.ringSpacing, this.hitlineZPosition, this.ringCount)
        ring.init()
        this.gateRings.push(ring)
    }
     
    //init tapNotes
    this.levelMap.patterns.tapNotes.forEach(tapNoteInLevelMap => {
          const timeInSeconds = (tapNoteInLevelMap.beat - 1) * this.secondsPerBeat
          const tapNote = new TapNote(
            this.app, 
            this.hitlineZPosition,
            this.levelSpeed, 
            this.zRotationOffset, 
            this.currentTime, 
            tapNoteInLevelMap.lane, 
            tapNoteInLevelMap.subLane, 
            timeInSeconds,
          ) 
          tapNote.init(this.tapNotesContainer)
          this.tapNotes.push(tapNote)
        })

    //init ramps
    this.levelMap.patterns.ramps.forEach(mapNode => {
      const timeInSeconds = (mapNode.beat - 1) * this.secondsPerBeat
      const ramp = new Ramp(
        this.app, 
        this.hitlineZPosition,
        mapNode.lane - 1, 
        timeInSeconds, 
        this.zRotationOffset, 
        this.levelSpeed, 
        this.currentTime) 
      ramp.init(this.rampContainer)
      this.ramps.push(ramp)
    })
    


    //rotate whole level so lane 1 is at 6oclock
    this.mainLevelContainer.rotation.z = ((2*Math.PI) / (levelConfig.LANE_COUNT)) * 6
  }

  setPlayer(player) {
    this.player = player
  }

  changeLane = (direction) => {
      this.rotationAccumulator -= direction
      this.targetRotation = this.rotationAccumulator * this.laneAngle

      //keep track of playerCurrentLane
      this.playerCurrentLane = (this.playerCurrentLane + direction + this.laneCount) % this.laneCount
      console.log('DEBUG: PLAYER CURRENT LANE: ', this.playerCurrentLane)
  }

  applyRotation = (deltaTime) => {
      //figure the new rotation
      const lerpFactor = 1 - Math.pow(0.001, deltaTime)
      this.rotation += (this.targetRotation - this.rotation) * lerpFactor
    
      // apply rotation to everything
      this.tunnelsContainer.rotation.z = this.rotation + this.zRotationOffset
      this.tapNotesContainer.rotation.z = this.rotation + this.zRotationOffset
      this.rampContainer.rotation.z = this.rotation + this.zRotationOffset
      this.ringContainer.rotation.z = -this.rotation + this.zRotationOffset
  }

  //checks for a tapNoteHit. called in controller on key press
  //returns an object: { note, timeDiff, currentTime }
  checkTapNoteHit = (subLane) => {
    const playerLane = this.playerCurrentLane

    const closestTapNoteInTime = this.tapNotes.reduce(
      (acc, note) => {
        const timeUntilHit = (note.time - this.currentTime)
        const absTime = Math.abs(timeUntilHit)
        if (note.hit) return acc
        if (note.lane !== playerLane) return acc
        if (note.subLane !== this.player.subLane) return acc
        if (timeUntilHit > 0.5) return acc
        if (timeUntilHit < -levelConfig.NOTE_TIMING.GOOD) return acc
        if (absTime < acc.timeDiff) {
          return { note: note, timeDiff: absTime, currentTime: this.currentTime }
        }
        return acc
      }, { note: null, timeDiff: Infinity, currentTime: null }
    )

    return closestTapNoteInTime
}

  checkRampHit = () => {
    const playerLane = this.playerCurrentLane

    // walk through ramps and return closest ramp in front of player
    const closestRampInTime = this.ramps.reduce(
      (acc, ramp) => {
      const timeUntilHit = ramp.time - this.currentTime
      const absTime = Math.abs(timeUntilHit)
      if (ramp.hit) return acc
      if (absTime > 2.0) return acc
      if(absTime < acc.timeDiff){
        return { ramp: ramp, timeDiff: absTime }
      }  
      return acc
      }, { ramp: null, timeDiff: Infinity }
    )

    const ramp = closestRampInTime.ramp

    if (!ramp) {
      console.log("MISS (no ramp)")
      return
    }

    const timeUntilHit = ramp.time - this.currentTime


    //check to prevent double hit on ramp
    if(ramp.hit) return

    // lane check
    if (ramp.lane !== playerLane) {
      this.hitManager.spawnHitEffect("MISS", "ui")
      return
    }

    //check timing and spawn and effect!
    if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.PERFECT) {
      this.hitManager.spawnHitEffect("PERFECT", "ui")
    } else if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.GOOD) {
      this.hitManager.spawnHitEffect("GOOD", "ui")
    } else {
      this.hitManager.spawnHitEffect("MISS", "ui")
    }
    //set ramp hit to true
    ramp.hit = true
  }

  //resets all note nodes and gate rings
  //gets called in the "onExit" method of the results state.
  reset = () => {
    console.log('level complete!')
    //reset the gate rings array
    this.gateRings = []
    this.tapNotes = []
    this.ramps = []
    //reset time stuff
    this.currentTime = 0.00
    this.lastBeat = 3
    this.currentBeat = 0
    this.currentBar = 0
    //reset rotation
    this.rotation = 0
    this.rotationAccumulator = 0
    //aaaand clean up the geometry
    // clear tap notes
    while (this.tapNotesContainer.children.length > 0) {
        const child = this.tapNotesContainer.children[0]
        child.geometry.dispose()
        child.material.dispose()
        this.tapNotesContainer.remove(child)
    }
    // clear ramps
    while (this.rampContainer.children.length > 0) {
        const child = this.rampContainer.children[0]
        child.geometry.dispose()
        child.material.dispose()
        this.rampContainer.remove(child)
    }
    // clear gate rings
    while (this.ringContainer.children.length > 0) {
        const child = this.ringContainer.children[0]
        child.geometry.dispose()
        child.material.dispose()
        this.ringContainer.remove(child)
    }
  }

  //sets properties related to the song and its bpm
  setSongState = () => {
      this.bpm = this.app.audioManager.getCurrentBpm()
      this.secondsPerBeat = 60/this.bpm
      //distance between each one
      this.ringSpacing = this.secondsPerBeat/this.beatSubdivision
  }

  update = (deltaTime) => {
    //UPDATE MUSIC/BEAT STUFF
    //increment time
    this.currentTime = this.app.audioManager.getCurrentTime()

    // //check if song is over
    // if(this.app.audioManager.isFinished()){
    //   this.endLevel()
    // }
    
    //store last beat value
    this.lastBeat = this.currentBeat
    //convert time to beats and update currentBeat
    this.currentBeat = this.currentTime / this.secondsPerBeat
    this.currentBar = Math.floor(this.currentBeat / this.beatsPerBar)

    //check fo ra new beat
    if(Math.floor(this.lastBeat) !== Math.floor(this.currentBeat)){
      // console.log(this.currentBar, Math.floor(this.currentBeat)%this.beatsPerBar)
      this.player.onBeat((Math.floor(this.currentBeat)%this.beatsPerBar)+1)
      this.app.audioManager.playClick()
    }

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
        //DEBUGGING GATE RINGS WITH A CLICK
        // const wasBeforePlayer = ring.mesh.position.z < this.hitlineZPosition
        ring.update(deltaTime, this.levelSpeed, this.currentTime)

        //DEBUGGING GATE RINGS WITH A CLICK
        // const isAfterPlayer = ring.mesh.position.z >= this.hitlineZPosition
        // if (wasBeforePlayer && isAfterPlayer) {
        //     this.app.audioManager.playKeyPressClick()
        // }
    })

    this.tapNotes.forEach(note => {
      //////////////////////////////////////////
      // DEBUG - checking timing with a click
      // const wasBeforeHitline = note.mesh.position.z < this.hitlineZPosition
      // note.update(deltaTime, this.currentTime)
      // const isAfterHitline = note.mesh.position.z >= this.hitlineZPositio
      // if (wasBeforeHitline && isAfterHitline) {
      //     this.app.audioManager.playClick(true, -0.016) // true = downbeat sound so it's distinct
      // }
      /////////////////////////////////////////////

      ////////////////////////////////////////////
      // DEBUG - NO click
      note.update(deltaTime, this.currentTime)
      //check for notes the player has missed and have passed the hitLine
      if (!note.hit && this.currentTime > note.time + levelConfig.NOTE_TIMING.GOOD) {
        this.app.hitManager.registerHit(note, -1000)
      }
      ////////////////////////////////////////////
    })

    //update ramps
    this.ramps.forEach(ramp => {
      ramp.update(deltaTime, this.currentTime)
    })

    //APPLY ROTATION
    this.applyRotation(deltaTime)

  }
}