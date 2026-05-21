import assetManifest from "./assetManifest"

import Player from './game/Player'
import Level from './game/Level'
import Application from './game/Application'
import Controller from './game/Controller'
import HitManager from './game/HitManager'
import UiSpace from './game/UiSpace'
import AudioManager from "./game/AudioManager"

// const testMap = {
//     patterns:{
//       tapNotes: [
//       ],
//       ramps: [
//         // --- Phrase A (stay in lane 1) ---
//         { beat: 1, lane: 1 },
//         { beat: 2, lane: 1 },
//         { beat: 3, lane: 1 },
//         { beat: 4, lane: 1 },

//         { beat: 5, lane: 1 },
//         { beat: 6, lane: 1 },
//         { beat: 7, lane: 1 },
//         { beat: 7.5, lane: 1 }, // little rhythmic spice

//         // --- Phrase B (introduce choice) ---
//         { beat: 9, lane: 1 },
//         { beat: 10, lane: 1 },

//         // 👇 optional switch moment
//         { beat: 11, lane: 2 },

//         // return or commit
//         { beat: 12, lane: 1 },
//         { beat: 13, lane: 1 },

//         // 👇 second opportunity (risk/reward feel)
//         { beat: 14, lane: 3 },

//         { beat: 15, lane: 1 },
//         { beat: 15.5, lane: 1 }

//       ]
//     },
//   patternLengthBeats: 16
// }
const testMap = {
  patternLengthBeats: 16,
  patterns: {
    tapNotes: [
      // --- LANE 0: Rhythm (quarter notes) ---
      { lane: 0, subLane: 1, time: 4 * 0.6667 },
  { lane: 0, subLane: 1, time: 5 * 0.6667 },
  { lane: 0, subLane: 1, time: 6 * 0.6667 },
  { lane: 0, subLane: 1, time: 7 * 0.6667 },

  { lane: 0, subLane: 1, time: 8 * 0.6667 },
  { lane: 0, subLane: 1, time: 9 * 0.6667 },
  { lane: 0, subLane: 1, time: 10 * 0.6667 },
  { lane: 0, subLane: 1, time: 11 * 0.6667 },

  // --- LANE 1: Groove (off-beats) ---
  { lane: 0, subLane: 0, time: 4.5 * 0.6667 },
  { lane: 0, subLane: 2, time: 5.5 * 0.6667 },
  { lane: 0, subLane: 0, time: 6.5 * 0.6667 },
  { lane: 0, subLane: 2, time: 7.5 * 0.6667 },

  { lane: 0, subLane: 0, time: 8.5 * 0.6667 },
  { lane: 0, subLane: 2, time: 9.5 * 0.6667 },
  { lane: 0, subLane: 0, time: 10.5 * 0.6667 },
  { lane: 0, subLane: 2, time: 11.5 * 0.6667 },

  // --- LANE 2: Lead (sparse hits) ---
  { lane: 2, subLane: 1, time: 6 * 0.6667 },
  { lane: 2, subLane: 2, time: 7 * 0.6667 },

  { lane: 2, subLane: 0, time: 10 * 0.6667 },
  { lane: 2, subLane: 1, time: 11 * 0.6667 }
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
await mainApplication.init()

const audioManager = new AudioManager(mainApplication)

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

window.addEventListener('keydown', (e) => {
  if(e.code === 'KeyF'){
    //start eeeeverything
    mainApplication.start(level, player, controller, hitManager, ui, audioManager)
  }
})
