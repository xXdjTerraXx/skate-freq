import * as THREE from 'three'
import { COLOR_PALETTE, levelConfig } from '../../../config'
import { createTextNode } from '../../../utils'

export default class BeatGridSelector{
    constructor(parentContainer, clickableMeshesArray, editorComponentsArray){
        this.parentContainer = parentContainer
        this.clickableMeshesArray = clickableMeshesArray
        this.editorComponentsArray = editorComponentsArray

        //CONSTANTS
        this.PADDING_MAIN = 5  //padding for main container just in case
        this.MAIN_LABEL_FONT_SIZE = 30

        //holds all the buttons after init
        this.buttons = []

        //state stuff for this component
        //[1, 2, 3, 4]
        this.beatSubdivisionOptions = levelConfig.EDITOR_BEAT_SUBDIVISION_OPTIONS
        //default to quarter note
        this.currentBeatSubdivisionOptionsIndex = 0
        this.currentBeatGridSelection = this.beatSubdivisionOptions[this.currentBeatSubdivisionOptionsIndex]

    }

    //calls all the init methods for this component (there are multiple for this one!!)
    init = () => {

        //the container for all the parts of the load song button
        this.beatGridSelectorContainer = new THREE.Group()
        this.beatGridSelectorContainer.name = 'beat grid select container'
        this.beatGridSelectorContainer.position.set(
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.position.x, 
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.position.y,
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.position.z
        )

        //the label for this component
        this.beatGridSelectorLabel = createTextNode({
            text: `BEAT GRID`, 
            fontSize:  this.MAIN_LABEL_FONT_SIZE,
            color:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.fontColor, 
            x: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.size.width / 2),
            y: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.size.height / 2), 
            z: 0,
            layers: 1
        })
        this.beatGridSelectorContainer.add(this.beatGridSelectorLabel)

        //build all the buttons
        this.beatSubdivisionOptions.forEach((beatSubdivision, i) => {
            const newButton = new BeatGridButton(
                this.beatGridSelectorContainer, 
                beatSubdivision, 
                i, 
                this.handleButtonClick,
                this.currentBeatSubdivisionOptionsIndex === i
            )
            newButton.init()
            this.buttons.push(newButton)
            //push buttons to clickableMEshes
            this.clickableMeshesArray.push(newButton.noteButtonBackgroundMesh)
        })

        //add to main editor ui container
        this.parentContainer.add(this.beatGridSelectorContainer)
        //store in array that lives in EditorWriteHUD
        this.editorComponentsArray.push(this)
    }

    // initButton = (beatSubdivision, index) => {
    //     const noteButtonContainer = new THREE.Group()
    //     noteButtonContainer.name = `${beatSubdivision} note button container`
    //     noteButtonContainer.position.set(
    //         this.BUTTON_WIDTH*index,0,0
    //     )

    //     const noteButtonBackgroundGeometry = new THREE.PlaneGeometry(
    //         this.BUTTON_WIDTH, 
    //         this.BUTTON_HEIGHT
    //     )
    //     const noteButtonBackgroundMaterial = new THREE.MeshPhysicalMaterial({
    //         color: 0xffffff,
    //         transmission: 0.85,  
    //         roughness: 0.15,      
    //         metalness: 0.0,
    //         thickness: 0.1,
    //         transparent: true,
    //         depthWrite: false,
    //         side: THREE.FrontSide
    //     })
    //     const noteButtonBackgroundMesh = new THREE.Mesh(noteButtonBackgroundGeometry, noteButtonBackgroundMaterial)
    //     noteButtonBackgroundMesh.layers.set(1)

    //     //add mesh to clickableMeshes and update userData obj
    //     noteButtonBackgroundMesh.userData.component = this
    //     noteButtonBackgroundMesh.userData.beatSubdivision = beatSubdivision
    //     noteButtonBackgroundMesh.userData.index = index
    //     this.clickableMeshesArray.push(noteButtonBackgroundMesh)

    //     const noteButtonBorderGeometry = new THREE.EdgesGeometry(noteButtonBackgroundGeometry)
    //     const noteButtonBorderMaterial = new THREE.LineBasicMaterial({ color: this.BORDER_COLOR_INACTIVE })
    //     const noteButtonBorderMesh = new THREE.LineSegments(noteButtonBorderGeometry, noteButtonBorderMaterial)
    //     noteButtonBorderMesh.position.z = 0.02
    //     noteButtonBorderMesh.layers.set(1)

    //     let beatSubdivisionString
    //     switch (beatSubdivision) {
    //         case 1:
    //             beatSubdivisionString = '1/4'
    //             break;
    //         case 2:
    //             beatSubdivisionString = '1/8'
    //             break;
    //         case 3:
    //             beatSubdivisionString = '1/3'
    //             break;
    //         case 4:
    //             beatSubdivisionString = '1/16'
    //             break;
    //         default:
    //             break;
    //     }
    //     const noteTextNode = createTextNode({
    //         text: `${beatSubdivisionString}`, 
    //         fontSize:  this.BUTTON_FONT_SIZE, 
    //         color:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.fontColor, 
    //         x: -this.BUTTON_WIDTH/2,
    //         y: 0, 
    //         z: 0,
    //         layers: 1
    //     })
    //     noteButtonContainer.add(noteButtonBackgroundMesh, noteButtonBorderMesh, noteTextNode)

    //     //push to buttons array
    //     this.buttons.push({
    //         subdivision: beatSubdivision,
    //         container: noteButtonContainer,
    //         borderMaterial: noteButtonBorderMaterial
    //     })
    // }

    handleButtonClick = (index) => {
        //set the new selection state
        this.currentBeatSubdivisionOptionsIndex = index
        this.currentBeatGridSelection = this.beatSubdivisionOptions[this.currentBeatSubdivisionOptionsIndex]
        //handle setting the clicked button to actuve
        this.buttons.forEach((btn, i) => {
            if(i === index)btn.isActive = true
            else btn.isActive = false
            btn.setColors()
        })
        console.log("DEBUG  ", this.buttons)
    }



    reset = () => {
        this.currentBeatGridSelection = null
        this.currentBeatSubdivisionOptionsIndex = null
        // this.currentBPM = null
        // this.currentBpmString = "---"
        // this.currentBpmTextNode.text = this.currentBpmString
        // this.currentBpmTextNode.sync()
    }
}

