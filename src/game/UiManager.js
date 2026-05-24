import * as THREE from 'three'

export default class UiManager{
    constructor(app){
        this.app = app

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'ui container'

        //where the 'PERFECT', 'GOOD', etc effects live
        this.hitEffectsContainer = new THREE.Group()
        this.hitEffectsContainer.name = 'hit effect container'
        this.hitEffectsContainer.position.set(.5, .5, 0)

        //where score dispaly lives
        this.scoreContainer = new THREE.Group()
        this.scoreContainer.name = 'score container'
        this.scoreContainer.position.set(.1, .9, 0)

        /////TO DO --- figure out how to add text in three ///////
        this.scoreText = null                              ///////
        //////////////////////////////////////////////////////////
    }

    init = () => {
        this.mainContainer.add(this.hitEffectsContainer, this.scoreContainer)
    }

    updateScore = (newScore, newCombo) => {
        console.log(`score updated! new score is ${newScore} -- your combo is at ${newCombo}`)
        //-----TO DO------//
        //this.scoreText.content = newScore
    }
}