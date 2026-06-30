import * as THREE from 'three'


// ============================================
// some scuffed javascript enumsss
// ============================================
export const GAME_STATES = {
    LOADING: 'LOADING',
    TITLE: 'TITLE',
    SONG_SELECT: 'SONG_SELECT',
    COUNTDOWN: 'COUNTDOWN',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    RESULTS: 'RESULTS',
    GAME_OVER: 'GAME_OVER',
}

// state classes
//basically these are wrappers for state, so that they all have the same methods
//and work well w the state machine

class LoadingState {
    constructor(app) { this.app = app }
    
    onEnter = () => {
        console.log('entering LOADING state')
    }

    update = (deltaTime) => {}
    
    onExit = () => {}
}

class TitleState {
    constructor(app) {
        this.app = app 
        this.container = new THREE.Group()
        this.container.name = 'title state container'
        this.container.add(this.app.titleScreen.mainContainer)
        this.container.visible = false
        this.app.scene.add(this.container)
    }
    
    onEnter = () => {
        console.log('entering TITLE state')
        this.addKeyEvents()
        this.container.visible = true
        this.app.audioManager.playMenuMusic()
    }

    update = (deltaTime) => {
        this.app.titleScreen.update(deltaTime)
    }
    
    onExit = () => {
        this.removeKeyEvents()
        this.container.visible = false
    }

    titleKeyEvent = (e) => {
        if(e.code === 'KeyF'){
            //start eeeeverything
            this.app.stateMachine.setState(GAME_STATES.SONG_SELECT)
            //play sfx
            this.app.audioManager.playSfx("confirmSelection")
        }
    }

    addKeyEvents = () => {
        window.addEventListener('keydown', this.titleKeyEvent)
    }

    removeKeyEvents = () => {
        window.removeEventListener('keydown', this.titleKeyEvent)
    }
}

class SongSelectState {
    constructor(app) { 
        this.app = app
        this.container = new THREE.Group()
        this.container.name = 'song select state container'
        this.container.add(this.app.songSelectScreen.mainContainer)
        this.container.visible = false
        this.app.scene.add(this.container) }
    
    onEnter = () => {
        this.app.songSelectScreen.initUi()
        this.container.visible = true
        this.addKeyEvents()
        this.app.audioManager.playMenuMusic()
    }

    songSelectKeys = (e) => {
        //song selection up
        if(e.code === 'KeyW'){
            this.app.songSelectScreen.incrementSelection(1)
            //play sound effect
            this.app.audioManager.playSfx("changeSongSelection")
            console.log("rotate selection circle up")
        }
        //song selection down
        if(e.code === 'KeyS'){
            this.app.songSelectScreen.incrementSelection(-1)
            //play sound effect
            this.app.audioManager.playSfx("changeSongSelection")
            console.log("rotate selection circle down")
        }
        //select song
        if(e.code === 'Space'){
            //reset and stop the menu music
            this.app.audioManager.resetSong()
            //play sfx
            this.app.audioManager.playSfx("confirmSelection")
            //this sets the song in audio manager
            this.app.songSelectScreen.handleSelect()
            //change states...(song starts playing there)
            this.app.stateMachine.setState(GAME_STATES.PLAYING)
        }
    }
    
    addKeyEvents = () => {
        window.addEventListener('keydown', this.songSelectKeys)
    }

    removeKeyEvents = () => {
        window.removeEventListener('keydown', this.songSelectKeys)
    }

    update = (deltaTime) => {
        this.app.songSelectScreen.update(deltaTime)
    }
    
    onExit = () => {
        this.app.songSelectScreen.resetUi()
        this.container.visible = false
        this.removeKeyEvents()
        
    }
}

class CountdownState {
    constructor(app) { this.app = app }
    
    onEnter = () => {
        console.log('entering COUNTDOWN state')
    }

    update = (deltaTime) => {}
    
    onExit = () => {}
}

