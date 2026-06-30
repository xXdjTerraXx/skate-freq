import * as THREE from 'three'
import { levelConfig } from '../config'
import { createTextNode } from '../utils'

//decides which type of hit effect to spawn and which container to put
//it in. each hit effect is responsible for its own movement and deletion
//...basically like a particle manager
export default class HitManager{
    constructor(app){
        this.app = app

        this.activeHits = []
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
            //update score and health
            this.app.scoreManager.updateScore(hitScore)
            this.app.scoreManager.updateHealth(hitScore)
            //spawn hit effect text
            this.spawnHitEffect(hitScore, "ui")
            //break surge panel streak if player is on one
            if(this.app.surgeManager.surging){
                this.app.surgeManager.handleNoteHit(hitScore, noteNode.beat)
            }
            return
        }

        //prevent double hitting
        if (noteNode.hit) return
        
        //hit offset here just in case ever need it
        const HIT_OFFSET = 0
        const timeUntilHit = (noteNode.time - currentTime) - HIT_OFFSET
        
        if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.PERFECT) {
            hitScore = 'PERFECT'
        } else if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.GOOD) {
            hitScore = 'GOOD'
        } else {
            hitScore = 'MISS'
        }
        //if player is surging, handle a surge section note
        if(this.app.surgeManager.surging === true){
            this.app.surgeManager.handleNoteHit(hitScore, noteNode.beat)
        }
        //spawn a hit effect
        this.spawnHitEffect(hitScore, "ui")
        //update player score and health in the score manager
        this.app.scoreManager.updateScore(hitScore)
        this.app.scoreManager.updateHealth(hitScore)
        
        if(noteNode.noteNodeType === levelConfig.NOTE_NODE_TYPE.TAPNOTE){
            noteNode.hit = true
            noteNode.mesh.visible = false
            noteNode.killSelf()
        }
        else if(noteNode.noteNodeType === levelConfig.NOTE_NODE_TYPE.RAMP){
            this.app.level.handleRampHit(noteNode)
            noteNode.handleOnHit()
        }   
    }

    registerTrickHit = (trick, currentTime) => {
        let hitScore

        //this is all palceholder so no timing yet.
        //this is hacky until phase 3 when the full trick system will be added
        //trick currently is just a string: either "A", "S", or "D"

        hitScore = trick
        this.spawnHitEffect(hitScore, "ui")
        this.app.scoreManager.updateScore(hitScore)
    }

    registerLandingHit = (currentTime, landingTime) => {
        if(landingTime === null)return     //just in case

        const timeUntilHit = (landingTime - currentTime)
        console.log('SHEEEEEIIIIITT',timeUntilHit, levelConfig.NOTE_TIMING.RESYNCED)
        if (Math.abs(timeUntilHit) < levelConfig.NOTE_TIMING.RESYNCED) {
            this.spawnHitEffect("RESYNCED", "ui")
        } 
        else{
            this.spawnHitEffect("SYNC_BROKEN", "ui")
        }
    }

    //hit rating is 'PERFECT', 'GOOD', or 'MISS'
    spawnHitEffect = (hitRating, type) => {
        if(type === 'world'){
            const newHitEffect = new WorldHitEffect(hitRating,this.worldHitFxContainer)
            this.activeHits.push(newHitEffect)
        }
        else if(type === 'ui'){
            const newHitEffect = new UiHitEffect(hitRating,this.app.ui.gameplayHUD.hitEffectsContainer, this.app)
            // const newHitEffect = new UiHitEffect(hitRating,this.app.scene,texture)
            this.activeHits.push(newHitEffect)
        }
    }

    //called from surge manager every frame player is on a surge panel
    setSurge = (isOnSurgePanel) => {
        this.playerIsOnSurgePanel= isOnSurgePanel
    }

    update = (deltaTime) => {
        if(this.activeHits.length > 0){
            // 1) update everything
            this.activeHits.forEach(activeHit => activeHit.update(deltaTime))
            // 2) remove dead ones
            this.activeHits = this.activeHits.filter(hit => !hit.isDead)
        }
    }
}

class HitEffect{
    constructor(hitRating, container, app){
        this.hitRating = hitRating
        this.container = container
        this.app = app

        this.isDead = false
    }

    removeSelf = () => {
        //delete geometry and material
        if (this.geometry) this.geometry.dispose()
        if (this.material) this.material.dispose()
        //remove from scene heirarchy
        this.container.remove(this.mesh)
    }
}
//these are 'in the world' so to speak
class WorldHitEffect extends HitEffect{
    constructor(hitRating, container, texture){
        super(hitRating, container, texture)
    }

    update = () => {

    }
}

//these are the text good, perfect, or miss that live in a fixed space 
//as part of the ui
class UiHitEffect extends HitEffect{
    constructor(hitRating, container, app){
        super(hitRating, container, app)
        this.currentScale = 1
        this.terminalScale = 1.2
        this.scaleIncrementSpeed = .001
        this.app = app 
        
        const translatedHitRatings = {
            'PERFECT': 'LOCKED!',
            'GOOD': 'CLEAN',
            'MISS': 'DROPPED',
            'A': 'MUTE GRAB',
            'S': 'ROYALE GRAB',
            'D': 'BACKFLIP',
            'RESYNCED': 'RESYNCED',
            'SYNC_BROKEN': 'SYNC BROKEN'
        }

        // this.mesh = new THREE.Sprite(this.material)
        this.mesh = createTextNode({
            text:`${translatedHitRatings[hitRating]}`,
            fontSize: 100,
            color: levelConfig.UI_HIT_EFFECT_COLOR_DICT.fill[hitRating],
            font: levelConfig.UI_FONTS_DICT.judgements,
            x: 0, y: 0, z: 0,
        })
        this.mesh.outlineWidth = 7     
        this.mesh.outlineColor = levelConfig.UI_HIT_EFFECT_COLOR_DICT.outline[hitRating]
        this.mesh.outlineOpacity = 5.0   
        this.mesh.name = 'ui hit effect'
        this.mesh.scale.set(this.currentScale)
        // this.mesh.renderOrder = levelConfig.RENDER_ORDER.UI
        container.add(this.mesh)
    }

    update = (deltaTime) => {
        //check if curentRadius === terminalRadius
        if(this.currentScale >= this.terminalScale){
            //mark for deletion from HitManager's activeHits array
            this.isDead = true
            this.mesh.dispose()

            this.container.remove(this.mesh)
        }
        
        else{
            //move up some
            // this.mesh.position.y += 0.1 * deltaTime
            //increase the scale and set it
            const lerpFactor = 1 - Math.pow(.001, deltaTime)
            this.currentScale = Math.max(0, this.currentScale + .12 * lerpFactor)
            // this.currentScale += lerpFactor * .5
            this.mesh.scale.set(this.currentScale* .45, this.currentScale * .45, 1)
            //then **air horns** scaling functiooonnnnnn
            //aka reduce opacity as scale increases 
            // this.mesh.material.opacity = 1 - (this.currentScale / this.terminalScale * .5) 
        }
    }
}