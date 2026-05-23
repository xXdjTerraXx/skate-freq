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
    }

    update = (deltaTime) => {
        console.log("DEBUG: TITLE SCREEN UPDATE")
    }
    
    onExit = () => {
        this.removeKeyEvents()
        this.container.visible = false
    }

    titleKeyEvent = (e) => {
            if(e.code === 'KeyF'){
                //start eeeeverything
                this.app.stateMachine.setState(GAME_STATES.PLAYING)
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
    constructor(app) { this.app = app }
    
    onEnter = () => {
        console.log('entering SONG_SELECT state')
    }

    update = (deltaTime) => {}
    
    onExit = () => {}
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
        this.container.add(this.app.level.mainLevelContainer)
        this.container.add(this.app.ui.mainContainer)
        this.container.visible = false
        this.app.scene.add(this.container)
    }
    
    onEnter = () => {
        console.log('entering PLAYING state')
        //toggle visibility
        this.container.visible = true
        //play song
        this.app.audioManager.playSong('testSong2')
    }

    update = (deltaTime) => {
        this.app.controller.run(deltaTime)
        this.app.player.update(deltaTime)
        this.app.level.update(deltaTime)
        this.app.hitManager.update(deltaTime)

        // check if song ended
        if (this.app.audioManager.isFinished()) {
            this.app.stateMachine.setState(GAME_STATES.RESULTS)
        }
    }
    
    onExit = () => {
        console.log('exiting PLAYING state')
        this.container.visible = false
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
    constructor(app) { this.app = app }
    
    onEnter = () => {
        console.log('entering RESULTS state')
        // show score screen
    }

    update = (deltaTime) => {}
    
    onExit = () => {}
}

class GameOverState {
    constructor(app) { this.app = app }
    
    onEnter = () => {
        console.log('entering GAME_OVER state')
        this.app.audioManager.pause()
    }

    update = (deltaTime) => {}
    
    onExit = () => {}
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