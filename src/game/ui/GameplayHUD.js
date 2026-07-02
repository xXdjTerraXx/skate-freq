import * as THREE from 'three'
import { createTextNode } from '../../utils'
import { levelConfig } from '../../config'
import SurgeMeter from './components/SurgeMeter'
import UplinkMeter from './components/UplinkMeter'
import ActiveGrindDisplay from './components/ActiveGrindDisplay'


export default class GameplayHUD{
    constructor(app, mainUiContainer){
        this.app = app
        this.mainUiContainer = mainUiContainer

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'gameplay hud main container'

        //this just tracked here for score lerping (idk if really lerping in this case o_O)
        this.targetScore = 0
        this.displayScore = 0

        //any hit effects displaying currently. used for update
        this.activeHits = []

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////~~*~~*  HITS  *~~*~~///////////////////////////////////////
        
        //where the 'PERFECT', 'GOOD', etc effects live
        this.noteHitEffectsContainer = new THREE.Group()
        this.noteHitEffectsContainer.name = 'hit effect container'
        this.noteHitEffectsContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.noteHitEffects.position.x, 
            levelConfig.UI_COMPONENT_SETTINGS.noteHitEffects.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.noteHitEffects.position.z
        )

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////~~*~~*  GRIND  *~~*~~///////////////////////////////////////

        //where info about the active grind appears
        this.grindHitEffectsContainer = new THREE.Group()
        this.grindHitEffectsContainer.name = 'grind effects container'
        this.grindHitEffectsContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.grindHitEffects.position.x, 
            levelConfig.UI_COMPONENT_SETTINGS.grindHitEffects.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.grindHitEffects.position.z
        )

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////~~*~~*  LAND HITS  *~~*~~///////////////////////////////////////

        //where info about the active grind appears
        this.landHitEffectsContainer = new THREE.Group()
        this.landHitEffectsContainer.name = 'land effects container'
        this.landHitEffectsContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.landHitEffects.position.x, 
            levelConfig.UI_COMPONENT_SETTINGS.landHitEffects.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.landHitEffects.position.z
        )

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////~~*~~*  TRICK HITS  *~~*~~///////////////////////////////////////

        //where info about the active grind appears
        this.trickHitEffectsContainer = new THREE.Group()
        this.trickHitEffectsContainer.name = 'trick effects container'
        this.trickHitEffectsContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.trickHitEffects.position.x, 
            levelConfig.UI_COMPONENT_SETTINGS.trickHitEffects.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.trickHitEffects.position.z
        )

////////////////////////////////////////////////////////////////////////
///////////////////////~~*~~*  SCORE  *~~*~~////////////////////////////
        //where score displays live
        this.scoreContainer = new THREE.Group()
        this.scoreContainer.name = 'score container'
        this.scoreContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.scoreContainer.position.x, 
            levelConfig.UI_COMPONENT_SETTINGS.scoreContainer.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.scoreContainer.position.z
        )

        this.scoreText = createTextNode({
            text: '', 
            font: '/assets/fonts/OCRAEXT.TTF',
            fontSize: levelConfig.UI_COMPONENT_SETTINGS.scoreContainer.fontSize, 
            color: 0xffffff, 
            x: 0, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1,
            name: 'score text'
        })
        
        this.scoreContainer.add(this.scoreText)   
        
/////////////////////////////////////////////////////////////////////////
///////////////////////~~*~~*  COMBO  *~~*~~////////////////////////////
        //where score and  combo displays lives
        this.comboContainer = new THREE.Group()
        this.comboContainer.name = 'combo container'
        this.comboContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.comboContainer.position.x, 
            levelConfig.UI_COMPONENT_SETTINGS.comboContainer.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.comboContainer.position.z
        )
        this.comboText = createTextNode({
            text: '', 
            font: '/assets/fonts/OCRAEXT.TTF',
            fontSize: levelConfig.UI_COMPONENT_SETTINGS.comboContainer.fontSize, 
            color: 0xffffff, 
            x: 0.5, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1,
            name: 'combo text'
        })

        this.comboContainer.add(this.comboText)

