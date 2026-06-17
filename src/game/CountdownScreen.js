import * as THREE from 'three'
import { createTextNode } from '../utils'
import { levelConfig } from '../config'

export default class CountdownScreen{
    constructor(app){
        this.app = app

        this.elapsedTime = 0
        this.lastNumber = 0
        this.newNumber = null

        //this is the switch to change from countdown to gameplay
        this.isFinished = false

        //these set during init
        this.bpm = null
        this.secondsPerBeat = null

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = "countdown main container"
        this.mainContainer.position.set(0,0,0)

        this.countdownNumbers = []
        this.countdownLength = 4
        //gets incremented and used to display an object in countdownNumbers array
        this.countdownTimerIndex = 0
    }

    init = (songBpm) => {
        this.bpm = songBpm
        this.secondsPerBeat = 60 / this.bpm
        this.elapsedTime = this.secondsPerBeat

        //populate the countdown array
        for(let i = this.countdownLength; i > 0; i--){
            const newCountdownNumber = new CountdownNumber(this.mainContainer, i)
            this.countdownNumbers.push(newCountdownNumber)
        }
    }

    reset = () => {
        this.isFinished = false
        this.elapsedTime = 0
        this.lastNumber = 0
        this.newNumber = null
        this.bpm = null
        this.secondsPerBeat = null
        this.countdownNumbers = []
        this.countdownTimerIndex = 0
        ///and remove the text nodes/countdown numbers from the arraay in this class
        while(this.mainContainer.children.length > 0){
            const child = this.mainContainer.children[0]
            this.mainContainer.remove(child)
        }
    }

    update = (deltaTime) => {

        this.elapsedTime += deltaTime

        const currentBeat = Math.floor(this.elapsedTime / this.secondsPerBeat)
        // const currentBeat = this.app.level.currentBeat

        // if(currentBeat > 0 && currentBeat < 5){
        if(currentBeat >= 0 && currentBeat <= 4){
            if(currentBeat !== this.lastNumber){
                this.lastNumber = currentBeat
                console.log("COUNTDOWN: ", currentBeat)
                console.log("LEVEL CURRENT BEAT: ", this.app.level.currentBeat)
                //increment the index
                if(this.countdownTimerIndex <= this.countdownLength)this.countdownTimerIndex++
                this.app.audioManager.playClick()
            }    
        } else{
            //end it on the fourth countdown number
            this.isFinished = true
            console.log("COUNTDOWN TIME UP")
            console.log("HEEEY KID IM A COMPUTER!!!: ", this.app.level.currentBeat)
            return
        }
        
        //display the countdown
        this.countdownNumbers[this.countdownTimerIndex-1].update(deltaTime)

    }
}

//literally just the big numbers that appear during the countdown
class CountdownNumber{
    constructor(parentContainer, countNumber){
        this.parentContainer = parentContainer
        //literally just what number in the countdown this represents
        this.countNumber = countNumber

        this.FONT_SIZE = .6
        this.MIN_SCALE = .8
        this.MAX_SCALE = 1.2
        this.COLOR = levelConfig.UI_COLOR_PALETTE.gold

        this.currentScale = this.MIN_SCALE
        this.targetScale = this.MAX_SCALE

        this.numberText = createTextNode({
            text: `${this.countNumber}`,
            fontSize: this.FONT_SIZE,
            color: this.COLOR,
            x:0, y:0, z: 0
        })
        this.numberText.scale.set(this.MIN_SCALE, this.MIN_SCALE, 1)
        this.numberText.visible = false

        this.parentContainer.add(this.numberText)

        //set to true after scaling max is reached
        this.isFinished = false
    }


    update = (deltaTime) => {
        const lerpFactor = 1 - Math.pow(0.001, deltaTime)
        if(this.currentScale < this.targetScale - .05){
            this.numberText.visible = true
            this.currentScale += (this.targetScale - this.currentScale) * lerpFactor
            this.numberText.scale.set(this.currentScale, this.currentScale, 1)
            return
        }
        else{
            this.isFinished = true
            this.numberText.visible = false
        }
    }
}