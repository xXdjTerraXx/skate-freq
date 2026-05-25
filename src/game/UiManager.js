import * as THREE from 'three'
import { Text } from 'troika-three-text'

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

        /////TO DO --- figure out how to add text///////
        this.scoreText = new Text() 
        this.scoreText.label = 'score text'  
        this.scoreText.font = '/assets/fonts/OCRAEXT.TTF'
        this.scoreText.fontSize = 0.2
        this.scoreText.color = 0xffffff
        this.scoreText.position.set(0,0,0)
        this.scoreText.text = ''
        this.scoreText.sync()

        this.comboText = new Text()  
        this.comboText.label = 'combo text'
        this.comboText.font = '/assets/fonts/OCRAEXT.TTF'
        this.comboText.fontSize = 0.2
        this.comboText.color = 0xffffff  
        this.comboText.position.set(0.5,0,0) 
        this.comboText.text = ''
        this.comboText.sync()
        
        this.scoreContainer.add(this.scoreText, this.comboText)        
    }

    init = () => {
        this.mainContainer.add(this.hitEffectsContainer, this.scoreContainer)
    }

    updateScore = (newScore, newCombo) => {
        // console.log(`score updated! new score is ${newScore} -- your combo is at ${newCombo}`)
        //quirk of this text library - u have to call sync when changing any text
        this.scoreText.text = `${newScore}`
        this.scoreText.sync()
        this.comboText.text = `x${newCombo}`
        this.comboText.sync()
    }

    resetScoreAndComboText = () => {
        this.scoreText.text = ''
        this.scoreText.sync()
        this.comboText.text = ''
        this.comboText.sync()
    }
}