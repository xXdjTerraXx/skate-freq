import * as THREE from 'three'
import { createTextNode } from '../../utils'
import { levelConfig } from '../../config'
import GameplayHUD from './GameplayHUD'
import AtmosphereHUD from './AtmosphereHUD'


export default class UiManager{
    constructor(app){
        this.app = app

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'ui main container'

        this.gameplayHUD = new GameplayHUD(app, this.mainContainer)
        this.atmosphereHUD = new AtmosphereHUD(app, this.mainContainer)

    }

    init = () => {
        //init ui manager and sub ui classes
        this.gameplayHUD.init()
        this.atmosphereHUD.init()
        this.mainContainer.add(this.gameplayHUD.mainContainer, this.atmosphereHUD.mainContainer)
        //add ui main container to ui scene, which is inited as invisible. visibility 
        //toggled during state changes
        this.app.uiScene.add(this.mainContainer)
    }

    update = (deltaTime) => {
        this.gameplayHUD.update(deltaTime)
    }

    reset = () => {
        this.gameplayHUD.reset()
        this.atmosphereHUD.reset()
    }
}