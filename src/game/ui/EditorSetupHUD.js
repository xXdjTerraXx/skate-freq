import * as THREE from 'three'
import { createTextNode } from '../../utils'
import { levelConfig } from '../../config'
import BPMInput from './components/BPMInput'
import LoadSongButton from './components/LoadSongButton'
import GenericButton from './components/GenericButton'


//A NOTE TO FUTURE ME(bc i know ill forget):
//all the editor sub components (at least here in the setup class) are using this pattern
//that's kind of odd...basically, during each component's init call, the class itself is assigned
//to the background mesh's userData object (that basically exists for user utility). and
//that's how the handleClick functions are called

export default class EditorSetupHUD{
    constructor(app, mainUiContainer){
        this.app = app
        this.mainUiContainer = mainUiContainer

        //set to true when user picks a file, sets bpm, and clicks the ok btn
        this.setupComplete = false

        //basically an object with all the loaded assets needed for this screen
        this.editorScreenAssetBundle = this.app.assetManager.loadedAssets.editorScreen

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'editor setup hud main container'
        this.mainContainer.visible = true

        this.raycaster = new THREE.Raycaster()
        this.raycaster.layers.set(1)
        //holds the mouse click coords during click events for checking
        this.mouseCoords = new THREE.Vector2()

        //keeps a reference to every clickable component's clickable mesh. passed to
        //each component and added there during its init
        this.clickableMeshes = []

        //an array for all the components in the editorHUD
        this.childComponents = []

        this.bpmInput = new BPMInput(this.mainContainer, this.clickableMeshes, this.childComponents)
        this.loadSongButton = new LoadSongButton(this.mainContainer, this.clickableMeshes, this.childComponents, this.editorScreenAssetBundle)
        this.okButton = new GenericButton(this.mainContainer, this.clickableMeshes, this.childComponents, levelConfig.EDITOR_UI_COMPONENT_SETTINGS.setupOkButton.position, levelConfig.EDITOR_UI_COMPONENT_SETTINGS.setupOkButton.bgColor, levelConfig.EDITOR_UI_COMPONENT_SETTINGS.setupOkButton.borderColor, levelConfig.EDITOR_UI_COMPONENT_SETTINGS.setupOkButton.fontColor, "Ok")
    }

    init = () => {
        //init individual ui components:
        this.loadSongButton.init()
        this.bpmInput.init()
        this.okButton.init(this.handleOkButtonClick)
    }

    handleOkButtonClick = async () => {
        //check for both 1)user chosen a file and 2)valid bpm entry
        const fileIsPicked = this.loadSongButton.songIsLoaded
        const bpmIsValid = this.bpmInput.checkValidBPM()
        if(fileIsPicked && bpmIsValid){
            console.log("CLICKED OK BUTTON:  SUCCESS")
            const result = await this.app.audioManager.loadAndSelectCustomSong(
                this.loadSongButton.fileURL, this.bpmInput.currentBPM
            )
            console.log("SETUP COMPLETE---LOADED CUSTOM SONG. RESULT: ", result)
            //set setupComplete to true
            this.setupComplete = true
        }
        else return
    }

    handleClick = (e) => {

        const canvasBoundingRect = this.app.renderer.domElement.getBoundingClientRect()
        //normalize mouse position from click to -1, 1
        const normalizedX =(e.clientX - canvasBoundingRect.left) / canvasBoundingRect.width
        //same for y
        const normalizedY = (e.clientY - canvasBoundingRect.top) / canvasBoundingRect.height

        //store values - y has to be flipped bc of diff coord systems between dom and three.js
        this.mouseCoords.set(normalizedX * 2 - 1, -(normalizedY * 2 - 1))

        this.raycaster.setFromCamera(this.mouseCoords, this.app.uiCamera)

        //intersectedObjects returns an array of intersections
        const intersections = this.raycaster.intersectObjects(this.clickableMeshes)
        //now check if there are intersections and if so, call that one's onClick func
        //able to do that bc the reference to the class is stored in object.userData!
        if(intersections.length > 0){
            intersections[0].object.userData.component.onClick()
        }
        //aaaand handle off clicks
        else{
            //bpm input off click sets/saves the bpm 
            if(this.bpmInput.isActive){
                this.bpmInput.toggleActive()
                if(this.bpmInput.currentBpmString === ""){
                    this.bpmInput.reset()
                    return
                }
                if(this.bpmInput.checkValidBPM() === true){
                    this.setCurrentBPM()
                }
            }
        }
    }

    handleKeyDown = (e) => {
        //handle keys for bpm input
        if(this.bpmInput.isActive){
            this.bpmInput.handleKeyInput(e.key)
        }
    }

    update = (deltaTime) => {

    }

    reset = () => {
        this.mainContainer.visible = true
        //first reset all the components
        this.childComponents.forEach(component => {
            if(component.reset)component.reset()
        })
        //then reset all the stuff here in the manager
        this.clickableMeshes.length = 0
        this.childComponents.length = 0
        this.mouseCoords = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.raycaster.layers.set(1)
        this.setupComplete = false
    }
}