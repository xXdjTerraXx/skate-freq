import { levelConfig } from "../config"
import ENUMS from "../enums"

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
            BAIL: 0,
            RELEASE: 0,
            HOLD: 0
        }
        this.uplink = levelConfig.PLAYER_STARTING_UPLINK
        this.surge = 0 // 0 - 4
        this.overclock = false
        this.currentGrindJudgement = null
        this.currentGrindMultiplier = null
        this.currentGrindScore = 0
    }

    updateScore =  (judgement, isGrind = false) => {
        
        //update hitCounts dict
        this.hitCounts[judgement]++

        const hitEffectCategory = levelConfig.JUDGEMENT_CATEGORY_MAP[judgement]
        //SCORE
        //get point value and increase currentScore
        let pointValue

        //if there is an active grind hold, update current grind
        if(this.currentGrindJudgement){
            if(judgement === ENUMS.JUDGEMENT.BAIL) this.currentGrindScore = 0
            //add score for whole grind to currentScore if this is a release
            else{
                pointValue = levelConfig.JUDGEMENT_SCORE_DICT[this.currentGrindJudgement]
                this.currentGrindScore = this.currentGrindMultiplier * pointValue
                // if(judgement === ENUMS.JUDGEMENT.HOLD)return
                if(judgement === ENUMS.JUDGEMENT.RELEASE || judgement === ENUMS.JUDGEMENT.NEURO) this.currentScore += this.currentGrindScore
            }
        }
        //else for non-grinds just add judgement point value to currentScore
        else{
            if(hitEffectCategory === ENUMS.HIT_EFFECT_CATEGORY.GRIND)this.currentGrindScore = pointValue
            pointValue = levelConfig.JUDGEMENT_SCORE_DICT[judgement]
            this.currentScore += pointValue
        }
        
        //COMBO STUFF
        //handle combo breaks on MISS or SYNC_BROKEN. if combo is broken, the value ofcurrentScore 
        // is multiplied by currentCombo and that product is added to currentScore
        //before currentCombo is reset to 0. 
        if(judgement == levelConfig.JUDGEMENT_ENUMS.MISS || judgement == levelConfig.JUDGEMENT_ENUMS.SYNC_BROKEN){
            this.currentScore += this.currentScore * this.currentCombo
            this.currentCombo = 0
        }
        else this.currentCombo++
        //update maxCombo
        if(this.currentCombo > this.maxCombo){
            this.maxCombo = this.currentCombo
        }

        //UPLINK
        //and update uplink (health bar)
        this.updateUplink(judgement)

        //UI
        //aaanad finally...update UI
        //holds dont need a hit effect spawned
        if(!isGrind){
            this.app.ui.gameplayHUD.spawnHitEffect(judgement, hitEffectCategory)
        }
        this.app.ui.gameplayHUD.updateScore(this.currentScore, this.currentCombo)
    }

    updateUplink = (judgement) => {
        const changeInUplink = levelConfig.HIT_RATING_VALUES[judgement].uplink
        
        //update uplink here
        this.uplink += changeInUplink
        if(this.uplink > levelConfig.PLAYER_MAX_UPLINK){
            this.uplink = levelConfig.PLAYER_MAX_UPLINK
        }

        //aaanad finally...update UI
        this.app.ui.gameplayHUD.updateUplink(this.uplink)
    }

    updateSurge = (currentSurgeObject, noteBeat) => {
        //check if last note in surge sequence
        if(currentSurgeObject.endBeat === noteBeat){
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
    }

    //called when the grind begins and when the grind is released from Controller
    updateGrind = (judgement) => {
        
        const { RELEASE, NEURO } = ENUMS.JUDGEMENT

        // if(this.currentGrindJudgement === judgement) return
        //if release too early
        if(judgement === RELEASE){
            this.updateScore(judgement, true)

            this.app.ui.gameplayHUD.endActiveGrind(judgement)
            this.currentGrindJudgement = null
            this.currentGrindMultiplier = null
            this.currentGrindScore = 0
        }
        //if grind successful full release
        else if(judgement === NEURO){
            this.updateScore(judgement, true)
            this.app.ui.gameplayHUD.endActiveGrind(judgement)
            //reset currentGrind info
            this.currentGrindJudgement = null
            this.currentGrindMultiplier = null
            this.currentGrindScore = 0
        }
        //if initial grind start, set currentGrindJudgement and call updateActiveGrind
        //so that ui can spawn 
        else {
            if(!this.currentGrindJudgement){
                this.currentGrindJudgement = judgement
                this.currentGrindMultiplier = 1
                //update score calculates the new grind score with abot values
                this.updateScore(judgement, true)
                //then update ui w new grind score here
                this.app.ui.gameplayHUD.startActiveGrind(this.currentGrindScore, judgement)
            }
        }
    }


    //this method gets called in level in its onBeatSixteenth call if player is grinding
    onBeatSixteenth = () => {
        if(this.currentGrindJudgement){
            this.currentGrindMultiplier++
            const judgement = ENUMS.JUDGEMENT.HOLD
            //calculate and updates the new grind score
            this.updateScore(judgement, true)
            this.app.ui.gameplayHUD.updateActiveGrind(this.currentGrindScore, judgement)
        }
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
        this.hitCounts.RELEASE = 0
        this.hitCounts.HOLD = 0
        this.uplink = levelConfig.PLAYER_STARTING_UPLINK
        this.surge = 0 
        this.overclock = false
        this.currentGrindJudgement = null
        this.currentGrindMultiplier = null
        this.currentGrindScore = 0
    }

    //returns finals score (score WITH bonus multiplier)
    getFinalScore = () => {
        const bonusMultiplier =  this.maxCombo / 5
        const finalScore = this.currentScore * bonusMultiplier
        return finalScore
    }
}