////////////////////////////////////////////////////////////////////////
///////////////////////~~*~~*  SURGE METER  *~~*~~////////////////////////////
        this.surgeMeter = new SurgeMeter(this.mainContainer)
        this.surgeMeter.init()
        this.surgeMeter.mainContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.position.x,
            levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.position.z
        )
        
////////////////////////////////////////////////////////////////////////
///////////////////////~~*~~*  ACTIVE GRIND DISPLAY  *~~*~~////////////////////////////
        this.activeGrindDisplay = new ActiveGrindDisplay(this.mainContainer)
        this.activeGrindDisplay.init()
        this.activeGrindDisplay.mainContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.position.x,
            levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.activeGrindDisplay.position.z
        )
        
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////~~*~~*  HEALH  *~~*~~///////////////////////////////////////
        this.healthContainer = new THREE.Group()
        this.healthContainer.name = 'health container'
        this.healthContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.healthContainer.position.x,
            levelConfig.UI_COMPONENT_SETTINGS.healthContainer.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.healthContainer.position.z
        )

        this.currentHealthText = createTextNode({
            text: `${levelConfig.PLAYER_STARTING_HEALTH} / ${levelConfig.PLAYER_STARTING_HEALTH}`, 
            fontSize: levelConfig.UI_COMPONENT_SETTINGS.healthContainer.fontSize, 
            color: 0xffffff, 
            x: 0, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })

        this.healthContainer.add(this.currentHealthText)
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////~~*~~*  UPLINK  *~~*~~//////////////////////////////////////
         //where UPLINK meter lives
        this.uplinkMeter = new UplinkMeter(this.mainContainer)
        this.uplinkMeter.init()
        this.uplinkMeter.mainContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.position.x,
            levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.position.z
        )

        //add any components with an update method to components array
        this.components = [this.surgeMeter, this.uplinkMeter]
    }

    init = () => {
        this.mainContainer.add(
            this.noteHitEffectsContainer, 
            this.scoreContainer, 
            this.comboContainer,
            this.healthContainer,
            this.grindHitEffectsContainer,
            this.landHitEffectsContainer,
            this.trickHitEffectsContainer
        )
    }

    updateScore = (newScore, newCombo) => {
        // console.log(`score updated! new score is ${newScore} -- your combo is at ${newCombo}`)
        //quirk of this text library - u have to call sync when changing any text
        // this.scoreText.text = `${newScore}`
        // this.scoreText.sync()
        this.targetScore = newScore
        
        this.comboText.text = `x${newCombo}`
        this.comboText.sync()
    }

    updateHealth = (newHealth) => {
        this.currentHealthText.text = `${newHealth} / ${levelConfig.PLAYER_STARTING_HEALTH}`
        this.currentHealthText.sync()
    }

    updateUplink = (newUplinkValue) => {
        this.uplinkMeter.updateUplink(newUplinkValue)
    }

    updateActiveGrind = () => {
        //TO DO: call ActiveGrindDisplay component here to display the
        //initial active grind score and the grind hold multiplier
    }

    spawnHitEffect = (judgement, type) => {
        //set parent container based on category
        const {NOTE, GRIND, LAND, TRICK } = levelConfig.HIT_EFFECT_CATEGORY_ENUMS
        let parentContainer
        type === NOTE ? parentContainer = this.noteHitEffectsContainer
        : type === GRIND ? parentContainer = this.grindHitEffectsContainer 
        : type === LAND ? parentContainer = this.landHitEffectsContainer
        : type === TRICK ? parentContainer = this.trickHitEffectSContainer
        
        : null
        if (parentContainer === null) return
        const newHitEffect = new UiHitEffect(this.app, judgement, parentContainer)
        // const newHitEffect = new UiHitEffect(hitRating,this.app.scene,texture)
        this.activeHits.push(newHitEffect)
    }

    //called from level which is where the clock gets sent everywhere from
    onBeatSixteenth = () => {
        //TO DO: pulse current combo and active grind stuff and anything other ui
    }

    reset = () => {
        this.scoreText.text = ''
        this.scoreText.sync()
        this.comboText.text = ''
        this.comboText.sync()
        this.currentHealthText.text = `${levelConfig.PLAYER_STARTING_HEALTH} / ${levelConfig.PLAYER_STARTING_HEALTH}`
        this.currentHealthText.sync()
        this.activeHits = []

        //reset all componENTS (XD) as well
        this.components.forEach(comp => comp.reset())
    }

    update = (deltaTime) => {
        //score update
        if(this.displayScore !== this.targetScore){
            this.displayScore = Math.round(
                this.displayScore + (this.targetScore - this.displayScore) * 0.15
            )
            //snap to targetScore bc it gets stuck 
            if (Math.abs(this.targetScore - this.displayScore) < 5) {
                this.displayScore = this.targetScore
            }
            this.scoreText.text = `${this.displayScore}`
            this.scoreText.sync()
        }

        //hits update
        if(this.activeHits.length > 0){
            // 1) update everything
            this.activeHits.forEach(activeHit => activeHit.update(deltaTime))
            // 2) remove dead ones
            this.activeHits = this.activeHits.filter(hit => !hit.isDead)
        }

        this.components.forEach(comp => comp.update(deltaTime))
    }
}


