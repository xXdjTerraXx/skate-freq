import * as THREE from 'three'

export default class Application{
  constructor(){
    // SCENE setup
    this.scene = new THREE.Scene()
    // CAMERA setup
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    )
    //RENDERER setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    
  }

  init = () => {
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
  }

  start = (level, player, controller) => {
    this.level = level
    this.player = player
    this.controller = controller
    this.masterUpdate()
  }

  masterUpdate = () => {
    requestAnimationFrame(() => this.masterUpdate())
    //call controller run func
    this.controller.run()
    //call the level's update func
    this.level.update()
    //update player
    this.player.update()

    //RENDER
    this.renderer.render(this.scene, this.camera)
  }
}