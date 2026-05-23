import { audioAssetManifest } from './assetManifest'

import Player from './game/Player'
import Level from './game/Level'
import Application from './game/Application'
import Controller from './game/Controller'
import HitManager from './game/HitManager'
import UiSpace from './game/UiSpace'
import AudioManager from "./game/AudioManager"

import { createGameStates } from './gameStates'

const testMap = {
  patternLengthBeats: 16,
  patterns: {
    tapNotes: [
  // beat 1-4: straight quarter notes center lane
  { lane: 0, subLane: 1, beat: 1 },
  { lane: 0, subLane: 1, beat: 2 },
  { lane: 0, subLane: 1, beat: 3 },
  { lane: 0, subLane: 1, beat: 4 },

  // beat 5-8: alternating left and right
  { lane: 0, subLane: 0, beat: 5 },
  { lane: 0, subLane: 2, beat: 6 },
  { lane: 0, subLane: 0, beat: 7 },
  { lane: 0, subLane: 2, beat: 8 },

  // beat 9-12: eighth notes center
  { lane: 0, subLane: 1, beat: 9 },
  { lane: 0, subLane: 1, beat: 9.5 },
  { lane: 0, subLane: 1, beat: 10 },
  { lane: 0, subLane: 1, beat: 10.5 },
  { lane: 0, subLane: 1, beat: 11 },
  { lane: 0, subLane: 1, beat: 11.5 },

  // beat 13-16: mixed pattern
  { lane: 0, subLane: 0, beat: 13 },
  { lane: 0, subLane: 1, beat: 13.5 },
  { lane: 0, subLane: 2, beat: 14 },
  { lane: 0, subLane: 1, beat: 14.5 },
  { lane: 0, subLane: 0, beat: 15 },
  { lane: 0, subLane: 2, beat: 16 },
],

    ramps: [
      // simple ramps on strong beats
      { lane: 0, beat: 4 },
      { lane: 1, beat: 8 },
      { lane: 2, beat: 12 }
    ]
  }
}


const mainApplication = new Application()

//createGameStates returns a state object with all the state's inited
const gameStatesDictionary = createGameStates(mainApplication)
//then pass it to the app
await mainApplication.init()

const audioManager = new AudioManager(mainApplication, audioAssetManifest)
await audioManager.loadAllSongs()
//set a particular song as the currently selected song
audioManager.selectSong('testSong3')

// give application a reference to audioManager HERE
mainApplication.audioManager = audioManager

const ui = new UiSpace(mainApplication)
ui.init()

const hitManager = new HitManager(mainApplication)

const level = new Level(mainApplication, hitManager, testMap)
level.init()

hitManager.init(ui.hitEffectsContainer, level.worldHitFxContainer)

const player = new Player(mainApplication, level)
player.init()

level.setPlayer(player)

const controller = new Controller(mainApplication, level, player)
controller.init()

mainApplication.setup(level, player, controller, hitManager, ui, gameStatesDictionary)

window.addEventListener('keydown', (e) => {
  if(e.code === 'KeyF'){
    //start eeeeverything
    mainApplication.start()
  }
})
