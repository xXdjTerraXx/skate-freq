import Player from './game/Player';
import Level from './game/Level';
import Application from './game/Application';
import Controller from './game/Controller';


//everything kicks off here bruv :3
const mainApplication = new Application()
mainApplication.init()

const player = new Player(mainApplication)
player.init()

const level = new Level(mainApplication)
level.init()
level.setPlayer(player)
level.animate();

const controller = new Controller(level)
controller.init()