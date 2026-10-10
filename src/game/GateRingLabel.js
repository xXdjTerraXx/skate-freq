import * as THREE from 'three'
import { levelConfig } from '../config'
import { createTextNode } from '../utils'

     
export default class GateRingLabel{
    constructor(ring, songBeat, barNumber, ringLabelsContainer){
        this.ring = ring
        //each label corresponds to a downbeat gate ring. song beat is the gate ring's
        //stepValue (which uses the 0 index numbering like the accumulator in level editor).
        //so songBeat is the stepValue converted with the map helper's accumulatorToSongBeat
        //method 
        this.songBeat = songBeat
        this.barNumber = barNumber
        this.ringLabelsContainer = ringLabelsContainer
        //the position of the ring that this label follows
        this.ringPosition = ring.mesh.position

        this.labelPosition = {
            x: -(this.ringPosition.x + levelConfig.TUNNEL_RADIUS * .7)+.5,
            y: (this.ring.mesh.position.y + levelConfig.TUNNEL_RADIUS * .7)+.1
        }


        //constants
        this.HEIGHT = .35
        this.WIDTH = .35
        //the first four beats are labeled like "COUNTDOWN" so geometry needs to be longer
        this.COUNTODNW_HEIGHT = 1.25
        this.BACKGROUND_COLOR = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.backgroundColor
        this.FONT_COLOR = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.fontColor
        this.BORDER_COLOR = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.borderColor
        this.FONT_SIZE = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.fontSize
        this.LEVEL_SPEED = levelConfig.SPEED
        this.TEXT_Z = 0.03
        this.BACKGROUND_Z = .02
        this.BORDER_Z = 0.025
        this.hitlineZPosition = levelConfig.PLAYER_Z_VALUE

        //----------------------------------------------------------------------------//
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`CONTAINERS~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //the main container for the label
        this.mainContainer = new THREE.Group()
        this.mainContainer.name = `beat ${this.songBeat} gate ring label`
        // this.mainContainer.position.set(this.labelPosition.x, this.labelPosition.y, this.labelPosition.z  + .05)

        //beat labels container
        this.beatLabelsContainer = new THREE.Group()
        this.beatLabelsContainer.name = 'beat labels container'

        //bar labels container
        this.barLabelsContainer = new THREE.Group()
        this.barLabelsContainer.name = 'bar labels container'

        //countdown label container
        //this is for the labels for the first four beats that say COUNTDOWN
        this.countdownLabelContainer = new THREE.Group()
        this.countdownLabelContainer.name = 'countdown label container'
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //----------------------------------------------------------------------------//

        //----------------------------------------------------------------------------//
        //~~*+`~~*+`~~*+`~~*+`SHARED MATERIALS~~*+`~~*+`~~*+`~~*+`~~*+`//
        //BACKGROUND
        this.backgroundMaterial = new THREE.MeshBasicMaterial({
            color: this.BACKGROUND_COLOR,
            side: THREE.DoubleSide
        })
        //BORDER
        this.borderMaterial = new THREE.LineBasicMaterial({ color: this.BORDER_COLOR })
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //----------------------------------------------------------------------------//

        
        //----------------------------------------------------------------------------//
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`*FINISH INIT*`+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //these labels need a rotation to make up the fact that the world is rotated some
        this.normalRotation = {
            x: levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.rotation.x,
            y: levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.rotation.y,
            z: levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.rotation.z
        }
        this.aerialRotation = {
            x: levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.aerialRotation.x,
            y: levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.aerialRotation.y,
            z: levelConfig.EDITOR_UI_COMPONENT_SETTINGS.gateRingLabels.aerialRotation.z
        }
        this.rotationPresets = [this.normalRotation, this.aerialRotation]
        this.rotationPresetIndex = 0
        this.currentRotationPreset = this.rotationPresets[this.rotationPresetIndex]
        
        this.mainContainer.rotation.set(this.currentRotationPreset.x, this.currentRotationPreset.y, this.currentRotationPreset.z)

        this.isCountdownLabel = this.songBeat <= levelConfig.COUNTDOWN_BEATS
        if(this.isCountdownLabel)this.initCountdownLabel()
        else this.initBeatAndBarLabel()
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //----------------------------------------------------------------------------//
    }

