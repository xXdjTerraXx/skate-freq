import * as THREE from 'three'
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

        this.titleContainer.add(this.titleSprite)
        this.mainContainer.add(this.titleContainer)
    }

    
}