import * as THREE from 'three'
import { levelConfig } from '../../config'
import GateRing from '../GateRing'
import Ramp from '../Ramp'
import TapNote from '../TapNote'
import FloorPanel from '../FloorPanel'
import EventEmitter from '../EventEmitter'
import Rail from '../note_nodes/Rail'
import ENUMS from '../../enums'


export default class LevelEditor{
  constructor(app){
    this.app = app
    this.levelMap = null
    
    //bring in some constants from config
    this.levelSpeed = levelConfig.SPEED
    this.laneCount = levelConfig.LANE_COUNT
    //radians measurement of a face
    this.laneAngle = (Math.PI * 2) / this.laneCount
    this.cursorCurrentLane = levelConfig.STARTING_LANE
    this.cursorCurrentSubLane = levelConfig.STARTING_SUB_LANE
    //this is basically what is the finest grain of gate rings which is 16th notes
    this.gateRingsPerBeat = levelConfig.GATE_RING_BEAT_SUBDIVISION_EDITOR
    //hitline aka where the notes are being timed to (also where the player sits in space)
    this.hitlineZPosition = levelConfig.PLAYER_Z_VALUE
    //whereas in level.js gate rings are looping (and their number from config), here
    //it is calculated based on song length/number of beats and is done in 
    // gate ring init method
    this.totalNumberOfGateRings = null    


    //time-related stuff (<--there's a reset function for all this below)
    this.currentTime = 0.00
    this.currentBeat = 0
    this.currentBar = 0
    //default to 4 beats per bar
    this.beatsPerBar = 4
    this.totalBeatsInSong = null
    this.currentBeatSubdivision = null
    this.lastBeat = null
    this.lastBeatEighth = null
    this.currentBeatEighth = null
    this.lastBeatSixteenth = null
    this.currentBeatSixteenth = null
    //targetTime and currentBeatAccumulator used for tunnel movement lerping
    this.targetTime = 0.00
    this.currentBeatAccumulator = 0

    //SOME POSITIONING STUFF
    //rotation
    this.rotation = 0
    this.rotationAccumulator = 0
    this.targetRotation = 0
    this.rotationVelocity = 0

   //establish some arrays to hold things
    this.gateRings = []
    this.tapNotes = []
    this.ramps = []
    this.rails = []
    this.floorPanels = []

    //this flag is for cleaning up note arrays after a note has been hit
    this.dirtyNotesExist = false

    //this property used for transition from countdown -> playing
    this.isActivated = false


//~~*+*~~//~~*+*~~//~~*+*~~/ -- MESH SETUP --/~~*+*~~//~~*+*~~//~~*+*~~//~~*+*~~//
    //in the normal Level, there are two tunnels that loop. here in the editor, there is 
    //one tunnel, with a length related to the length of the current song. before
    //length is calculated, a placeholder geometry is used here that is later replaced
    //here tunnelLength is a placeholder for actual tunnelLength calculated during init
    this.tunnelLength = null

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

    //TUNNEL MESH setup
    this.tunnel = new THREE.Mesh(this.geometry, this.material)
    //tunnel have to be rotated 90 deg on x so youre going THROUGH it
    this.tunnel.rotation.x = Math.PI / 2
    //put tunnel in layer 1 - NO BLOOM
    this.tunnel.layers.set(1)

    //EDGES OF TUNNEL
    this.tunnelEdge = new THREE.EdgesGeometry(this.geometry)
    this.tunnelLine = new THREE.LineSegments(
      this.tunnelEdge,
      new THREE.LineBasicMaterial({ color: 0xF57927 })
    )
     this.tunnel.add(this.tunnelLine)

    //~~*+*~~//~~*+*~~//~~*+*~~//~~*+*~~//~~*+*~~//~~*+*~~//~~*+*~~//~~*+*~~//~~*+*~~//


    //ALL THE CONTAINS HERE
    this.mainContainer = new THREE.Group()
    this.mainContainer.name = 'main level container'
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
    //RAILS CONTAINER 
    this.railContainer = new THREE.Group()
    this.railContainer.name = 'rail container'
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

    //~~*+*~~//~~*+*~~//~~*+*~~/ --ADD TO CONTAINERS -- /~~*+*~~//~~*+*~~//~~*+*~~//
    //add tunnels to mainContainer
    this.tunnelsContainer.add(this.tunnel)
    //add everything to mainContainer. mainContainer is actually
    //not inside of a state's container like most other mainContainers. instead,
    //it lives directly on app.scene, and the state wrappers for the
    //playing state and the countdown state control its visibility
    this.mainContainer.add(this.tunnelsContainer)
    this.mainContainer.add(this.floorPanelsContainer)
    this.mainContainer.add(this.tapNotesContainer)
    this.mainContainer.add(this.rampContainer)
    this.mainContainer.add(this.railContainer)
    this.mainContainer.add(this.ringContainer)

    //init event emitter here
    this.eventEmitter = new EventEmitter()
    this.eventEmitter.on('noteKilled', () => this.dirtyNotesExist = true)

    //this gets set in setup
    this.cursor = null
  }

