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
            MISS: 0,
            A: 0,
            S: 0,
            D: 0,
            LANDS: 0,
            BAIL: 0
        }
        this.health = levelConfig.PLAYER_STARTING_HEALTH
        this.uplink = levelConfig.PLAYER_STARTING_UPLINK
        this.surge = 0 // 0 - 4
        this.overclock = false
        this.currentGrindScore = null
        this.currentGrindMultiplier = null
    }

    updateScore =  (judgement) => {
        //get point value and increase currentScore
        let pointValue = levelConfig.JUDGEMENT_SCORE_DICT[judgement]

        //grinds are scored a little differently :3
        // if(this.grindMultiplier) pointValue = pointValue / 5 * this.grindMultiplier
        
        this.currentScore += pointValue
        
        //handle combo breaks on MISS.if combo is broken, the value ofcurrentScore 
        // is multiplied by currentCombo and that product is added to currentScore
        //before currentCombo is reset to 0. 
        if(judgement == levelConfig.JUDGEMENT_ENUMS.MISS || judgement == levelConfig.JUDGEMENT_ENUMS.BAIL){
            this.currentScore += this.currentScore * this.currentCombo
            this.currentCombo = 0
        }
        else this.currentCombo++
        //update maxCombo
        if(this.currentCombo > this.maxCombo){
            this.maxCombo = this.currentCombo
        }
        //update hitCounts dict
        this.hitCounts[judgement]++

        //aaanad finally...update UI
        this.app.ui.gameplayHUD.updateScore(this.currentScore, this.currentCombo)
    }

    updateHealth = (judgement) => {
        const changeInHealth = levelConfig.HIT_RATING_VALUES[judgement].health
        const changeInUplink = levelConfig.HIT_RATING_VALUES[judgement].uplink

        //update health here
        this.health += changeInHealth
        if(this.health>levelConfig.PLAYER_STARTING_HEALTH){
            this.health = levelConfig.PLAYER_STARTING_HEALTH
        }
        
        //update uplink here
        this.uplink += changeInUplink
        if(this.uplink > levelConfig.PLAYER_MAX_UPLINK){
            this.uplink = levelConfig.PLAYER_MAX_UPLINK
        }

        //aaanad finally...update UI
        this.app.ui.gameplayHUD.updateHealth(this.health)
        this.app.ui.gameplayHUD.updateUplink(this.uplink)
    }

    updateSurge = (currentSurgeObject, noteBeat) => {
        //check if last note in surge sequence
        if(currentSurgeObject.endBeat === noteBeat){
            console.log("SURGE INCREASED!! SURGE VALUE IS AT ", this.surge)
            this.surge++
            this.app.ui.gameplayHUD.surgeMeter.updateMeter(this.surge)
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

    updateGrind = (judgement) => {
        if(this.currentGrindScore === judgement) return
        //if release too early
        if(judgement === levelConfig.JUDGEMENT_ENUMS.BAIL){
            this.updateScore(judgement)
            this.currentGrindScore = null
            this.currentGrindMultiplier = null
            //update ui with null values to clear active grind ui
            this.app.ui.gameplayHUD.updateActiveGrind(
                this.currentGrindScore, this.currentGrindMultiplier
            )
        }
        //if grind successful full release
        else if(judgement === levelConfig.JUDGEMENT_ENUMS.RELEASE){
            this.updateScore(judgement)
        }
        //initial grind start
        else {
            if(!this.currentGrindScore){
                this.currentGrindScore = judgement
                this.currentGrindMultiplier = 1
                //update ui here
                this.app.ui.gameplayHUD.updateActiveGrind(
                    this.currentGrindScore, this.currentGrindMultiplier
                )
            }
        }
    }

    //this method gets called in level in its onBeatSixteenth call
    updateGrindMultiplier = () => {
        if(this.currentGrindScore)this.currentGrindMultiplier++
        //TODO: update ui here
        this.app.ui.gameplayHUD.updateActiveGrind(
            this.currentGrindScore, this.currentGrindMultiplier
        )
    }

    resetAll = () => {
        this.currentScore = 0
        this.currentCombo = 0
        this.maxCombo = 0
        this.hitCounts.PERFECT = 0
        this.hitCounts.GOOD = 0
        this.hitCounts.MISS = 0
        this.hitCounts.A = 0,
        this.hitCounts.S = 0,
        this.hitCounts.D = 0
        this.hitCounts.LANDS = 0
        this.hitCounts.BAIL = 0
        this.health = levelConfig.PLAYER_STARTING_HEALTH
        this.surge = 0 
        this.overclock = false
        this.currentGrindScore = null
        this.currentGrindMultiplier = null
    }

    //returns finals score (score WITH bonus multiplier)
    getFinalScore = () => {
        const bonusMultiplier =  this.maxCombo / 5
        const finalScore = this.currentScore * bonusMultiplier
        return finalScore
    }
}