import * as THREE from 'three'
import { COLOR_PALETTE, levelConfig } from '../../../config'
import { createTextNode } from '../../../utils'

export default class BeatGridSelector{
    constructor(app, parentContainer, clickableMeshesArray, editorComponentsArray){
        this.app = app
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

        // this.app.levelEditor.setBeatSubdivision(this.currentBeatGridSelection)
    }

    //calls all the init methods for this component (there are multiple for this one!!)
    init = () => {

        //the container for all the parts of this component
        this.beatGridSelectorContainer = new THREE.Group()
        this.beatGridSelectorContainer.name = 'beat grid select container'
        this.beatGridSelectorContainer.position.set(
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.position.x, 
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.position.y,
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.position.z
        )

        this.buttonsContainer = new THREE.Group()
        this.buttonsContainer.name = 'beat grid buttons container'
        this.buttonsContainer.position.set(0,0,0)

        //the label for this component
        this.beatGridSelectorLabel = createTextNode({
            text: `BEAT GRID`, 
            fontSize:  this.MAIN_LABEL_FONT_SIZE,
            color:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.fontColor, 
            x: 0,
            y: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.beatGridSelectorContainer.size.height / 2), 
            z: 0,
            layers: 1
        })
        this.beatGridSelectorContainer.add(this.buttonsContainer, this.beatGridSelectorLabel)

        //build all the buttons 
        this.beatSubdivisionOptions.forEach((beatSubdivision, i) => {
            const newButton = new BeatGridButton(
                this.buttonsContainer, 
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
        //and finally, set the beat subdivision by means of app
        this.app.levelEditor.setBeatSubdivision(this.currentBeatGridSelection)
    }

    reset = () => {
        //reset state stuff
        this.currentBeatGridSelection = null
        this.currentBeatSubdivisionOptionsIndex = null
        //remove from parent container
        this.parentContainer.remove(this.beatGridSelectorContainer)
        //clean up alllll the geomtries and materials n stuff
        this.buttons.forEach(btn => {
            btn.noteButtonBackgroundGeometry.dispose()
            btn.noteButtonBackgroundMaterial.dispose()
            btn.noteButtonBorderGeometry.dispose()
            btn.noteButtonBorderMaterial.dispose()
            btn.noteTextNode.dispose()
        })
        //clear buttons array
        this.buttons.length = 0
    }
}

class BeatGridButton{
    constructor(buttonsContainer, beatSubdivision, index, handleButtonClick, isActive){
        this.buttonsContainer = buttonsContainer
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
            this.BACKGROUND_COLOR_UNAVAILABLE = 0x9c9c9c
            this.TEXT_COLOR_INACTIVE = 0xffffff
            this.TEXT_COLOR_ACTIVE = COLOR_PALETTE.black
            this.BORDER_COLOR = 0xffffff
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
        this.noteButtonBorderMaterial = new THREE.LineBasicMaterial({ color: this.BORDER_COLOR })
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
        this.buttonsContainer.add(this.noteButtonContainer)

        //call set colors fun at init bc one of the buttons begins as active
        this.setColors()
    }

    setColors = () => {
        console.log("setting background color....")
        this.noteTextNode.color = this.isActive ? this.TEXT_COLOR_ACTIVE : this.TEXT_COLOR_INACTIVE
        this.noteTextNode.sync()
        this.noteButtonBackgroundMaterial.color.set(this.isActive ? this.BACKGROUND_COLOR_ACTIVE : this.BACKGROUND_COLOR_INACTIVE)

        //TRIPLETS NOT IN YET, SO GREY OUT THE TRIPLET BTN
        if(this.beatSubdivision === 3){
            this.noteButtonBackgroundMaterial.color.set(this.BACKGROUND_COLOR_UNAVAILABLE)
             this.noteButtonBackgroundMaterial.opacity = .3
        }
    }

    onClick = () => {
        if(this.beatSubdivision === 3) return
        this.handleButtonClick(this.index)
    }
}