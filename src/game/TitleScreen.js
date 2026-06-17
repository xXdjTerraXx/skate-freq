import * as THREE from 'three'
import { createTextNode } from '../utils'
import { levelConfig } from '../config'
export default class TitleScreen{
    constructor(app){
        this.app = app

        //basically an object with all the loaded assets needed for this screen
        this.titleScreenAssetsBundle = this.app.assetManager.loadedAssets.titleScreen
        //just the texture needed to the title image
        this.placeholderTitleTexture = this.titleScreenAssetsBundle.titleScreen1

        //the main container within the title screen
        this.mainContainer = new THREE.Group()
        this.mainContainer.label = 'title_main_container'

        //the container for title screen image
        this.titleContainer = new THREE.Group()
        this.titleContainer.label = 'title_container'

        //get the sprite ready
        this.titleMaterial = new THREE.SpriteMaterial({ map: this.placeholderTitleTexture })
        this.titleSprite = new THREE.Sprite(this.titleMaterial)
        //set sprite scale and position
        this.titleSprite.label = 'title_sprite'
        this.titleSprite.scale.set(4, 2, 1)
        this.titleSprite.position.set(0,0,0)
        this.titleSprite.layers.set(1)

        // press F to continue prompt 
        this.promptContainer = new THREE.Group()
        this.promptContainer.name = 'prompt_container'
        

        this.promptText = createTextNode({
            text: 'press F to continue',
            fontSize: .15,
            color: levelConfig.UI_COLOR_PALETTE.white,
            x: 0, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI
        })
        this.promptText.anchorX = 'center'
        this.promptText.name = 'prompt text'
        this.promptText.outlineWidth = '8%'
        this.promptText.outlineColor = 0x00ffff
        this.promptText.outlineOpacity = 0.4
        this.promptText.outlineBlur = '50%' // <-- this is the glow magic
        this.promptText.sync()
        

        this.promptContainer.position.set(0,-.5, 0)

        this.promptContainer.add(this.promptText)
        this.titleContainer.add(this.titleSprite)
        this.mainContainer.add(this.titleContainer, this.promptContainer)

        //this is for the pulsing of the 'press f to continue' text
        this.pulseTimeAccumulator = 0
    }

    update = (deltaTime) => {
        this.pulseTimeAccumulator += deltaTime
        const newGlowValue = Math.sin(this.pulseTimeAccumulator) + 1

        this.promptText.outlineBlur = `${newGlowValue * 50}%`
        // this.promptText.outlineOpacity = 0.3 + newGlowValue * 0.5
        this.promptText.sync()
    }
    
}