import * as THREE from 'three'
import { levelConfig } from '../config'
import AssetManager from './AssetManager'
import { graphicsAssetManifest } from "../assetManifest"
import StateMachine from './StateMachine'
import { GAME_STATES } from '../gameStates'

export default class Application{
  constructor(){
    // SCENE setup
    this.scene = new THREE.Scene()
    this.scene.name = 'scene'
    // CAMERA setup
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    )

    //position the camera
    this.camera.position.z = 2
    this.camera.position.y = .5
    //little bit of downward titl
    this.camera.rotation.x = -0.2
    //size the renderer and append to dom

    //RENDERER setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
    
    //add a clock
    this.clock = new THREE.Clock()
    
    // --- RESIZE HANDLING ---
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })

  }

  initGaphicalAssets = async () => {
    this.assetManager = new AssetManager(graphicsAssetManifest)
    await this.assetManager.loadAllAssets()
  }

   setup = (level, player, controller, hitManager, ui, titleScreen, scoreManager, resultsScreen, gameOverScreen, songSelectScreen) => {
    this.level = level
    this.player = player
    this.controller = controller
    this.hitManager = hitManager
    this.ui = ui
    this.titleScreen = titleScreen
    this.scoreManager = scoreManager
    this.resultsScreen = resultsScreen
    this.gameOverScreen = gameOverScreen
    this.songSelectScreen = songSelectScreen
  }

  start = () => {
    console.log("kicking it all off...")
    this.stateMachine.setState(levelConfig.INITIAL_GAME_STATE)
    this.masterUpdate()
  }

  masterUpdate = () => {
    requestAnimationFrame(this.masterUpdate)

    const deltaTime = this.clock.getDelta()

    //run the update function of the current state
    this.stateMachine.update(deltaTime)

    //RENDER
    this.renderer.render(this.scene, this.camera)
  }
}