    initBeatAndBarLabel = () => {
        //----------------------------------------------------------------------------//
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`BEAT LABELS~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //BG GEOMETRY
        this.backgroundGeometry = new THREE.PlaneGeometry(
            this.WIDTH, 
            this.HEIGHT 
        )
        //BORDER GEOMETRY
        this.borderGeometry = new THREE.EdgesGeometry(this.backgroundGeometry)
        //BG AND BORDER MESHES
        this.beatBackgroundMesh = new THREE.Mesh(this.backgroundGeometry, this.backgroundMaterial)
        this.beatBackgroundMesh.position.z = this.BACKGROUND_Z
        this.beatBackgroundMesh.layers.set(1)
        this.beatBorderMesh = new THREE.LineSegments(this.borderGeometry, this.borderMaterial)
        this.beatBorderMesh.position.z = this.BORDER_Z
        this.beatBorderMesh.layers.set(1)
        //BEAT LABEL TEXT
        this.beatText = createTextNode({
            text: `${this.songBeat}`,
            x: 0, y: 0, z: this.TEXT_Z,
            color: this.FONT_COLOR,
            fontSize: this.FONT_SIZE,
        })
        this.beatText.anchorX = 'center'
        this.beatText.anchorY = 'middle'    
        this.beatText.sync()   
        //ADD TO CONTAINER
        this.beatLabelsContainer.add(this.beatBackgroundMesh, this.beatBorderMesh, this.beatText)
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //----------------------------------------------------------------------------//

        
        //----------------------------------------------------------------------------//
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`BAR LABELS~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //BG AND BORDER MESHES
        this.barBackgroundMesh = new THREE.Mesh(this.backgroundGeometry, this.backgroundMaterial)
        this.barBackgroundMesh.position.z = this.BACKGROUND_Z
        this.barBackgroundMesh.layers.set(1)
        this.barBorderMesh = new THREE.LineSegments(this.borderGeometry, this.borderMaterial)
        this.barBorderMesh.position.z = this.BORDER_Z
        this.barBorderMesh.layers.set(1)
        //BAR LABEL TEXT
        this.barText = createTextNode({
            text: `${this.barNumber}`,
            x: 0, y: 0, z: this.TEXT_Z,
            color: this.FONT_COLOR,
            fontSize: this.FONT_SIZE
        })
        this.barText.anchorX = 'center'
        this.barText.anchorY = 'middle'   
        this.barText.sync() 

        //BAR LABELS REQUIRE SPECIAL POSITIONING
        this.barLabelsContainer.position.set(0, this.HEIGHT + .1, 0)
        
        //ADD TO GROUP
        this.barLabelsContainer.add(this.barBackgroundMesh, this.barBorderMesh, this.barText)
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //----------------------------------------------------------------------------//
        
        //add everything to main container
        this.mainContainer.add(this.beatLabelsContainer, this.barLabelsContainer)
    }

    initCountdownLabel = () => {
        //----------------------------------------------------------------------------//
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`COUNTDOWN LABELS~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //COUNTDOWN ONES NEED THEIR OWN GEOMETRIES
        this.countdownGeometry = new THREE.PlaneGeometry(
            this.WIDTH, 
            //these are rotated, so the height needs to be longer to dispalythe word 'COUNTDOWN'
            this.COUNTODNW_HEIGHT 
        )
        this.countdownBorderGeometry = new THREE.EdgesGeometry(this.countdownGeometry)
        //MESH
        this.countdownBackgroundMesh = new THREE.Mesh(this.countdownGeometry, this.backgroundMaterial)
        this.countdownBackgroundMesh.layers.set(1)
        this.countdownBorderMesh = new THREE.LineSegments(this.countdownBorderGeometry, this.borderMaterial)
        this.countdownBorderMesh.layers.set(1)

        //countdown labels bgand border need to be like...counter rotated??
        const countdownLabelCounterRotationZ = Math.PI/2
        this.countdownBackgroundMesh.rotation.z = countdownLabelCounterRotationZ
        this.countdownBorderMesh.rotation.z = countdownLabelCounterRotationZ

        //COUNTDOWN LABEL TEXT
        this.countdownText = createTextNode({
            text: 'COUNTDOWN',
            x: 0, y: 0, z:.03,
            color: this.FONT_COLOR,
            fontSize: this.FONT_SIZE
        })
        this.countdownText.anchorX = 'center'
        this.countdownText.anchorY = 'middle'  
        this.countdownText.sync() 

        //this little abritrary z offset looks nice for countdown labels
        this.countdownLabelContainer.position.x += this.COUNTODNW_HEIGHT/2
        
        //ADD TO GROUP
        this.countdownLabelContainer.add(this.countdownBackgroundMesh, this.countdownBorderMesh, this.countdownText)
        //add to main container
        this.mainContainer.add(this.countdownLabelContainer)
        //~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`~~*+`//
        //----------------------------------------------------------------------------//
    }

    setLabelOrientation = (cameraIndex) => {
        this.rotationPresetIndex = cameraIndex
        this.currentRotationPreset = this.rotationPresets[this.rotationPresetIndex]
        this.mainContainer.rotation.set(this.currentRotationPreset.x, this.currentRotationPreset.y, this.currentRotationPreset.z)
    }

    toggleVisibility = (visibility) => {
        this.mainContainer.visible = visibility
    }

    update = (currentTime) => {
        this.mainContainer.position.x = this.labelPosition.x
        this.mainContainer.position.y = this.labelPosition.y
        this.mainContainer.position.z = this.ring.mesh.position.z + .55
    }

    dispose = () => {
        //remove from group
        this.ringLabelsContainer.remove(this.mesh)
        //dispose shared materials
        this.backgroundMaterial.dispose()
        this.borderMaterial.dispose()

        if(!this.isCountdownLabel){
            this.backgroundGeometry.dispose()
            this.borderGeometry.dispose()
            this.beatText.dispose()
            this.barText.dispose()
        }
        else{
            this.countdownGeometry.dispose()
            this.countdownBorderGeometry.dispose()
            this.countdownText.dispose()
        }

    }
}