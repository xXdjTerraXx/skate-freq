import * as THREE from 'three'
import { createTextNode } from '../../utils'
import { levelConfig } from '../../config'
import SurgeMeter from './components/SurgeMeter'
import UplinkMeter from './components/UplinkMeter'


export default class GameplayHUD{
    constructor(app, mainUiContainer){
        this.app = app
        this.mainUiContainer = mainUiContainer

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'gameplay hud main container'

        //this just tracked here for score lerping (idk if really lerping in this case o_O)
        this.targetScore = 0
        this.displayScore = 0

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////~~*~~*  HITS  *~~*~~///////////////////////////////////////
        
        //where the 'PERFECT', 'GOOD', etc effects live
        this.hitEffectsContainer = new THREE.Group()
        this.hitEffectsContainer.name = 'hit effect container'
        this.hitEffectsContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.hitEffects.position.x, 
            levelConfig.UI_COMPONENT_SETTINGS.hitEffects.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.hitEffects.position.z
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
///////////////////////~~*~~*  SURGE  *~~*~~////////////////////////////
        //where surge meter lives
        this.surgeMeter = new SurgeMeter(this.mainContainer)
        this.surgeMeter.init()
        this.surgeMeter.mainContainer.position.set(
            levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.position.x,
            levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.position.y,
            levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.position.z
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
            this.hitEffectsContainer, 
            this.scoreContainer, 
            this.comboContainer,
            this.healthContainer
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

    reset = () => {
        this.scoreText.text = ''
        this.scoreText.sync()
        this.comboText.text = ''
        this.comboText.sync()
        this.currentHealthText.text = `${levelConfig.PLAYER_STARTING_HEALTH} / ${levelConfig.PLAYER_STARTING_HEALTH}`
        this.currentHealthText.sync()

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

        this.components.forEach(comp => comp.update(deltaTime))
    }
}