class BeatGridButton{
    constructor(beatGridSelectorContainer, beatSubdivision, index, handleButtonClick, isActive){
        this.beatGridSelectorContainer = beatGridSelectorContainer
        this.beatSubdivision = beatSubdivision
        this.index = index
        this.handleButtonClick = handleButtonClick
        this.isActive = isActive
        
        switch (beatSubdivision) {
            case 1:
                this.beatSubdivisionString = '1/4'
                break;
            case 2:
                this.beatSubdivisionString = '1/8'
                break;
            case 3:
                this.beatSubdivisionString = '1/3'
                break;
            case 4:
                this.beatSubdivisionString = '1/16'
                break;
            default:
                break;
        }

        //constants
            this.PADDING_BUTTON = 5 
            this.BUTTON_HEIGHT = 50
            this.BUTTON_WIDTH = 70
            this.BUTTON_FONT_SIZE = 20
            this.BACKGROUND_COLOR_INACTIVE = COLOR_PALETTE.black
            this.BACKGROUND_COLOR_ACTIVE = COLOR_PALETTE.green
            this.TEXT_COLOR_INACTIVE = 0xffffff
            this.TEXT_COLOR_ACTIVE = COLOR_PALETTE.black
    }

    init = () => {
        this.noteButtonContainer = new THREE.Group()
        this.noteButtonContainer.name = `${this.beatSubdivision} note button container`
        this.noteButtonContainer.position.set(
            this.BUTTON_WIDTH*this.index,0,0
        )

        this.noteButtonBackgroundGeometry = new THREE.PlaneGeometry(
            this.BUTTON_WIDTH, 
            this.BUTTON_HEIGHT
        )
        this.noteButtonBackgroundMaterial = new THREE.MeshBasicMaterial({
            color: this.BACKGROUND_COLOR_INACTIVE,
        })
        this.noteButtonBackgroundMesh = new THREE.Mesh(this.noteButtonBackgroundGeometry, this.noteButtonBackgroundMaterial)
        this.noteButtonBackgroundMesh.layers.set(1)

        //add mesh to clickableMeshes and update userData obj
        this.noteButtonBackgroundMesh.userData.component = this
        this.noteButtonBackgroundMesh.userData.beatSubdivision = this.beatSubdivision
        this.noteButtonBackgroundMesh.userData.index = this.index

        this.noteButtonBorderGeometry = new THREE.EdgesGeometry(this.noteButtonBackgroundGeometry)
        this.noteButtonBorderMaterial = new THREE.LineBasicMaterial({ color: this.BORDER_COLOR_INACTIVE })
        this.noteButtonBorderMesh = new THREE.LineSegments(this.noteButtonBorderGeometry, this.noteButtonBorderMaterial)
        this.noteButtonBorderMesh.position.z = 0.02
        this.noteButtonBorderMesh.layers.set(1)

        this.noteTextNode = createTextNode({
            text: `${this.beatSubdivisionString}`, 
            fontSize:  this.BUTTON_FONT_SIZE, 
            color:  this.TEXT_COLOR_INACTIVE, 
            x: -this.BUTTON_WIDTH/2,
            y: 0, 
            z: 0,
            layers: 1
        })
        this.noteButtonContainer.add(this.noteButtonBackgroundMesh, this.noteButtonBorderMesh, this.noteTextNode)
        this.beatGridSelectorContainer.add(this.noteButtonContainer)

        this.setColors()
    }

    setColors = () => {
        console.log("setting background color....")
        this.noteTextNode.color = this.isActive ? this.TEXT_COLOR_ACTIVE : this.TEXT_COLOR_INACTIVE
        this.noteTextNode.sync()
        this.noteButtonBackgroundMaterial.color.set(this.isActive ? this.BACKGROUND_COLOR_ACTIVE : this.BACKGROUND_COLOR_INACTIVE)
    }

    onClick = () => {
        this.handleButtonClick(this.index)
    }
}