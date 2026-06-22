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
        this.health = levelConfig.PLAYER_STARTING_HEALTH
        this.surge = 0 // 0 - 4
        this.overclock = false
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
        this.app.ui.gameplayHUD.updateScore(this.currentScore, this.currentCombo)
    }

    updateHealth = (hitRating) => {
        const changeInHealth = levelConfig.HIT_RATING_VALUES[hitRating]
        this.health += changeInHealth
        if(this.health>levelConfig.PLAYER_STARTING_HEALTH){
            this.health = levelConfig.PLAYER_STARTING_HEALTH
        }
        //aaanad finally...update UI
        this.app.ui.gameplayHUD.updateHealth(this.health)
    }

    updateSurge = (currentSurgeObject, noteBeat) => {
        //check if last note in surge sequence
        if(currentSurgeObject.endBeat === noteBeat){
            console.log("SURGE INCREASED!! SURGE VALUE IS AT ", this.surge)
            this.surge++
            this.app.surgeManager.handleSurgeSectionCompleted()
            //check if surge is full 
            if(this.surge === levelConfig.SURGE_LIMIT){
                this.overclock = true
                this.app.level.handleStartOverclock(currentSurgeObject)
                console.log("OVERCLOCK COMMENCING!!!!")
            }
        }

        /////DEBUG
        // this.overclock = true
        // this.app.level.startOverclock(currentSurgeObject)
        // console.log("OVERCLOCK COMMENCING!!!!")
    }

    resetAll = () => {
        this.currentScore = 0
        this.currentCombo = 0
        this.maxCombo = 0
        this.hitCounts.PERFECT = 0
        this.hitCounts.GOOD = 0
        this.hitCounts.MISS = 0
        this.health = levelConfig.PLAYER_STARTING_HEALTH
        this.surge = 0 
        this.overclock = false
    }

    //returns finals score (score WITH bonus multiplier)
    getFinalScore = () => {
        const bonusMultiplier =  this.maxCombo / 5
        const finalScore = this.currentScore * bonusMultiplier
        return finalScore
    }
}