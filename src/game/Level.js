import * as THREE from 'three'
import { levelConfig } from '../config'
import GateRing from './GateRing'
import Ramp from './Ramp'
import TapNote from './TapNote'
import FloorPanel from './FloorPanel'
import EventEmitter from './EventEmitter'

//the whole scene tree for the game looks like this:
//           [app scene]
//                |                      
//            [playing state container]___________________________  
//              |                                                 |
//       ______[mainLevelContainer]______________            [app.ui.mainContainer]
//      |                      |                 |
//   [tunnelsContainer]  [ringContainer]  [rampContainer]

export default class Level{
  constructor(app, hitManager, overclockVisualsManager){
    this.app = app
    this.hitManager = hitManager
    this.overclockVisualsManager = overclockVisualsManager
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
    this.floorPanels = []

    //this flag is for cleaning up note arrays after a note has been hit
    this.dirtyNotesExist = false

    //this property used for transition from countdown -> playing
    this.isActivated = false


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
      side: THREE.BackSide, // THIS puts you inside the tunnel

    })

    //MAIN LEVEL CONTAINER, EVERYTHING LEVEL RELATED GOES HERE
    this.mainLevelContainer = new THREE.Group()
    this.mainLevelContainer.name = 'main level container'
    //TUNNELS CONTAINER
    this.tunnelsContainer = new THREE.Group()
    this.tunnelsContainer.name = 'tunnels container'
    //FLOOR PANELS CONTAINER
    this.floorPanelsContainer = new THREE.Group()
    this.floorPanelsContainer.name = 'floor panels container'
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
    //put tunnel in layer 1 - NO BLOOM
    this.tunnel1.layers.set(1)

    this.tunnel2 = new THREE.Mesh(this.geometry, this.material)
    this.tunnel2.rotation.x = Math.PI / 2
    //put tunnel in layer 1 - NO BLOOM
    this.tunnel2.layers.set(1)
  
    
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

    //add everything to mainLevelContainer. mainLevelContainer is actually
    //not inside of a state's container like most other mainContainers. instead,
    //it lives directly on app.scene, and the state wrappers for the
    //playing state and the countdown state control its visibility
    this.mainLevelContainer.add(this.tunnelsContainer)
    this.mainLevelContainer.add(this.floorPanelsContainer)
    this.mainLevelContainer.add(this.tapNotesContainer)
    this.mainLevelContainer.add(this.rampContainer)
    this.mainLevelContainer.add(this.ringContainer)

    //init event emitter here
    this.eventEmitter = new EventEmitter()
    this.eventEmitter.on('noteKilled', () => this.dirtyNotesExist = true)
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

    //init floor panels
    //store the textures for floor panels from texture loader
    const floorPanelColorMapTexture = this.app.assetManager.loadedAssets.textures.circuitColor
    const floorPanelEmissiveMapTexture = this.app.assetManager.loadedAssets.textures.circuitEmissive
    const floorPanelAlphaMap = this.app.assetManager.loadedAssets.textures.circuitAlphaMap
    const songLength = this.app.audioManager.getSongDuration()
    //make one panel per lane
    for(let i = 0; i < this.laneCount; i++){
      //loop over the oc section of this levels notemap, find oc sections for this lane
      const overclockSections = this.levelMap.overclockSections.filter((data, dataIndex) => {
        return data.lane === i
      })
      const countdownOffset = 4 * this.secondsPerBeat
      const panelBeginTimeInSeconds = countdownOffset
      const newFloorPanel = new FloorPanel(
        this.app, 
        this.floorPanelsContainer, 
        floorPanelColorMapTexture, 
        floorPanelEmissiveMapTexture, 
        floorPanelAlphaMap,
        i,
        overclockSections,
        songLength,
        this.beatsPerBar,
        this.secondsPerBeat,
        this.levelSpeed,
        this.currentTime,
        panelBeginTimeInSeconds,
        this.zRotationOffset
      )
      newFloorPanel.init()
      //save in array for later
      this.floorPanels.push(newFloorPanel)
    }

    //init gate rings
    for(let i = 0; i < this.ringCount; i++){
        const ring = new GateRing(this.app, this.ringContainer, i, this.ringSpacing, this.hitlineZPosition, this.ringCount)
        ring.init()
        this.gateRings.push(ring)
    }
     
    //init tapNotes
    this.levelMap.patterns.tapNotes.forEach(tapNoteInLevelMap => {
          const countdownOffset = 4 * this.secondsPerBeat
          const timeInSeconds = (tapNoteInLevelMap.beat - 1) * this.secondsPerBeat + countdownOffset
          const tapNote = new TapNote(
            this.app, 
            this.hitlineZPosition,
            this.levelSpeed, 
            this.zRotationOffset, 
            this.currentTime, 
            tapNoteInLevelMap.lane, 
            tapNoteInLevelMap.subLane, 
            tapNoteInLevelMap.beat,
            timeInSeconds,
            this.eventEmitter
          ) 
          tapNote.init(this.tapNotesContainer)
          this.tapNotes.push(tapNote)
        })

    //init ramps
    this.levelMap.patterns.ramps.forEach(mapNode => {
      const countdownOffset = 4 * this.secondsPerBeat
      const timeInSeconds = (mapNode.beat - 1) * this.secondsPerBeat + countdownOffset
      const ramp = new Ramp(
        this.app, 
        this.hitlineZPosition,
        mapNode.lane, 
        mapNode.duration,
        mapNode.beat,
        timeInSeconds, 
        this.zRotationOffset, 
        this.levelSpeed, 
        this.currentTime,
        this.secondsPerBeat,
        this.eventEmitter
      ) 
      ramp.init(this.rampContainer)
      this.ramps.push(ramp)
    })

    //rotate whole level so lane 1 is at 6oclock
    this.mainLevelContainer.rotation.z = ((2*Math.PI) / (levelConfig.LANE_COUNT)) * 6
  }

  //this method fires from state wrapper when countdown substate changes to
  //playing.
  activate = () => {
    this.isActivated = true
    // this is sort of an offset for the countdown. used to keep every system's beat 1
    // synced
    this.songStartBeat = this.currentBeat
    console.log("LEVEL ACTIVATED, songStartBeat: ", this.songStartBeat)
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

  //for lane rotation
  applyRotation = (deltaTime) => {
      //figure the new rotation
      const lerpFactor = 1 - Math.pow(0.001, deltaTime)
      this.rotation += (this.targetRotation - this.rotation) * lerpFactor
    
      // apply rotation to everything
      this.tunnelsContainer.rotation.z = this.rotation + this.zRotationOffset
      this.floorPanelsContainer.rotation.z = this.rotation + this.zRotationOffset
      this.tapNotesContainer.rotation.z = this.rotation + this.zRotationOffset
      this.rampContainer.rotation.z = this.rotation + this.zRotationOffset
      this.ringContainer.rotation.z = -this.rotation + this.zRotationOffset
  }

  //checks for a tapNoteHit. called in controller on key press
  //returns an object: { note, timeDiff, currentTime }
  checkTapNoteHit = (subLane) => {
    const playerLane = this.playerCurrentLane

    const tapNotesInPlayerLane = this.tapNotes.filter(note => {
      return note.lane === playerLane
    })

    const closestTapNoteInTime = tapNotesInPlayerLane.reduce(
      (acc, note) => {
        const timeUntilHit = (note.time - this.currentTime)
        const absTime = Math.abs(timeUntilHit)
        if (note.hit) return acc
        if (note.subLane !== this.player.subLane) return acc
        if (timeUntilHit > 0.5) return acc
        if (timeUntilHit < -levelConfig.NOTE_TIMING.GOOD) return acc
        if (absTime < acc.timeDiff) {
          return {tapNote: note, timeDiff: absTime, currentTime: this.currentTime}
        }
        return acc
      }, {tapNote: null, timeDiff: Infinity, currentTime: null}
    )


    return closestTapNoteInTime
}

  checkRampHit = () => {

    //return a miss if the player is NOT courching already
    if(!this.player.isCrouching) {
          console.log("not crouched dog")
      return {
      ramp: null, timeDiff: Infinity, currentTime: this.currentTime
      }
    }
    
    const playerLane = this.playerCurrentLane

    const rampsInPlayerLane = this.ramps.filter(ramp => ramp.lane === playerLane)
    console.log("FUUUUUUUUCKKASKDASDASDASDA", rampsInPlayerLane)
    // walk through ramps and return closest ramp in front of player
    const closestRampInTime = rampsInPlayerLane.reduce(
      (acc, ramp) => {
        const timeUntilHit = ramp.time - this.currentTime
        const absTime = Math.abs(timeUntilHit)
        if (ramp.hit) return acc
        if (timeUntilHit > this.secondsPerBeat) return acc
        if(absTime < acc.timeDiff){
          return { ramp: ramp, timeDiff: absTime, currentTime: this.currentTime }
        }  
        return acc
      }, { ramp: null, timeDiff: Infinity, currentTime: this.currentTime }
    )

    return closestRampInTime
  }

  handlePlayerTrick = (keyString) => {
    console.log(`WHOAH!!!! U DID  ATRICK BY HITTING THE ${keyString} KEY`)
    const trick = keyString
    return { trick, currentTime: this.currentTime}
  }

  handlePlayerLand = () => {
    //this is placeholder for later!!! atm just need to return currentTime
    return this.currentTime
  }

  handleStartOverclock = (currentSurgeObject) => {
    //call the overclock visuals manager to start all the cool fx
    this.overclockVisualsManager.onOverclockStart(currentSurgeObject)

    //TO DO :  HIDE ALL SURGE PANELS BUT NOT GLASS PANELKS
    this.floorPanels.forEach(panel => {

    })
  }

  handleEndOverclock = () => {
    this.overclockVisualsManager.onOverclockEnd(currentSurgeObject)
    //TO DO :  SHOW ALL SURGE PANELS BUT NOT GLASS PANELKS
    this.floorPanels.forEach(panel => {

    })
  }

  //resets all note nodes and gate rings
  //gets called in the "onExit" method of the results state.
  reset = () => {
    console.log('level complete!')
    //reset the gate rings array
    this.gateRings = []
    this.tapNotes = []
    this.ramps = []
    this.floorPanels = []
    //reset time stuff
    this.currentTime = 0.00
    this.lastBeat = 3
    this.currentBeat = 0
    this.currentBar = 0
    //reset rotation
    this.rotation = 0
    this.rotationAccumulator = 0
    //reset isActivated
    this.isActivated = false
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
    // clear floor panels
    while (this.floorPanelsContainer.children.length > 0) {
        const child = this.floorPanelsContainer.children[0]
        child.geometry.dispose()
        child.material.dispose()
        this.floorPanelsContainer.remove(child)
    }
  }

  //sets properties related to the song and its bpm
  setSongState = () => {
      this.bpm = this.app.audioManager.getCurrentBpm()
      this.secondsPerBeat = 60/this.bpm
      //distance between each one
      this.ringSpacing = this.secondsPerBeat/this.beatSubdivision
  }

  onBeat = () => {
      this.player.onBeat((Math.floor(this.currentBeat)%this.beatsPerBar)+1)
      this.app.audioManager.playClick()
      this.app.ui.gameplayHUD.surgeMeter.onBeat()
      this.app.ui.gameplayHUD.uplinkMeter.onBeat()
  }

  update = (deltaTime) => {
    //UPDATE MUSIC/BEAT STUFF
    //increment time
    this.currentTime = this.app.audioManager.getCurrentTime()
    
    //store last beat value
    this.lastBeat = this.currentBeat
    //convert time to beats and update currentBeat
    this.currentBeat = this.currentTime / this.secondsPerBeat
    this.currentBar = Math.floor(this.currentBeat / this.beatsPerBar)

    //check fo ra new beat
    if(Math.floor(this.lastBeat) !== Math.floor(this.currentBeat)){
      this.onBeat()
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
   
    //APPLY ROTATION
    this.applyRotation(deltaTime)

  }

  updateNotes = (deltaTime) => {

    this.floorPanels.forEach(panel => {
      panel.update(deltaTime, this.currentTime)
    })


    //remove already hit notes from note arrays if this flag is true
    //set by level -> note nodes mini event system
    if(this.dirtyNotesExist){
      console.log("FILTER ARRAYS FOR DIRTY NOTES")
      this.ramps = this.ramps.filter(ramp => ramp.hit !== true)
      this.tapNotes = this.tapNotes.filter(note => note.hit !== true)
      this.dirtyNotesExist = false
    }


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
        // note.hit = true
        this.app.hitManager.registerHit(note, this.currentTime)
      }
      ////////////////////////////////////////////
    })

    //update ramps
    this.ramps.forEach(ramp => {
      ramp.update(deltaTime, this.currentTime)
      if (!ramp.hit && this.currentTime > ramp.time + levelConfig.NOTE_TIMING.GOOD) {
        // note.hit = true
        this.app.hitManager.registerHit(ramp, this.currentTime)
      }
    })

  }


}