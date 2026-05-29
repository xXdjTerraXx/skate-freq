import { audioAssetManifest } from './assetManifest'

import Player from './game/Player'
import Level from './game/Level'
import Application from './game/Application'
import Controller from './game/Controller'
import HitManager from './game/HitManager'
import UiManager from './game/UiManager'
import AudioManager from "./game/AudioManager"

import { createGameStates } from './gameStates'
import StateMachine from './game/StateMachine'
import TitleScreen from './game/TitleScreen'
import ScoreManager from './game/ScoreManager'
import ResultsScreen from './game/ResultsScreen'
import GameOverScreen from './game/GameOverScreen'

// const testMap = {
//   patternLengthBeats: 16,
//   patterns: {
//     tapNotes: [
//   // beat 1-4: straight quarter notes center lane
//   { lane: 0, subLane: 1, beat: 1 },
//   { lane: 0, subLane: 1, beat: 2 },
//   { lane: 0, subLane: 1, beat: 3 },
//   { lane: 0, subLane: 1, beat: 4 },

//   // beat 5-8: alternating left and right
//   { lane: 0, subLane: 0, beat: 5 },
//   { lane: 0, subLane: 2, beat: 6 },
//   { lane: 0, subLane: 0, beat: 7 },
//   { lane: 0, subLane: 2, beat: 8 },

//   // beat 9-12: eighth notes center
//   { lane: 0, subLane: 1, beat: 9 },
//   { lane: 0, subLane: 1, beat: 9.5 },
//   { lane: 0, subLane: 1, beat: 10 },
//   { lane: 0, subLane: 1, beat: 10.5 },
//   { lane: 0, subLane: 1, beat: 11 },
//   { lane: 0, subLane: 1, beat: 11.5 },

//   // beat 13-16: mixed pattern
//   { lane: 0, subLane: 0, beat: 13 },
//   { lane: 0, subLane: 1, beat: 13.5 },
//   { lane: 0, subLane: 2, beat: 14 },
//   { lane: 0, subLane: 1, beat: 14.5 },
//   { lane: 0, subLane: 0, beat: 15 },
//   { lane: 0, subLane: 2, beat: 16 },
// ],

//     ramps: [
//       // simple ramps on strong beats
//       { lane: 0, beat: 4 },
//       { lane: 1, beat: 8 },
//       { lane: 2, beat: 12 }
//     ]
//   }
// }


const mainApplication = new Application()
await mainApplication.initGaphicalAssets()

const audioManager = new AudioManager(mainApplication, audioAssetManifest)
await audioManager.loadAllSongs()
//set a particular song as the currently selected song
audioManager.selectSong('testSong3')
// give application a reference to audioManager HERE
mainApplication.audioManager = audioManager

const ui = new UiManager(mainApplication)
ui.init()

const hitManager = new HitManager(mainApplication)

const titleScreen = new TitleScreen(mainApplication)
const resultsScreen = new ResultsScreen(mainApplication)
const gameOverScreen = new GameOverScreen(mainApplication)

//pull the selected song's note map from the selected song in audio manager
const levelNoteMap = audioManager.currentSong.noteMap 
const level = new Level(mainApplication, hitManager, levelNoteMap)

hitManager.init(ui.hitEffectsContainer, level.worldHitFxContainer)

const player = new Player(mainApplication, level)
player.init()

level.setPlayer(player)

const controller = new Controller(mainApplication, level, player, hitManager)
controller.init()

const scoreManager = new ScoreManager(mainApplication)

//this setup function just gives the main app all the rest of the modules it needs
mainApplication.setup(level, player, controller, hitManager, ui, titleScreen, scoreManager, resultsScreen, gameOverScreen)

//createGameStates returns a state object with all the state's inited
const gameStatesDictionary = createGameStates(mainApplication)

mainApplication.stateMachine = new StateMachine(mainApplication, gameStatesDictionary)

mainApplication.start()