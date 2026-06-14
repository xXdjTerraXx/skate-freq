import * as THREE from 'three'
import { createTextNode } from '../utils'
import { levelConfig } from '../config'


export default class ResultsScreen{
    constructor(app){
        this.app = app

        // layout constants — based on debug plane
        this.SCREEN_Z = 1.5
        this.SCREEN_CENTER_Y = 0.5  // matches camera y
        this.SCREEN_TOP = this.SCREEN_CENTER_Y + 0.8
        this.SCREEN_BOTTOM = this.SCREEN_CENTER_Y - 0.6
        this.SCREEN_LEFT = -0.9
        this.SCREEN_RIGHT = 0.9
        this.LINE_HEIGHT = 0.2
        this.PADDING = 0.05


        //the main container within the score screen
        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'score_screen_main_container'
        this.mainContainer.position.set(0,0,0)

        //basically just a title bar at the top that says "RESULTS" or smthn
        this.titleContainer = new THREE.Group()
        this.titleContainer.name = 'score_screen_title_container'
        this.titleContainer.position.set(0,0,0)
        this.titleText = createTextNode({
            text: 'results://', 
            fontSize: .2, 
            color: levelConfig.UI_COLOR_PALETTE.purple, 
            x: 0, y: 0, z: 0
        })
        this.titleContainer.add(this.titleText)
        this.titleContainer.position.set(this.SCREEN_LEFT, this.SCREEN_TOP)

        //container for level details recap: -  
        // the song's track selection plate/art and selected difficulty
        this.levelDetailsContainer = new THREE.Group()
        this.levelDetailsContainer.name = "level_details_container"
        this.levelDetailsContainer.position.set(0,0,0)
        //place holder song title text
        this.songTitleText = createTextNode({
            text: ``, 
            fontSize: .2, 
            color: levelConfig.UI_HIT_EFFECT_COLOR_DICT.PERFECT, 
            x: this.SCREEN_CENTER_Y, y: this.SCREEN_TOP-this.LINE_HEIGHT,z:0
        })
        this.songTitleText.anchorX = 'center'
        this.levelDetailsContainer.add(this.songTitleText)

        //the container for hit counts
        this.hitCountsContainer = new THREE.Group()
        this.hitCountsContainer.name = 'hit_counts_container'
        this.hitCountsContainer.position.set(0,0,0)
        //container for the left half of hit counts
        this.hitCountsLeft = new THREE.Group()
        this.hitCountsLeft.name = 'hit_counts_left'
        this.hitCountsLeft.position.set(this.SCREEN_LEFT,0,0)
        //container for the right half of hit counts
        this.hitCountsRight = new THREE.Group()
        this.hitCountsRight.name = 'hit_counts_right'
        this.hitCountsRight.position.set(this.SCREEN_RIGHT,0,0)
        //text for naming PERFECT, GOOD, MISS   
        this.perfectText = createTextNode({
            text: 'perfect:', 
            fontSize: .2, 
            color: levelConfig.UI_HIT_EFFECT_COLOR_DICT.PERFECT, 
            font: levelConfig.UI_FONTS_DICT.uiFont2,
            x: 0, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.goodText = createTextNode({
            text: 'good:', 
            fontSize: .2, 
            color: levelConfig.UI_HIT_EFFECT_COLOR_DICT.GOOD, 
            font: levelConfig.UI_FONTS_DICT.uiFont2,
            x: 0, y: this.LINE_HEIGHT, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.missText = createTextNode({
            text: 'miss:', 
            fontSize: .2, 
            color: levelConfig.UI_HIT_EFFECT_COLOR_DICT.MISS, 
            font: levelConfig.UI_FONTS_DICT.uiFont2,
            x: 0, y: this.LINE_HEIGHT*2, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.maxComboText = createTextNode({
            text: 'max combo:', 
            fontSize: .2, 
            color: levelConfig.UI_COLOR_PALETTE.orange, 
            x: 0, y: this.LINE_HEIGHT*3, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        //text for the actual numbers of each hit type 
        this.perfectCountText = createTextNode({
            text: '', 
            fontSize: .2, 
            color: levelConfig.UI_COLOR_PALETTE.purple, 
            x: 0, y: 0, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.goodCountText = createTextNode({
            text: '', 
            fontSize: .2, 
            color: levelConfig.UI_COLOR_PALETTE.purple, 
            x: 0, y: this.LINE_HEIGHT, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.missCountText = createTextNode({
            text: '', 
            fontSize: .2, 
            color: levelConfig.UI_COLOR_PALETTE.purple, 
            x: 0, y: this.LINE_HEIGHT*2, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.maxComboAmountText = createTextNode({
            text: '', 
            fontSize: .2, 
            color: levelConfig.UI_COLOR_PALETTE.purple, 
            x: 0, y: this.LINE_HEIGHT*3, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })

        this.hitCountsLeft.add(this.perfectText, this.goodText, this.missText, this.maxComboText)
        this.hitCountsRight.add(this.perfectCountText, this.goodCountText, this.missCountText, this.maxComboAmountText)
        this.hitCountsContainer.add(this.hitCountsLeft, this.hitCountsRight)

        // score section — raw score and final score (score * maxCombo/5)
        this.scoreContainer = new THREE.Group()
        this.scoreContainer.name = 'score_container'
        this.scoreContainer.position.set(0, 0, 0)

        this.scoreLabel = createTextNode({
            text: 'score:',
            fontSize: .2,
            color: levelConfig.UI_COLOR_PALETTE.orange,
            x: this.SCREEN_LEFT, y: -(this.LINE_HEIGHT * 5), z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.scoreAmountText = createTextNode({
            text: '',
            fontSize: .2,
            color: levelConfig.UI_COLOR_PALETTE.purple,
            x: this.SCREEN_RIGHT, y: -(this.LINE_HEIGHT * 5), z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.finalScoreLabel = createTextNode({
            text: 'final score:',
            fontSize: .2,
            color: levelConfig.UI_COLOR_PALETTE.orange,
            x: this.SCREEN_LEFT, y: -(this.LINE_HEIGHT * 6), z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.finalScoreAmountText = createTextNode({
            text: '',
            fontSize: .25,
            color: levelConfig.UI_COLOR_PALETTE.cyan,
            x: this.SCREEN_RIGHT, y: -(this.LINE_HEIGHT * 6), z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI,
            layers: 1
        })
        this.scoreContainer.add(this.scoreLabel, this.scoreAmountText, this.finalScoreLabel, this.finalScoreAmountText)

        // press F to continue prompt 
        this.promptContainer = new THREE.Group()
        this.promptContainer.name = 'prompt_container'
        this.promptContainer.position.set(0, 0, 0)

        this.promptText = createTextNode({
            text: 'press F to continue',
            fontSize: .15,
            color: levelConfig.UI_COLOR_PALETTE.white,
            x: 0, y: this.SCREEN_BOTTOM, z: 0,
            renderOrder: levelConfig.RENDER_ORDER.UI
        })
        this.promptText.anchorX = 'center'
        this.promptContainer.add(this.promptText)

        this.mainContainer.add(this.titleContainer, this.hitCountsContainer, this.levelDetailsContainer, this.scoreContainer, this.promptContainer)
    }

    displayResults = () => {
        //display the name of the completed song
        this.songTitleText.text = `"${this.app.audioManager.currentSong.title}" - ${this.app.audioManager.currentSong.artist}`
        this.songTitleText.sync()
        this.perfectCountText.text = `${this.app.scoreManager.hitCounts.PERFECT}`
        this.perfectCountText.sync()
        this.goodCountText.text = `${this.app.scoreManager.hitCounts.GOOD}`
        this.goodCountText.sync()
        this.missCountText.text = `${this.app.scoreManager.hitCounts.MISS}`
        this.missCountText.sync()
        this.maxComboAmountText.text = `x${this.app.scoreManager.maxCombo}`
        this.maxComboAmountText.sync()
        this.scoreAmountText.text = `${this.app.scoreManager.currentScore}`
        this.scoreAmountText.sync()
        this.finalScoreAmountText.text = `${this.app.scoreManager.getFinalScore()}`
        this.finalScoreAmountText.sync()
    }

    resetResultsText = () => {
        this.songTitleText.text = ''
        this.songTitleText.sync()
        this.perfectCountText.text = ''
        this.perfectCountText.sync()
        this.goodCountText.text = ''
        this.goodCountText.sync()
        this.missCountText.text = ''
        this.missCountText.sync()
        this.maxComboAmountText.text = ''
        this.maxComboAmountText.sync()
        this.scoreAmountText.text = ''
        this.scoreAmountText.sync()
        this.finalScoreAmountText.text = ''
        this.finalScoreAmountText.sync()
    }
    
}