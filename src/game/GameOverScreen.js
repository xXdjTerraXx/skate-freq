import * as THREE from 'three'
import { createTextNode } from '../utils'
import { levelConfig } from '../config'

export default class GameOverScreen{
    constructor(app){
        this.app = app
        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'game over main container'
        this.mainContainer.position.set(0,0,0)

        this.gameOverText = createTextNode({
            text: 'TRANSMISSION FAILED',
            fontSize: 0.3,
            color: 0xffffff,
            x: -0.5 , y: 0.5, z: 0.5
        })


        this.promptText = createTextNode({
            text: 'press F to continue',
            fontSize: .15,
            color: levelConfig.UI_COLOR_PALETTE.white,
            x: 0, y: this.SCREEN_BOTTOM, z: 0
        })
        this.promptText.anchorX = 'center'
        

        this.mainContainer.add(this.gameOverText, this.promptText)
    }

    init = () => {
        //placeholder function for later basically
        console.log("initing game over screen...")
    }
    
}