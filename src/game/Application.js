import * as THREE from 'three'
import { levelConfig } from '../config'
import AssetManager from './AssetManager'
import assetManifest from '../assetManifest'

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
    //RENDERER setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    this.clock = new THREE.Clock()
    
    this.masterGameContainer = new THREE.Group()
    this.masterGameContainer.name = 'master game container'

    this.assetManager = new AssetManager(assetManifest)
  }

  init = async () => {
    //position the camera
    this.camera.position.z = 2
    //size the renderer and append to dom
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)

    // --- RESIZE HANDLING ---
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    })

    await this.assetManager.loadAllAssets()
  }

  start = (level, player, controller, hitManager, ui) => {
    this.level = level
    this.player = player
    this.controller = controller
    this.hitManager = hitManager
    this.ui = ui

    //add level, player, and ui to masterGameContainer
    this.masterGameContainer.add(this.level.mainLevelContainer)
    this.masterGameContainer.add(this.ui.mainContainer)
    //add masterGameContainer to scene and start the main update chain
    this.scene.add(this.masterGameContainer)
    this.masterUpdate()
  }

  masterUpdate = () => {
    requestAnimationFrame(this.masterUpdate)

    const deltaTime = this.clock.getDelta()

    //call controller run func
    this.controller.run(deltaTime)
    //update player
    this.player.update(deltaTime)
    //call the level's update func
    this.level.update(deltaTime)
    //hit manager update
    this.hitManager.update(deltaTime)
    

    //RENDER
    this.renderer.render(this.scene, this.camera)
  }
}