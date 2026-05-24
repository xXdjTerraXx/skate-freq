import { levelConfig } from "../config"

export default class ScoreManager{
    constructor(app){
        this.app = app
        this.currentScore = 0
        this.currentCombo = 0
        //running tally of hits for display at end screen
        this.hitCounts = {
            PERFECT: 0,
            GOOD: 0,
            MISS: 0
        }
    }

    updateScore =  (hitScore) => {
        //combo break
        if(hitScore == 'MISS'){
            this.currentCombo = 0
        }
        const pointValue = levelConfig.TAP_NOTE_SCORE_DICT[hitScore]
        this.currentScore += pointValue
        this.currentCombo++
        this.hitCounts[hitScore]++
        this.app.ui.updateScore(this.currentScore, this.currentCombo)
    }

    resetScore = () => {
        this.currentScore = 0
    }
}