class PlayingState {
    constructor(app) { 
        this.app = app 

        this.container = new THREE.Group()
        this.container.name = 'playing state container'
        this.container.visible = false

        this.countdownSubStateContainer = new THREE.Group()
        this.countdownSubStateContainer.name = 'countdown sub state container'
        this.countdownSubStateContainer.visible = true

        this.playingSubStateContainer = new THREE.Group()
        this.playingSubStateContainer.name = 'playing sub state container'
        this.playingSubStateContainer.visible = true

        this.playingSubStateContainer.add(this.app.level.mainLevelContainer)
        this.countdownSubStateContainer.add(this.app.countdownScreen.mainContainer)
        this.container.add(this.countdownSubStateContainer, this.playingSubStateContainer, this.app.pauseScreen.mainContainer)

        this.app.scene.add(this.container)

        //PlayingState controls this substate that switches from the 
        //countdown to the actual gameplay. ultimately determines
        //what is happening during update
        this.subState = 'COUNTDOWN' // or 'PLAYING' or 'PAUSED'
    }

    pauseKeyEvent = (e) => {
        if(e.code === 'KeyP' || e.code === 'Enter'){
            if(this.subState === 'PLAYING'){
                this.handlePause()
            } else if(this.subState === 'PAUSED'){
                this.handleUnpause()
            }
        }
    }

    handlePause = () => {
        this.subState = 'PAUSED'
        this.app.audioManager.pause()
        this.app.pauseScreen.mainContainer.visible = true
    }

    handleUnpause = () => {
        this.subState = 'PLAYING'
        this.app.audioManager.resume()
        this.app.pauseScreen.mainContainer.visible = false
    }

    addKeyEvents = () => {
        window.addEventListener('keydown', this.pauseKeyEvent)
    }

    removeKeyEvents = () => {
        window.removeEventListener('keydown', this.pauseKeyEvent)
    }
    
    onEnter = () => {
        console.log('entering PLAYING state')
        //add key events
        this.addKeyEvents()

        //play song
        this.app.audioManager.playSong()
        
        //toggle visibility
        this.container.visible = true

        //toggle ui scene visibility
        this.app.uiScene.visible = true

        //set up level
        const noteMap = this.app.audioManager.currentSong.noteMap

        //init the level screen and the countdown screen
        //countdown needs current song's bpm
        const songBpm = this.app.audioManager.currentSong.bpm
        this.app.countdownScreen.init(songBpm)
        this.app.level.init(noteMap)
        this.app.surgeManager.init(noteMap)
    }

    //update method for PLAYING substate
    playingUpdate = (deltaTime) => {
        this.app.controller.run(deltaTime)
        this.app.player.update(deltaTime)
        this.app.level.update(deltaTime)
        this.app.ui.update(deltaTime)
        //only detect hits AFTER countdown
        if(this.subState === 'PLAYING'){
            //TODO: surge manager update can probly be moved out of this check
            this.app.surgeManager.update(deltaTime)
            this.app.hitManager.update(deltaTime)
        }
        this.app.level.updateNotes(deltaTime)

        // check if song ended
        if (this.app.audioManager.isFinished()) {
            this.app.stateMachine.setState(GAME_STATES.RESULTS)
        }
        //check if player health is at or below 0
        if (this.app.scoreManager.health <= 0 || this.app.scoreManager.uplink <= 0) {
            this.app.stateMachine.setState(GAME_STATES.GAME_OVER)
        }
    }

    //aaand update method for COUNTDOWN substate
    countdownUpdate = (deltaTime) => {
        //check for countdown timer to be up to queue substate change
        if (this.app.countdownScreen.isFinished) {
            this.subState = 'PLAYING'
            this.app.level.activate()
            this.countdownSubStateContainer.visible = false
            return
        }
        this.app.countdownScreen.update(deltaTime)
    }

    update = (deltaTime) =>{
        if(this.subState === 'COUNTDOWN'){
            this.countdownUpdate(deltaTime)
            
        }
        //playing update plays no matter what, but 
        this.playingUpdate(deltaTime)

    }
    
