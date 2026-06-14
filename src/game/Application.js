import * as THREE from 'three'
import { levelConfig } from '../config'
import AssetManager from './AssetManager'
import { graphics2DAssetManifest, graphics3DAssetManifest } from "../assetManifest"
import StateMachine from './StateMachine'
import { GAME_STATES } from '../gameStates'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'

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
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    // this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)


    //BLOOM COMPOSER
    //composers basically sit in between renderer and where its final output is
    //basically just a list of passes that make a pipeline to add postprcessing
    //effects
    this.bloomComposer = new EffectComposer(this.renderer)
    this.bloomComposer.renderToScreen = false 
    // this.renderer.toneMapping = THREE.ReinhardToneMapping
    //render pass sorta takes a pic of everything in the scene
    const renderPass = new RenderPass(this.scene, this.camera)
    this.bloomComposer.addPass(renderPass)
    //then bloom pass adds bloom to it
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        levelConfig.GRAPHICS.BLOOM.STRENGTH,   // strength
        levelConfig.GRAPHICS.BLOOM.RADIUS,   // radius
        levelConfig.GRAPHICS.BLOOM.THRESHOLD    // threshold
    )
    this.bloomComposer.addPass(bloomPass)

    //COMPOSITE SHADER
    const compositingShader = {
    uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
            gl_FragColor = (texture2D(baseTexture, vUv) + vec4(1.0) * texture2D(bloomTexture, vUv));
        }
    `
}

    
    //FINAL COMPOSER
    //shader pass used in the finalComposer to combine the glow and
    // normal layers
    this.shaderPass = new ShaderPass(compositingShader, 'baseTexture')

this.shaderPass.needsSwap = true

    this.finalComposer = new EffectComposer(this.renderer)
    this.finalComposer.addPass(new RenderPass(this.scene, this.camera))
    this.finalComposer.addPass(this.shaderPass)


    //////////possibly old code here/////////
    // // COMPOSER setup
    // this.composer = new EffectComposer(this.renderer)
    // this.composer.setSize(window.innerWidth, window.innerHeight)

    // const renderPass = new RenderPass(this.scene, this.camera)
    // this.composer.addPass(renderPass)

    // const bloomPass = new UnrealBloomPass(
    //   new THREE.Vector2(window.innerWidth, window.innerHeight),
    //   0.8,  // strength
    //   0.4,  // radius
    //   0.88  // threshold
    // )
    // this.composer.addPass(bloomPass)
    
    //add a clock
    this.clock = new THREE.Clock()
    
    // --- RESIZE HANDLING ---
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.bloomComposer.setSize(window.innerWidth, window.innerHeight)
      this.finalComposer.setSize(window.innerWidth, window.innerHeight)
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
    // render bloom layer (layer 0 only)
    this.camera.layers.set(0)
    this.bloomComposer.render()

    // update bloom texture uniform AFTER bloom has rendered
    this.shaderPass.uniforms['bloomTexture'].value = this.bloomComposer.renderTarget2.texture

    // render everything normally and composite bloom on top
    this.camera.layers.enable(0)
    this.camera.layers.enable(1)
    this.finalComposer.render()
  }
}