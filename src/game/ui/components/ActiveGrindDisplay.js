import * as THREE from 'three'
import { COLOR_PALETTE, levelConfig } from '../../../config'
import { createTextNode } from '../../../utils'
import ENUMS from '../../../enums'

export default class ActiveGrindDisplay{
    constructor(parentContainer, spawnHitEffect, scoreCounterPosition){
        //gameplay HUD main container is the parent container
        this.parentContainer = parentContainer
        //the function from gameplayHUD that spawns hit effects
        //using here for spawning release hit effects 
        this.spawnHitEffect = spawnHitEffect
        //this position needed to animate grind score moving towards total score
        //on grind completion
        this.scoreCounterPosition = scoreCounterPosition

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'active grind container'

        this.grindReleaseEffectContainer = new THREE.Group()
        this.grindReleaseEffectContainer.name = 'grind release effect container'
        this.grindReleaseEffectContainer.position.set(0, 0, 0)

        this.grindInProgress = false
        //the initial judgement will be LOCKED,CLEAN, or DROPPED
        this.initialJudgement = null
        //active grind judgements are HOLD, RELEASE, or BAIL
        this.activeGrindJudgement = null
        this.currentGrindScore = 0
        //the position where the completion text will try to move on complete
        this.completionTextTargetLocation = null

        //stuff for beat pulse of text
        this.currentScale = 1
        this.MAX_SCALE = 1.5
        this.MIN_SCALE = 1

        this.initialJudgementText = createTextNode({
            text:``,
            fontSize: levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.fontSize,
            font: levelConfig.UI_FONTS_DICT.judgements,
            x: 0, y: 50, z: 0,
        })

        this.grindScoreText = createTextNode({
            text: '', 
            fontSize: levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.fontSize, 
            color: levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.fontColor, 
            x: 0, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })

        this.activeCompletionHits = []
    }

    init = () => {
        this.mainContainer.add(this.grindScoreText, this.initialJudgementText, this.grindReleaseEffectContainer, this.completionText)
        this.parentContainer.add(this.mainContainer)
    }

    startActiveGrind = (grindScore, initialJudgement) => {
        console.log('DEBUG: START ACTIVE GRIND', grindScore, initialJudgement)
        this.grindInProgress = true
        this.initialJudgement = initialJudgement
        this.currentGrindScore = grindScore
        this.grindScoreText.text = `${grindScore}`
        this.initialJudgementText.text = initialJudgement
        //set text color based on what judgement
        this.initialJudgementText.color = levelConfig.UI_HIT_EFFECT_COLOR_DICT.fill[initialJudgement]
        this.initialJudgementText.sync()
        this.initialJudgementText.outlineColor = levelConfig.UI_HIT_EFFECT_COLOR_DICT.outline[initialJudgement]
        this.initialJudgementText.sync()
    }   

    updateActiveGrind = (newGrindScore, grindJudgement) => {
        console.log('ACTIVE GRIND HOLD DEBUG', grindJudgement)
        const { HOLD, BAIL, RELEASE } = ENUMS.JUDGEMENT
        this.grindScoreText.text = `${newGrindScore}`
        this.grindScoreText.sync()
        this.activeGrindJudgement = grindJudgement

        this.handlePulse()
    }

    //this function creates a completion hit
    endActiveGrind = (grindJudgement) => {
        console.log('#$%@#%^$%^@#$%^$ ENDING ACTIVE GRIND: ', grindJudgement)
        //create a standard hit effect for the release score
        this.spawnHitEffect(grindJudgement, ENUMS.HIT_EFFECT_CATEGORY.GRIND)
        //create a completion hit
        const scoreText = `${this.grindScoreText.text}`
        const completionHit = new CompletionHitEffect(scoreText, grindJudgement, this.mainContainer)
        this.activeCompletionHits.push(completionHit)
        this.clearActiveGrind()
    }

    // handlePulse — called from outside on each sixteenth note beat
    handlePulse = () => {
        if(this.grindInProgress){
            this.currentScale = this.MAX_SCALE
        }
    }

    clearActiveGrind = () => {
        //reset active grind
        this.grindInProgress = false
        this.activeGrindJudgement = null
        this.initialJudgement = null
        
        this.currentGrindScore = 0
        this.grindScoreText.text = ''
        this.initialJudgementText.text = ''

        this.initialJudgementText.sync()
        this.grindScoreText.sync()
        //clear container
        //TO DO
    }

    update = (deltaTime) => {
        //update active hits
        if(this.activeCompletionHits.length > 0){
            //1) run update
            this.activeCompletionHits.forEach(hit => hit.update(deltaTime))
            //2) theeennn filter dead hits
            this.activeCompletionHits = this.activeCompletionHits.filter(hit => !hit.isDead)
        }
            
        if(!this.grindInProgress) return
        const lerpFactor = 1 - Math.pow(0.001, deltaTime)
        this.currentScale += (this.MIN_SCALE - this.currentScale) * lerpFactor
        this.grindScoreText.scale.set(this.currentScale, this.currentScale, 1)
    }

    reset = () => {
        this.clearActiveGrind()
    }
}

//a proprietary hit effect for active grind display class
class CompletionHitEffect {
    constructor(scoreText, releaseJudgement, parentContainer){
        this.isDead = false
        this.releaseJudgement = releaseJudgement
        this.parentContainer = parentContainer
        //this text is what gets set and then animated on grind completion.
        this.textNode = createTextNode({
            text: `${this.releaseJudgement === ENUMS.JUDGEMENT.RELEASE ? scoreText : 0}`, 
            fontSize: levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.fontSize, 
            x: 200, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.textNode.color = this.releaseJudgement === ENUMS.JUDGEMENT.RELEASE
        ? COLOR_PALETTE.cyan
        : COLOR_PALETTE.green

        this.scorePosition = levelConfig.UI_COMPONENT_SETTINGS.scoreContainer.position

        this.currentX = 0
        this.currentY = 0
        this.targetX = this.scorePosition.x
        this.targetY = this.releaseJudgement === ENUMS.JUDGEMENT.RELEASE 
            ? this.scorePosition.y 
            : this.currentY - 100
        // 1 = moving X, 2 = moving Y
        this.phase = 1  
        // how close to targetX before phase 2 starts
        this.X_THRESHOLD = 5
        
        this.SPEED = 300

        this.parentContainer.add(this.textNode)
    }

    update = (deltaTime) => {
        const lerpFactor = 1 - Math.pow(0.001, deltaTime)

        if(this.phase === 1){
            // ease toward targetX
            this.currentX += (this.targetX - this.currentX) * lerpFactor
            this.textNode.position.set(this.currentX, this.currentY, 0)

            // check if close enough to switch to phase 2
            if(Math.abs(this.targetX - this.currentX) < this.X_THRESHOLD){
                this.currentX = this.targetX
                this.phase = 2
            }
        }
        else if(this.phase === 2){
            // ease toward targetY
            this.currentY += (this.targetY - this.currentY) * lerpFactor
            this.textNode.fillOpacity = Math.max(0, this.textNode.fillOpacity - deltaTime * 2)
            this.textNode.position.set(this.currentX, this.currentY, 0)

            // once close enough to targetY, die
            if(Math.abs(this.targetY - this.currentY) < this.X_THRESHOLD){
                this.removeSelf()
            }
        }
    }

    removeSelf = () => {
        
        this.isDead = true
        if (this.textNode) this.textNode.dispose()
        //remove from scene 
        this.parentContainer.remove(this.textNode)
    }
}