import * as THREE from 'three'
import { createTextNode } from '../../utils'
import { levelConfig } from '../../config'


export default class AtmosphereHUD{
    constructor(app, mainUiContainer){
        this.app = app
        this.mainUiContainer = mainUiContainer

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'atmosphere hud main container'
    }

    init = () => {
        
    }
}