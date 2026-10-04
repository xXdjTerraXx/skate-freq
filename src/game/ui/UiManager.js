import * as THREE from 'three'
import { createTextNode } from '../../utils'
import { levelConfig } from '../../config'
import GameplayHUD from './GameplayHUD'
import AtmosphereHUD from './AtmosphereHUD'
import EditorSetupHUD from './EditorSetupHUD'
import EditorWriteHUD from './EditorWriteHUD'

//ok just for future reference the scene tree for ui looks like this:
//               ~main canvas element~
//                 _______|_______
//                |               |
//         ~gameplay scene~     ~ui scene~
//              |                    |
//            ....              ~ui main container~   <----**you r here**
//                           _________|___________
//                          |                     |
//              ~ui gameplay container~     ~ui editor container~    
//            _________|_________                   _________|_________
//           |                   |                 |                   |
//       ~gameplay HUD~   ~atmosphere HUD~     ~editorWriteHUD~     ~editorSetupHUD~

export default class UiManager{
    constructor(app){
        this.app = app

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'ui main container'

        this.mainContainerGameplay = new THREE.Group()
        this.mainContainerGameplay.name = 'ui gameplay container'

        this.mainContainerEditor = new THREE.Group()
        this.mainContainerEditor.name = 'ui editor container'

        this.gameplayHUD = new GameplayHUD(app, this.mainContainerGameplay)
        this.atmosphereHUD = new AtmosphereHUD(app, this.mainContainerGameplay)
        this.editorSetupHUD = new EditorSetupHUD(app, this.mainContainerEditor)
        this.editorWriteHUD = new EditorWriteHUD(app, this.mainContainerEditor)

        //whether gameplay ui or edit mode ui is displaying
        this.isInEditorMode = false
        
        this.editModeEnums = {SETUP: "SETUP", WRITE: "WRITE"}
        this.currentEditMode = this.editModeEnums.SETUP
    }

    init = () => {
        //init ui manager and sub ui classes
        this.gameplayHUD.init()
        this.atmosphereHUD.init()
        this.editorSetupHUD.init()
        this.editorWriteHUD.init()
        this.mainContainerGameplay.add(this.gameplayHUD.mainContainer, this.atmosphereHUD.mainContainer)
        this.mainContainerEditor.add(this.editorWriteHUD.mainContainer, this.editorSetupHUD.mainContainer)
        this.mainContainer.add(this.mainContainerGameplay, this.mainContainerEditor)
        //add ui main container to ui scene, which is inited as invisible. visibility 
        //toggled during state changes
        this.app.uiScene.add(this.mainContainer)
    }

    //toggles whether gameplay or editor ui is displaying
    toggleDisplayEditorUI = () => {
        this.isInEditorMode = !this.isInEditorMode

        this.mainContainerGameplay.visible = !this.isInEditorMode
        this.mainContainerEditor.visible = this.isInEditorMode
    }

    //this method toggles between editor SETUP mode and editor WRITE mode
    toggleEditorMode = () => {
        if(!this.isInEditorMode)return

        if(this.currentEditMode === this.editModeEnums.SETUP){
            this.currentEditMode = this.editModeEnums.WRITE
            this.editorSetupHUD.mainContainer.visible = false
            this.editorWriteHUD.mainContainer.visible = true
        }else if(this.currentEditMode === this.editModeEnums.WRITE){
            this.currentEditMode = this.editModeEnums.SETUP
            this.editorSetupHUD.mainContainer.visible = true
            this.editorWriteHUD.mainContainer.visible = false
        }
    }

    update = (deltaTime) => {
        this.gameplayHUD.update(deltaTime)
    }

    reset = () => {
        this.gameplayHUD.reset()
        this.atmosphereHUD.reset()
        this.editorSetupHUD.reset()
        this.editorWriteHUD.reset()
        this.isInEditorMode = false
        this.currentEditMode = this.editModeEnums.SETUP
    }
}