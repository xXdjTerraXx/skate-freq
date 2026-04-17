import * as THREE from 'three'

export default class UiSpace{
    constructor(app){
        this.app = app

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'ui container'

        //where the 'PERFECT', 'GOOD', etc effects live
        this.hitEffectsContainer = new THREE.Group()
        this.hitEffectsContainer.name = 'hit effect container'
        this.hitEffectsContainer.position.set(.5, .5, 0)
    }

    init = () => {
        this.mainContainer.add(this.hitEffectsContainer)
    }
}