class UiHitEffect {
    constructor(app, judgement, parentContainer){
        this.app = app
        this.judgement = judgement
        this.parentContainer = parentContainer

        this.isDead = false

        this.currentScale = 1
        this.terminalScale = 1.2
        this.scaleIncrementSpeed = .001
        
        //this is stupid. i know that. but i cant decide on names for the in lore
        // judgements!!!! and it's easier to change them here
        const translatedHitRatings = {
            'PERFECT': 'LOCKED!',
            'GOOD': 'CLEAN',
            'MISS': 'DROPPED',
            'A': 'MUTE GRAB',
            'S': 'ROYALE GRAB',
            'D': 'BACKFLIP',
            'RESYNCED': 'RESYNCED',
            'SYNC_BROKEN': 'SYNC BROKEN',
            'HOLD': 'HOLD',
            'BAIL': 'BAIL',
            'RELEASE': 'RELEASE',
        }

        // this.mesh = new THREE.Sprite(this.material)
        this.mesh = createTextNode({
            text:`${translatedHitRatings[judgement]}`,
            fontSize: 100,
            color: levelConfig.UI_HIT_EFFECT_COLOR_DICT.fill[judgement],
            font: levelConfig.UI_FONTS_DICT.judgements,
            x: 0, y: 0, z: 0,
        })
        this.mesh.outlineWidth = 7     
        this.mesh.outlineColor = levelConfig.UI_HIT_EFFECT_COLOR_DICT.outline[judgement]
        this.mesh.outlineOpacity = 5.0   
        this.mesh.name = 'ui hit effect'
        this.mesh.scale.set(this.currentScale)
        // this.mesh.renderOrder = levelConfig.RENDER_ORDER.UI
        this.parentContainer.add(this.mesh)
    }

    update = (deltaTime) => {
        //check if curentRadius === terminalRadius
        if(this.currentScale >= this.terminalScale){
            //mark for deletion from HitManager's activeHits array
            this.isDead = true
            this.mesh.dispose()

            this.parentContainer.remove(this.mesh)
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

    removeSelf = () => {
        //delete geometry and material
        if (this.geometry) this.geometry.dispose()
        if (this.material) this.material.dispose()
        //remove from scene heirarchy
        this.parentContainer.remove(this.mesh)
    }
}