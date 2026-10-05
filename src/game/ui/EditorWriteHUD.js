import * as THREE from 'three'
import { createTextNode } from '../../utils'
import { levelConfig } from '../../config'
import BPMInput from './components/BPMInput'
import LoadSongButton from './components/LoadSongButton'
import BeatGridSelector from './components/BeatGridSelector'


export default class EditorWriteHUD{
    constructor(app, mainUiContainer){
        this.app = app
        this.mainUiContainer = mainUiContainer

        //basically an object with all the loaded assets needed for this screen
        this.editorScreenAssetBundle = this.app.assetManager.loadedAssets.editorScreen

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'editor write hud main container'
        this.mainContainer.visible = false

        this.raycaster = new THREE.Raycaster()
        this.raycaster.layers.set(1)
        //holds the mouse click coords during click events for checking
        this.mouseCoords = new THREE.Vector2()

        //keeps a reference to every clickable component's clickable mesh. passed to
        //each component and added there during its init
        this.clickableMeshes = []

        //an array for all the components in the editorHUD
        this.childComponents = []

        this.beatGridSelector = new BeatGridSelector(this.app, this.mainContainer, this.clickableMeshes, this.childComponents)
    }

    init = () => {
        //init individual ui components:
        this.beatGridSelector.init()
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
            
        }
    }

    getCurrentBeatSubdivision = () => {
        return this.beatGridSelector.currentBeatGridSelection
    }

    handleKeyDown = (e) => {
        
    }

    update = (deltaTime) => {

    }

    reset = () => {
        //remember, write hud starts INvisible!! setup hud starts VISIBLE
        this.mainContainer.visible = false
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
    }
}