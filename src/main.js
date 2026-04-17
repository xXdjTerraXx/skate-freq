import assetManifest from "./assetManifest"

import Player from './game/Player'
import Level from './game/Level'
import Application from './game/Application'
import Controller from './game/Controller'
import HitManager from './game/HitManager'
import UiSpace from './game/UiSpace'



const mainApplication = new Application()
await mainApplication.init()

const ui = new UiSpace(mainApplication)
ui.init()

const hitManager = new HitManager(mainApplication)

const level = new Level(mainApplication, hitManager)
level.init()

hitManager.init(ui.hitEffectsContainer, level.worldHitFxContainer)

const player = new Player(mainApplication, level)
player.init()

const controller = new Controller(level, player)
controller.init()

//start eeeeverything
mainApplication.start(level, player, controller, hitManager, ui)