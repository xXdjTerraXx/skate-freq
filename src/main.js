import assetManifest from "./assetManifest"

import Player from './game/Player'
import Level from './game/Level'
import Application from './game/Application'
import Controller from './game/Controller'
import HitManager from './game/HitManager'
import UiSpace from './game/UiSpace'
import AudioManager from "./game/AudioManager"

const testMap = {
  levelMap: [
  // --- Phrase A (stay in lane 1) ---
  { beat: 1, lane: 1 },
  { beat: 2, lane: 1 },
  { beat: 3, lane: 1 },
  { beat: 4, lane: 1 },

  { beat: 5, lane: 1 },
  { beat: 6, lane: 1 },
  { beat: 7, lane: 1 },
  { beat: 7.5, lane: 1 }, // little rhythmic spice

  // --- Phrase B (introduce choice) ---
  { beat: 9, lane: 1 },
  { beat: 10, lane: 1 },

  // 👇 optional switch moment
  { beat: 11, lane: 2 },

  // return or commit
  { beat: 12, lane: 1 },
  { beat: 13, lane: 1 },

  // 👇 second opportunity (risk/reward feel)
  { beat: 14, lane: 3 },

  { beat: 15, lane: 1 },
  { beat: 15.5, lane: 1 }

  ],
  patternLengthBeats: 16
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

const controller = new Controller(level, player)
controller.init()

window.addEventListener('keydown', (e) => {
  if(e.code === 'KeyF'){
    //start eeeeverything
    mainApplication.start(level, player, controller, hitManager, ui, audioManager)
  }
})