    onExit = () => {
        console.log('exiting PLAYING state')
        //remove key events
        this.removeKeyEvents()
        //hide main container
        this.container.visible = false
        //hide ui scene as well
        this.app.uiScene.visible = false
        //buuut sub state container has to be set back to visible
        this.countdownSubStateContainer.visible = true
        //reset the sub state back to countdown so it always plays first
        this.subState = 'COUNTDOWN'
        //make sure pause screen visibility is reset to false
        this.app.pauseScreen.mainContainer.visible = false
    }
}

class PausedState {
    constructor(app) { this.app = app }
    
    onEnter = () => {
        console.log('entering PAUSED state')
        this.app.audioManager.pause()
    }

    update = (deltaTime) => {}
    
    onExit = () => {
        console.log('exiting PAUSED state')
        this.app.audioManager.resume()
    }
}

class ResultsState {
    constructor(app) { 
        this.app = app 
        this.container = new THREE.Group()
        this.container.name = 'results state container'
        this.container.add(this.app.resultsScreen.mainContainer)
        this.container.visible = false
        this.app.scene.add(this.container)
    }
    
    onEnter = () => {
        console.log('entering RESULTS state')
        this.addKeyEvents()
        this.app.resultsScreen.displayResults()
        this.container.visible = true
    }

    update = (deltaTime) => {}
    
    onExit = () => {
        this.removeKeyEvents()
        this.container.visible = false
        //since the song/level is over, reset everything:
        //the score in ScoreManager, the ui, and the results screen
        this.app.scoreManager.resetAll()
        this.app.ui.reset()
        this.app.resultsScreen.resetResultsText()
        this.app.audioManager.resetSong()
        this.app.level.reset()
        this.app.countdownScreen.reset()
    }

    pressFToContinueEvent = (e) => {
        if(e.code === 'KeyF'){
            //play sfx
            this.app.audioManager.playSfx("confirmSelection")
            //change state
            this.app.stateMachine.setState(GAME_STATES.TITLE)
        }
    }
    
    addKeyEvents = () => {
        window.addEventListener('keydown', this.pressFToContinueEvent)
    }

    removeKeyEvents = () => {
        window.removeEventListener('keydown', this.pressFToContinueEvent)
    }
}

class GameOverState {
    constructor(app) { 
        this.app = app
        this.container = new THREE.Group()
        this.container.name = 'game over state container'
        this.container.add(this.app.gameOverScreen.mainContainer)
        this.container.visible = false
        this.app.scene.add(this.container)
     }
    
    onEnter = () => {
        console.log('entering GAME_OVER state')
        this.addKeyEvents()
        this.app.audioManager.resetSong()
        //toggle visibility
        this.container.visible = true
        //set up screen
        this.app.gameOverScreen.init()
    }

    update = (deltaTime) => {
        this.app.gameOverScreen.update(deltaTime)
    }
    
    onExit = () => {
        this.container.visible = false
        this.removeKeyEvents()
        this.app.scoreManager.resetAll()
        this.app.ui.reset()
        this.app.level.reset()
        this.app.countdownScreen.reset()
        this.app.audioManager.resetSong()
    }

    pressFToContinueEvent = (e) => {
        if(e.code === 'KeyF'){
            //play sfx
            this.app.audioManager.playSfx("confirmSelection")
            //change state
            this.app.stateMachine.setState(GAME_STATES.TITLE)
        }
    }
    
    addKeyEvents = () => {
        window.addEventListener('keydown', this.pressFToContinueEvent)
    }

    removeKeyEvents = () => {
        window.removeEventListener('keydown', this.pressFToContinueEvent)
    }
}


//=====================================================
//using a factory func here bc app has to be given to these
//=====================================================
export const createGameStates = (app) => ({
    LOADING: new LoadingState(app),
    TITLE: new TitleState(app),
    SONG_SELECT: new SongSelectState(app),
    COUNTDOWN: new CountdownState(app),
    PLAYING: new PlayingState(app),
    PAUSED: new PausedState(app),
    RESULTS: new ResultsState(app),
    GAME_OVER: new GameOverState(app),
})