  //called in main.js
  setCursor = (cursor) => {
    this.cursor = cursor
  }

  init = () => {
    //first set this levels map to selected song's note map in audio manager
    // this.levelMap = noteMap 
    this.levelMap = {}
    //sets song-dependant variables like bpm, secondsPerBeat
    this.setSongState()
    this.setTunnelLength()
    
    //FOG EFFECT
    this.app.scene.fog = new THREE.Fog(0x000000, 2, 15)

    //position tunnel
    this.tunnel.position.z = 0

    //init floor panels
    //store the textures for floor panels from texture loader
    const floorPanelColorMapTexture = this.app.assetManager.loadedAssets.textures.circuitColor
    const floorPanelEmissiveMapTexture = this.app.assetManager.loadedAssets.textures.circuitEmissive
    const floorPanelAlphaMap = this.app.assetManager.loadedAssets.textures.circuitAlphaMap
    
    console.log("LEVEL EDITOR DEBUG---currentBeatSubdivision: ", this.currentBeatSubdivision)
    //make one panel per lane
    for(let i = 0; i < this.laneCount; i++){
      //loop over the oc section of this levels notemap, find oc sections for this lane
      // const overclockSections = this.levelMap.overclockSections.filter((data, dataIndex) => {
      //   return data.lane === i
      // })
      const overclockSections = []
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
        this.songLengthInSeconds,
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

    this.initGateRings()
     
    //init TAPNOTES
    // this.levelMap.patterns.tapNotes.forEach(tapNoteInLevelMap => {
    //       const countdownOffset = 4 * this.secondsPerBeat
    //       const timeInSeconds = (tapNoteInLevelMap.beat - 1) * this.secondsPerBeat + countdownOffset
    //       const tapNote = new TapNote(
    //         this.app, 
    //         this.hitlineZPosition,
    //         this.levelSpeed, 
    //         this.zRotationOffset, 
    //         this.currentTime, 
    //         tapNoteInLevelMap.lane, 
    //         tapNoteInLevelMap.subLane, 
    //         tapNoteInLevelMap.beat,
    //         timeInSeconds,
    //         this.eventEmitter
    //       ) 
    //       tapNote.init(this.tapNotesContainer)
    //       this.tapNotes.push(tapNote)
    //     })

    // //init RAMPS
    // this.levelMap.patterns.ramps.forEach(ramp => {
    //   const countdownOffset = 4 * this.secondsPerBeat
    //   const timeInSeconds = (ramp.beat - 1) * this.secondsPerBeat + countdownOffset
    //   const durationInSeconds = ramp.duration * this.secondsPerBeat
    //   const newRamp = new Ramp(
    //     this.app, 
    //     this.hitlineZPosition,
    //     ramp.lane, 
    //     ramp.duration,
    //     ramp.beat,
    //     timeInSeconds,
    //     durationInSeconds,
    //     this.zRotationOffset, 
    //     this.levelSpeed, 
    //     this.currentTime,
    //     this.secondsPerBeat,
    //     this.eventEmitter
    //   ) 
    //   newRamp.init(this.rampContainer)
    //   this.ramps.push(newRamp)
    // })

    // //init RAILS
    // this.levelMap.patterns.rails.forEach(rail => {
    //   const countdownOffset = 4 * this.secondsPerBeat
    //   const timeInSeconds = (rail.beat - 1) * this.secondsPerBeat + countdownOffset
    //   const durationInSeconds = rail.duration * this.secondsPerBeat
    //   const newRail = new Rail(
    //     this.app, 
    //     this.hitlineZPosition,
    //     rail.lane, 
    //     rail.duration,
    //     rail.beat,
    //     timeInSeconds, 
    //     durationInSeconds,
    //     this.zRotationOffset, 
    //     this.levelSpeed, 
    //     this.currentTime,
    //     this.secondsPerBeat,
    //     this.eventEmitter,
    //   ) 
    //   newRail.init(this.railContainer)
    //   this.rails.push(newRail)
    // })

    //set beatSubdivision
    this.currentBeatSubdivision = this.app.ui.editorWriteHUD.getCurrentBeatSubdivision()
    this.updateGateRingVisibility()

    //rotate whole level so lane 1 is at 6oclock
    this.mainContainer.rotation.z = ((2*Math.PI) / (levelConfig.LANE_COUNT)) * 6
  }

  //this method fires from state wrapper when countdown substate changes to
  //playing.
  activate = () => {
    this.isActivated = true
    // this is sort of an offset for the countdown. used to keep every system's beat 1
    // synced
    this.songStartBeat = this.currentBeat
  }

    //ooook in total there should be 4 gate rings per beat, like this:
    //// 0 - down beat
    //// 1 - sixteenth
    //// 2 - upbeat
    //// 3 - sixteenth
    ////  -----------
    //// 4 - down beat
    //// 5 - sixteenth
    //// ....
    //sooo loop over each beat and make 4 rings per beat
  initGateRings = () => {
    //but first get some variables needed for gate rings:
    this.ringSpacing = this.secondsPerBeat/this.gateRingsPerBeat
    //use values from song state init to figure the total number of gate rings ie
    //how many sixteenth notes are in song, since that's smallest subdivision option
    this.totalNumberOfGateRings = this.totalBeatsInSong * this.gateRingsPerBeat 

    for(let i = 0; i < this.totalBeatsInSong; i++){
      for(let j = 0; j < this.gateRingsPerBeat; j++){
        let beatSubdivisionString
        switch (j) {
          case 0:
            beatSubdivisionString = ENUMS.BEAT_SUBDIVISON_STRINGS.DOWN
            break;
          case 1:
            beatSubdivisionString = ENUMS.BEAT_SUBDIVISON_STRINGS.SIXTEENTH
            break;
          case 2: 
            beatSubdivisionString = ENUMS.BEAT_SUBDIVISON_STRINGS.UP
            break;
          default: beatSubdivisionString = ENUMS.BEAT_SUBDIVISON_STRINGS.SIXTEENTH
            break;
        }
        const ringIndex = i * 4 + j
        const ring = new GateRing(this.app, this.ringContainer, ringIndex, this.ringSpacing, this.hitlineZPosition, this.totalNumberOfGateRings, beatSubdivisionString)
        ring.init()
        this.gateRings.push(ring)
      }
    }
  }

  initTripletGateRings = () => {

  }

  setBeatSubdivision = (newBeatSubdivision) => {
    this.currentBeatSubdivision = newBeatSubdivision
    console.log("setting beat subdivision to...: ", this.currentBeatSubdivision)
    this.updateGateRingVisibility()
  }

  updateGateRingVisibility = () => {
    const subdivision = this.currentBeatSubdivision
    //TO DO!! REMOVE THIS - ONLY FOR TESTING!
    if(subdivision === 3)return

    //first reset all rings to visible
    this.gateRings.forEach(gateRing => gateRing.mesh.visible = true)
    
    /////quyarter ntoes/////
    if(subdivision === 1){
      this.gateRings.forEach(gateRing => {
        if(gateRing.beatSubdivision !== ENUMS.BEAT_SUBDIVISON_STRINGS.DOWN)gateRing.mesh.visible = false
      })
    }
    /////eighth ntoes/////
    if(subdivision === 2){
      this.gateRings.forEach(gateRing => {
        if(gateRing.beatSubdivision === ENUMS.BEAT_SUBDIVISON_STRINGS.SIXTEENTH || gateRing.beatSubdivision === ENUMS.BEAT_SUBDIVISON_STRINGS.TRIPLET)gateRing.mesh.visible = false
      })
    }

    ////~~**TO DO: TRIPLETS!**~~////

    /////sixteenth ntoes/////
    if(subdivision === 4){
      this.gateRings.forEach(gateRing => {
        if(gateRing.beatSubdivision === ENUMS.BEAT_SUBDIVISON_STRINGS.TRIPLET)gateRing.mesh.visible = false
      })
    }
  }

  changeLane = (direction) => {
      this.rotationAccumulator -= direction
      this.targetRotation = this.rotationAccumulator * this.laneAngle

      //keep track of cursorCurrentLane
      this.cursorCurrentLane = (this.cursorCurrentLane + direction + this.laneCount) % this.laneCount
      console.log("lane rotation debug: ", this.rotationAccumulator, this.targetRotation, this.cursorCurrentLane)
  }

  //moves the tunnel forward or back by 1 of the current beat subdivision unit
  moveTunnel = (direction) => {
    //first, get how many beatsToMove the tunnel based on the currently
    //selected beat subdivision
    const beatsToMove = direction * (1/this.currentBeatSubdivision)
    //add to accumulator
    this.currentBeatAccumulator += beatsToMove
    //then convert that to seconds and sett the new targetTime
    this.targetTime = this.currentBeatAccumulator * this.secondsPerBeat
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
      this.railContainer.rotation.z = this.rotation + this.zRotationOffset
      this.ringContainer.rotation.z = -this.rotation + this.zRotationOffset
  }

  //for lerping the tunnel movement
  applyMovement = (deltaTime) => {
    const lerpFactor = 1 - Math.pow(0.001, deltaTime)
    this.currentTime += (this.targetTime - this.currentTime) * lerpFactor
  }

  //simply returns bool about if tapnote is incoming
  hasHittableTapNote = () => {
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
          return {tapNote: note, timeDiff: absTime}
        }
        return acc
      }, {tapNote: null, timeDiff: Infinity}
    )

    return closestTapNoteInTime.tapNote !== null
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
      return {
      ramp: null, timeDiff: Infinity, currentTime: this.currentTime
      }
    }
    
    const playerLane = this.playerCurrentLane
    const rampsInPlayerLane = this.ramps.filter(ramp => ramp.lane === playerLane)
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

