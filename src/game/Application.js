import * as THREE from 'three'
import { levelConfig } from '../config'
import AssetManager from './AssetManager'
import { graphics2DAssetManifest, graphics3DAssetManifest } from "../assetManifest"
import StateMachine from './StateMachine'
import { GAME_STATES } from '../gameStates'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'

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
    // COMPOSER setup
    this.composer = new EffectComposer(this.renderer)
    this.composer.setSize(window.innerWidth, window.innerHeight)

    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,  // strength
      0.4,  // radius
      0.88  // threshold
    )
    this.composer.addPass(bloomPass)
    
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
    this.assetManager = new AssetManager(graphics2DAssetManifest, graphics3DAssetManifest)
    await this.assetManager.loadAllAssets()
  }

   setup = (level, player, controller, hitManager, ui, titleScreen, scoreManager, resultsScreen, gameOverScreen, songSelectScreen, countdownScreen, pauseScreen) => {
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
    this.countdownScreen = countdownScreen
    this.pauseScreen = pauseScreen
  }

  start = () => {
    console.log("kicking it all off...")
    this.stateMachine.setState(levelConfig.INITIAL_GAME_STATE)
    //DEBUG AXES HELPER
    // const axesHelper = new THREE.AxesHelper(5)
    // this.scene.add(axesHelper)
    /////////
    this.masterUpdate()
  }

  masterUpdate = () => {
    requestAnimationFrame(this.masterUpdate)

    const deltaTime = this.clock.getDelta()

    //run the update function of the current state
    this.stateMachine.update(deltaTime)

    //RENDER
    // this.renderer.render(this.scene, this.camera)
    //use composter isntead of renderer for post fx
    this.composer.render()
  }
}