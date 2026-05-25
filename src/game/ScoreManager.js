import { levelConfig } from "../config"

export default class ScoreManager{
    constructor(app){
        this.app = app
        this.currentScore = 0
        this.currentCombo = 0
        this.maxCombo = 0
        //running tally of hits for display at end screen
        this.hitCounts = {
            PERFECT: 0,
            GOOD: 0,
            MISS: 0
        }
    }

    updateScore =  (hitScore) => {
        //get point value and increase currentScore
        const pointValue = levelConfig.TAP_NOTE_SCORE_DICT[hitScore]
        this.currentScore += pointValue
        
        //handle combo breaks on MISS.if combo is broken, the value ofcurrentScore 
        // is multiplied by currentCombo and that product is added to currentScore
        //before currentCombo is reset to 0. 
        if(hitScore == 'MISS'){
            this.currentScore += this.currentScore * this.currentCombo
            this.currentCombo = 0
        }
        else this.currentCombo++
        //update maxCombo
        if(this.currentCombo > this.maxCombo){
            this.maxCombo = this.currentCombo
        }
        //update hitCounts dict
        this.hitCounts[hitScore]++

        //aaanad finally...update UI
        this.app.ui.updateScore(this.currentScore, this.currentCombo)
    }

    resetAll = () => {
        this.currentScore = 0
        this.currentCombo = 0
        this.maxCombo = 0
        this.hitCounts.PERFECT = 0
        this.hitCounts.GOOD = 0
        this.hitCounts.MISS = 0
    }

    //returns finals score (score WITH bonus multiplier)
    getFinalScore = () => {
        const bonusMultiplier =  this.maxCombo / 5
        const finalScore = this.currentScore * bonusMultiplier
        return finalScore
    }
}