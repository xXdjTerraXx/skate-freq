import * as THREE from 'three'
import { levelConfig } from '../config'
import { createTextNode } from '../utils'
import ENUMS from '../enums'

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

    // registerHit = (noteNode, currentTime) => {
    //     const { NULL, HOLD, PERFECT, GOOD, MISS } = ENUMS.JUDGEMENT
    //     let hitScore 

    //     //if player presses when no note
    //     if (!noteNode) {
    //         hitScore = NULL
    //         return hitScore
    //     }

    //     //prevent double hitting
    //     if (noteNode.hit) {
    //         hitScore = NULL
    //         return hitScore
    //     }


    //     //if there is already a current rail that means it's a hold note
    //     if(this.currentRail){
    //         hitScore = HOLD
    //         return hitScore
    //     }
        
    //     const timeUntilHit = (noteNode.time - currentTime)
        
    //     if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.PERFECT) {
    //         hitScore = PERFECT
    //     } else if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.GOOD) {
    //         hitScore = GOOD
    //     } else {
    //        if(noteNode.noteNodeType === ENUMS.NOTE_NODE_TYPE.RAIL) {
    //             hitScore = HOLD
    //         }
    //         else hitScore = MISS
    //     }
         
    //     //if this hit was a rail, store the rail to handle hold and release
    //     if(noteNode.noteNodeType === levelConfig.NOTE_NODE_TYPE.RAIL && hitScore !== MISS){
    //         this.currentRail = noteNode
    //     }

    //     noteNode.handleOnHit()

    //     return hitScore
    // }

    registerHit = (noteNode, currentTime) => {
    const { NULL, HOLD, PERFECT, GOOD, MISS } = ENUMS.JUDGEMENT
    let hitScore 

    if (!noteNode) {
        hitScore = NULL
        return hitScore
    }

    if (noteNode.hit) {
        hitScore = NULL
        return hitScore
    }

    //only short-circuit to HOLD if THIS note is a rail and we're already grinding one
    if(this.currentRail && noteNode.noteNodeType === ENUMS.NOTE_NODE_TYPE.RAIL){
        hitScore = HOLD
        return hitScore
    }
    
    const timeUntilHit = (noteNode.time - currentTime)
    
    if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.PERFECT) {
        hitScore = PERFECT
    } else if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.GOOD) {
        hitScore = GOOD
    } else {
       if(noteNode.noteNodeType === ENUMS.NOTE_NODE_TYPE.RAIL) {
            hitScore = HOLD
        }
        else hitScore = MISS
    }
     
    if(noteNode.noteNodeType === levelConfig.NOTE_NODE_TYPE.RAIL && hitScore !== MISS){
        this.currentRail = noteNode
    }

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

        // //just in case
        // if(landingTime === null){
        //     hitScore = levelConfig.JUDGEMENT_ENUMS.NULL
        //     return hitScore
        // }     

        // const timeUntilHit = (landingTime - currentTime)
        // if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.RESYNCED) {
        //     hitScore = levelConfig.JUDGEMENT_ENUMS.RESYNCED
        // } 
        // else hitScore = levelConfig.JUDGEMENT_ENUMS.SYNC_BROKEN

        //CURRENTLY DEBUGGING WITH ONLY RESYNCED - NO TIMING CHECK FOR DEV ATM
        hitScore = ENUMS.JUDGEMENT.RESYNCED
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
        const { RELEASE, NEURO } = ENUMS.JUDGEMENT

        let hitScore
        
        if(this.currentRail){
            //check if release was after rail end time
            const railEndTime = this.currentRail.time + this.currentRail.durationInSeconds
            const absTime = Math.abs(releaseTime - railEndTime)
            if(absTime < levelConfig.NOTE_TIMING[NEURO]){
                 // on time within window
                hitScore = NEURO 
            } else {
                hitScore = RELEASE  
            }
            const rail = this.currentRail
            this.currentRail = null
            return { hitScore, rail }
        }  
        else {
            console.error("currentRail is null or false or some shit in hit manager registerGrindRelease")
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