checkRailHit = () => {
    //filter lane matching rails
    const railsInPlayerLane = this.rails.filter(rail => rail.lane === this.playerCurrentLane)

    const EARLY_WINDOW = levelConfig.NOTE_TIMING.GOOD

    const closestOngoingRail = railsInPlayerLane.reduce(
      (acc, rail) => {
        const timeSinceStart = this.currentTime - rail.time
        const railEndTime = rail.time + rail.duration * this.secondsPerBeat
        if (rail.hit) return acc
        if(this.currentTime > railEndTime) return acc
        if(this.currentTime > rail.time - EARLY_WINDOW && this.currentTime < railEndTime){
          return { rail: rail, currentTime: this.currentTime, timeSinceStart }
        }  
        return acc
      }, { rail: null, currentTime: this.currentTime, timeSinceStart: null }
    )

    return closestOngoingRail
  }

  handlePlayerTrick = (keyString) => {
    const trick = keyString
    return { trick, currentTime: this.currentTime}
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
    //reset the gate rings array
    this.gateRings = []
    this.tapNotes = []
    this.rails = []
    this.ramps = []
    this.floorPanels = []
    //reset time stuff
    this.currentTime = 0.00
    this.lastBeat = 3
    this.currentBeat = 0
    this.currentBeatAccumulator = 0
    this.currentBar = 0
    this.lastBeatSixteenth = null
    this.currentBeatSixteenth = null
    //reset rotation
    this.rotation = 0
    this.rotationAccumulator = 0
    this.targetRotation = 0
    this.rotationVelocity = 0
    this.cursorCurrentLane = levelConfig.STARTING_LANE
    this.cursorCurrentSubLane = levelConfig.STARTING_SUB_LANE
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
    //clear rails
    while (this.railContainer.children.length > 0) {
        const child = this.railContainer.children[0]
        child.geometry.dispose()
        child.material.dispose()
        this.railContainer.remove(child)
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
        if(child.geometry)child.geometry.dispose()
        if(child.material)child.material.dispose()
        this.floorPanelsContainer.remove(child)
    }
  }

  //sets properties related to the song and its bpm. called in init
  setSongState = () => {
      this.songLengthInSeconds = this.app.audioManager.getSongDurationInSeconds()
      this.bpm = this.app.audioManager.getCurrentBpm()
      this.beatsPerSecond = this.bpm / 60
      this.secondsPerBeat = 60/this.bpm
      this.totalBeatsInSong = Math.round(this.songLengthInSeconds / this.secondsPerBeat)
      console.log("DEBUG---> bpm: ", this.bpm, "bps: ", this.beatsPerSecond, "totalBeatsInSong: ", this.totalBeatsInSong)
  }

  //calculates the tunnel mesh's length based on the current song's length.
  //then, disposes of the tunnel's initial geometry (built in the constructor) and
  //set a new geometry based on this calculated length. this is all specific to the editor
  setTunnelLength = () => {
    //calcu tunnel length
    this.tunnelLength = this.songLengthInSeconds * this.levelSpeed
    //dispose of old stuff
    this.tunnel.remove(this.tunnelLine)
    this.geometry.dispose()
    this.tunnelEdge.dispose()
    this.tunnelLine.material.dispose()
    //build new geometry, lines, and edges.
    this.geometry = new THREE.CylinderGeometry(
      levelConfig.TUNNEL_RADIUS,     // radius top
      levelConfig.TUNNEL_RADIUS,     // radius bottom
      this.tunnelLength,    // length of tunnel
      levelConfig.LANE_COUNT,     // sides (hexagon)
      1,
      true   // open ended
    )
    this.tunnelEdge = new THREE.EdgesGeometry(this.geometry)
    this.tunnelLine = new THREE.LineSegments(
      this.tunnelEdge,
      new THREE.LineBasicMaterial({ color: 0xF57927 })
    )
    //then set everything
    this.tunnel.geometry = this.geometry
    this.tunnel.add(this.tunnelLine)
 }

  onBeat = () => {
      this.app.audioManager.playClick()
      this.app.ui.gameplayHUD.surgeMeter.onBeat()
      this.app.ui.gameplayHUD.uplinkMeter.onBeat()
  }

  onBeatEighth = () => {
    // this.player.onBeatEighth((Math.floor(this.currentBeat)%this.beatsPerBar)+1)
  }

  onBeatSixteenthNote = () => {
    // this.app.scoreManager.onBeatSixteenth()
    // this.player.onBeatSixteenth((Math.floor(this.currentBeat)%this.beatsPerBar)+1)
  }

  update = (deltaTime) => {
    //UPDATE MUSIC/BEAT STUFF
    //increment time
    // this.currentTime = this.app.audioManager.getCurrentTime()
    // console.log(this.currentTime, "<----debug current time")
    //ON BEAT STUFF
    //store last beat value
    this.lastBeat = this.currentBeat
    //convert time to beats and update currentBeat
    // this.currentBeat = this.currentTime / this.secondsPerBeat
    this.currentBar = Math.floor(this.currentBeat / this.beatsPerBar)
    //check fo ra new beat
    if(Math.floor(this.lastBeat) !== Math.floor(this.currentBeat)){
      this.onBeat()
    }
    this.lastBeatEighth = this.currentBeatEighth
    this.currentBeatEighth = this.currentBeat * 2
    if(Math.floor(this.lastBeatEighth) !== Math.floor(this.currentBeatEighth)){
      this.onBeatEighth()
    }
    //check for a new sixteenth note beat
    this.lastBeatSixteenth = this.currentBeatSixteenth
    this.currentBeatSixteenth = this.currentBeat * 4
    if(Math.floor(this.lastBeatSixteenth) !== Math.floor(this.currentBeatSixteenth)){
      this.onBeatSixteenthNote()
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

    this.applyMovement(deltaTime)

  }

  updateNotes = (deltaTime) => {

    this.floorPanels.forEach(panel => {
      panel.update(deltaTime, this.currentTime)
    })


    //remove already hit notes from note arrays if this flag is true
    //set by level -> note nodes mini event system
    if(this.dirtyNotesExist){
      this.ramps = this.ramps.filter(ramp => ramp.readyForRemoval !== true)
      this.tapNotes = this.tapNotes.filter(note => note.readyForRemoval !== true)
      this.rails = this.rails.filter(rail => rail.readyForRemoval !== true)
      this.dirtyNotesExist = false
    }


    this.tapNotes.forEach(note => {
      note.update(deltaTime, this.currentTime)
      //tapnotes need to also check if the player isInAir
      if (!note.hit && !this.player.isInAir && this.currentTime > note.time + levelConfig.NOTE_TIMING.GOOD) {
        if(note.lane === this.playerCurrentLane){
          // const hitScore = this.app.hitManager.registerHit(note, this.currentTime)
          const hitScore = ENUMS.JUDGEMENT.MISS
          this.app.scoreManager.updateScore(hitScore)
        }
        note.markMissed() 
      }
    })

    //update ramps
    this.ramps.forEach(ramp => {
      ramp.update(deltaTime, this.currentTime)
      if (!ramp.hit && !this.player.isInAir && this.currentTime > ramp.time + levelConfig.NOTE_TIMING.GOOD) {
        if(ramp.lane === this.playerCurrentLane){
          // const hitScore = this.app.hitManager.registerHit(ramp, this.currentTime)
          const hitScore = ENUMS.JUDGEMENT.MISS
          this.app.scoreManager.updateScore(hitScore)
        }
        ramp.markMissed()
      }
    })


    //update rails
    this.rails.forEach(rail => {
      rail.update(deltaTime, this.currentTime)
      if (!rail.hit && this.currentTime > rail.time + rail.duration * this.secondsPerBeat + levelConfig.NOTE_TIMING.GOOD) {
        if(rail.lane === this.playerCurrentLane){
          // const hitScore = this.app.hitManager.registerHit(rail, this.currentTime)
          const hitScore = ENUMS.JUDGEMENT.MISS
          this.app.scoreManager.updateScore(hitScore)
        }
        rail.markMissed()
      }
    })
  }

}