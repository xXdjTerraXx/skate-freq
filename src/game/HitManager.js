import * as THREE from 'three'
import { levelConfig } from '../config'
import { createTextNode } from '../utils'

//decides which type of hit effect to spawn and which container to put
//it in. each hit effect is responsible for its own movement and deletion
//...basically like a particle manager
export default class HitManager{
    constructor(app){
        this.app = app

        //gets set by registerHit, updated in updateGrind, and removed in registerGrindRelease
        this.currentRail = null
    }

    init = (uiHitFxContainer, worldHitFxContainer) => {
        this.uiHitFxContainer = uiHitFxContainer
        this.worldHitFxContainer = worldHitFxContainer
    }

    registerHit = (noteNode, currentTime) => {

        let hitScore 

        //if player presses when no note
        if (!noteNode) {
            hitScore = 'MISS'
            // //update score and health
            // this.app.scoreManager.updateScore(hitScore)
            // this.app.scoreManager.updateHealth(hitScore)
            // //spawn hit effect text
            // this.app.ui.gameplayHUD.spawnHitEffect(hitScore, levelConfig.HIT_EFFECT_CATEGORY_ENUMS.NOTE)
            // //break surge panel streak if player is on one
            // if(this.app.surgeManager.surging){
            //     this.app.surgeManager.handleNoteHit(hitScore, noteNode.beat)
            // }
            return hitScore
        }

        //prevent double hitting
        if (noteNode.hit) {
            hitScore = levelConfig.JUDGEMENT_ENUMS.NULL
            return hitScore
        }

        //if this hit was a rail, store the rail to handle hold and release
        if(noteNode.noteNodeType === levelConfig.NOTE_NODE_TYPE.RAIL && hitScore !== levelConfig.JUDGEMENT_ENUMS.MISS){
            this.currentRail = noteNode
        }

        //if there is already a current rail that means it's a hold note
        if(this.curentRail){
            hitScore = levelConfig.JUDGEMENT_ENUMS.HOLD
            return hitScore
        }
        
        const timeUntilHit = (noteNode.time - currentTime)
        
        if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.PERFECT) {
            hitScore = levelConfig.JUDGEMENT_ENUMS.PERFECT
        } else if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.GOOD) {
            hitScore = levelConfig.JUDGEMENT_ENUMS.GOOD
        } else {
            hitScore = levelConfig.JUDGEMENT_ENUMS.MISS
        }
        //if player is surging, handle a surge section note
        // if(this.app.surgeManager.surging === true){
        //     this.app.surgeManager.handleNoteHit(hitScore, noteNode.beat)
        // }
        //spawn a hit effect
        // this.spawnHitEffect(hitScore, "ui")

        noteNode.handleOnHit()

        return hitScore
    }

    registerTrickHit = (trick, currentTime) => {
        let hitScore

        //this is all palceholder so no timing yet.
        //this is hacky until phase 3 when the full trick system will be added
        //trick currently is just a string: either "A", "S", or "D"

        hitScore = trick

        return hitScore
    }

    registerLandingHit = (currentTime, landingTime) => {
        let hitScore

        //just in case
        if(landingTime === null){
            hitScore = levelConfig.JUDGEMENT_ENUMS.NULL
            return hitScore
        }     

        const timeUntilHit = (landingTime - currentTime)
        if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.RESYNCED) {
            hitScore = levelConfig.JUDGEMENT_ENUMS.RESYNCED
        } 
        else hitScore = levelConfig.JUDGEMENT_ENUMS.SYNC_BROKEN

        return hitScore
    }

    updateGrind = (currentTime) => {
        //grind hold score gets updated here
        let hitScore 
        if(this.currentRail){
            hitScore = levelConfig.JUDGEMENT_ENUMS.HOLD
        }
        return { hitScore, rail: this.currentRail }
    }

    registerGrindRelease = (releaseTime) => {
        const RELEASE = levelConfig.JUDGEMENT_ENUMS.RELEASE

        let hitScore
        //****THERE IS A PROBLEM HERE WITH RELEASE TIME VS RAIL TIME CHECK****
        if(this.currentRail){
            //check if release was after rail end time
            const railFullTime = this.currentRail.time + this.currentRail.duration
            const absTime = releaseTime - railFullTime
            //first check for release before rail end
            if(releaseTime < railFullTime){
                hitScore = levelConfig.JUDGEMENT_ENUMS.BAIL
            }
            else if(absTime < levelConfig.NOTE_TIMING[RELEASE]){
                hitScore = levelConfig.JUDGEMENT_ENUMS.HOLD
            }
            else {
                hitScore = levelConfig.JUDGEMENT_ENUMS.BAIL
            } 
            const rail = this.currentRail
            this.currentRail = null
            return { hitScore, rail }
        }
    }

    //called from surge manager every frame player is on a surge panel
    setSurge = (isOnSurgePanel) => {
        this.playerIsOnSurgePanel= isOnSurgePanel
    }

    update = (deltaTime) => {
    
    }

    reset = () => {
        this.currentRail = null
        this.activeHits = []
    }
}
