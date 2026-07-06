import * as THREE from 'three'
import { levelConfig } from '../../../config'
import { createTextNode } from '../../../utils'
import ENUMS from '../../../enums'

export default class ActiveGrindDisplay{
    constructor(parentContainer, spawnHitEffect){
        //gameplay HUD main container is the parent container
        this.parentContainer = parentContainer
        //the function from gameplayHUD that spawns hit effects
        //using here for spawning release hit effects 
        this.spawnHitEffect = spawnHitEffect

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

        //this text is what gets set and then animated on grind completion.
        this.completionText = createTextNode({
            text: '', 
            fontSize: levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.fontSize, 
            color: levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.fontColor, 
            x: 0, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })

        //need this for grind completion score addition animation
        this.scoreMainContainerPosition = levelConfig.UI_COMPONENT_SETTINGS.scoreContainer.position
    }

    init = () => {
        this.mainContainer.add(this.grindScoreText, this.initialJudgementText, this.grindReleaseEffectContainer)
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

    endActiveGrind = (grindJudgement) => {

        if(grindJudgement === ENUMS.JUDGEMENT.BAIL){
            this.handleGrindBailAnimation()
            this.spawnHitEffect(grindJudgement, ENUMS.HIT_EFFECT_CATEGORY.GRIND)
        }
        else if(grindJudgement === ENUMS.JUDGEMENT.RELEASE){
            this.handleGrindReleaseAnimation()
            this.spawnHitEffect(grindJudgement, ENUMS.HIT_EFFECT_CATEGORY.GRIND)
        }
        this.clearActiveGrind()
    }

    // handlePulse — called from outside on each sixteenth note beat
    handlePulse = () => {
        if(this.grindInProgress){
            this.currentScale = this.MAX_SCALE
        }
    }
    //if successfully finished grind, move grind score display towards final score
    handleGrindReleaseAnimation = () => {
        //TO DO
    }

    handleGrindBailAnimation = () => {
        //TO DO
    }

    clearActiveGrind = () => {
        //reset active grind
        this.grindInProgress = false
        this.activeGrindJudgement = null
        this.initialJudgement = null
        this.currentGrindScore = 0
        this.grindScoreText.text = ''
        this.completionText.text = ''
        this.initialJudgementText.text = ''
        this.completionText.position.set({x: 0, y: 0, z: 0})

        this.initialJudgementText.sync()
        this.grindScoreText.sync()
        this.completionText.sync()
        //clear container
        //TO DO
    }

    update = (deltaTime) => {
        if(!this.grindInProgress) return
        const lerpFactor = 1 - Math.pow(0.001, deltaTime)
        this.currentScale += (this.MIN_SCALE - this.currentScale) * lerpFactor
        this.grindScoreText.scale.set(this.currentScale, this.currentScale, 1)
    }

    reset = () => {
        this.clearActiveGrind()
    }
}