import * as THREE from 'three'
import { levelConfig } from '../config'
import PlayerRing from './PlayerRing';
import AnimationManager from './PlayerAnimationManager';
import ENUMS from '../enums';

export default class Player {
  constructor(app, level) {
    this.app = app
    this.level = level
    this.initialZPosition = levelConfig.PLAYER_Z_VALUE

    this.mainPlayerContainer = new THREE.Group()
    this.mainPlayerContainer.name = 'player container'

    //the stationary ring that stays where the player is
    this.playerRing = new PlayerRing(app)
    this.playerRing.init(this.initialZPosition, this.mainPlayerContainer)

    //GEOMETRY
    this.geometry = new THREE.SphereGeometry(0.05, 16, 16)
    //MATERIAL
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ffff
    })
    //MESH
    this.mesh = new THREE.Mesh(this.geometry, this.material)


    ////CHARACTER SETUP
    //later this value will come from character select ^-^
    this.gltf = this.app.assetManager.getAsset('character', 'djTerra')
    // the actual 3D model lives in gltf.scene
    this.characterModel = this.gltf.scene
    //scale and rotate
    this.characterModel.rotation.x = -Math.PI / 2
    this.characterModel.rotation.z = Math.PI / 2
    this.characterModel.scale.set(.5, .5, .5)
    // set up the animation mixer
    this.mixer = new THREE.AnimationMixer(this.characterModel)
    // store the animations by name so you can access them easily
    this.animationsDict = {}
    this.gltf.animations.forEach((clip) => {
      console.log('DEBUG DEBUGanimation clip name:', clip.name)
        this.animationsDict[clip.name] = this.mixer.clipAction(clip)
    })

    ///////////~*~*~*~*~*~OLD ANIMATION CODE~*~*~*~*~*~///////////
    // //set idle so that it plays through and holds
    // this.animationsDict['crouch'].setLoop(THREE.LoopOnce)
    // this.animationsDict['crouch'].clampWhenFinished = true
    // //set default current animation
    // this.currentAnimation = this.animationsDict['idle']
    // //set last animation same as current initially
    // this.lastAnimation = this.currentAnimation
    // // play idle by default
    // this.animationsDict['idle'].play()
    // attach the character model to the sphere
    //////////////////////////////////////////////////////////////

    // so it follows all the spheres movement automatically
    this.mesh.add(this.characterModel)
    //put mesh in layer 1 - NO BLOOM
    this.mesh.layers.set(1)
    //character model too. but this has to be done with this traverse method
    this.characterModel.traverse(child => {
        if(child.isMesh){
            child.layers.set(1)
        }
    })

    //~~~~~*****~~~~~~!!!  TO DOO   !!!~~~~~~******~~~~
    //this light currently needed because of glb file setting or something asdfas
    const ambientLight = new THREE.AmbientLight(0xffffff, 5)
    //light has to be ENABLED on layer 1 to illuminate objects on that layer
    //light now works on objects on layers 0 (by default) and 1
    ambientLight.layers.set(1)
    this.app.scene.add(ambientLight)

    // POSITIONING
    //measurement of one 'side'
    this.laneAngle = (Math.PI * 2) / levelConfig.LANE_COUNT
    // match tunnel radius
    this.radius = levelConfig.TUNNEL_RADIUS 
    this.baseRadius = levelConfig.TUNNEL_RADIUS 
    // position around tunnel, accounting for level.zRotationOffset which
    //is an offset so that the level is centered on a side intead of vertex
    this.angle = this.level.playerCurrentLane * this.laneAngle
   
    //physics
    this.gravity = levelConfig.WORLD_GRAVITY
    this.friction = levelConfig.WORLD_FRICTION

    //JUMP/CROUCH STUFF
    //used to prevent multiple jump/crouch press
    this.isCrouching = false
    this.isInAir = false
    this.airStartTime = null
    this.landingTime = null
    this.MAX_JUMP_HEIGHT = levelConfig.PLAYER_MAX_JUMP_HEIGHT
    this.DEFAULT_JUMP_HEIGHT = levelConfig.PLAYER_DEFAULT_JUMP_HEIGHT
    this.jumpHeight = this.DEFAULT_JUMP_HEIGHT
    this.jumpVelocity = 0
    //jump offset is distance from ground  
    this.jumpOffset = 0

    //GRIND STUFF
    this.isGrinding = false
    this.grindStartTime = null
    this.grindDuration = null
    this.grindDuration = null

    //player movement within a lane
    this.isMoving = false
    //direction set by controller
    this.direction = 0
    this.laneOffset = 0
    this.laneOffsetVelocity = 0
    

    //NEW SUB LANE STUFF
    this.subLane = 1 // 0 = left, 1 = center, 2 = right
    this.maxLaneOffset = ((Math.PI * 2) / levelConfig.LANE_COUNT) / 3 * 0.99 
    this.subLaneOffsets = [
      -this.maxLaneOffset, 0, this.maxLaneOffset
    ]
    this.targetLaneOffset = 0 
    
    //PULSING ON KEY PRESS
    this.isPulsing = false
    //the maximum scale the player gets when pulsed
    this.pulseMaxScale = 1.4
    //baseScale is just the default scale - 1
    this.baseScale = 1


    //place player on inner wall of tunnel
    this.updatePosition()
  }

  init = () => {
    //set initial position
    this.mesh.position.set(0, -this.radius, this.initialZPosition)
    //add player to container and container to scene
    this.mainPlayerContainer.add(this.mesh)
    this.level.mainLevelContainer.add(this.mainPlayerContainer)
    // this.app.scene.add(this.mainPlayerContainer)
    this.animationManager = new AnimationManager(this.mixer, this.animationsDict)
  }

  pulse = () => {
    this.pulseAmount = .4  
    this.isPulsing = true
  }

  handleCrouch = () => {
    if(!this.isCrouching){
      this.isCrouching = true
      if(this.isGrinding)this.playAnimation(ENUMS.ANIMATIONS.GRIND_CROUCH)
      else this.playAnimation(ENUMS.ANIMATIONS.CROUCH)
    }  
  }

  //this function basically just sets isCrouching to false and isInAir to true and
  //sets the jump velocity so that updatePosition in update will move the player up
  // handleJump = () => {
  //   //stop crouching
  //   this.isCrouching = false
  //   if(!this.isInAir){
  //     this.isInAir = true
  //     this.jumpVelocity = this.TARGET_JUMP_VELOCITY
  //   }
  //   this.playAnimation('jump')
  // }

  launch = (launchTime, landingTime, jumpHeight = this.DEFAULT_JUMP_HEIGHT) => {
    this.isCrouching = false
    this.isInAir = true
    this.airStartTime = launchTime
    this.landingTime = landingTime
    this.jumpHeight = jumpHeight
    if(this.isGrinding) this.playAnimation(ENUMS.ANIMATIONS.GRIND_JUMP)
    else this.playAnimation(ENUMS.ANIMATIONS.JUMP)
  }

  updateJumpArc = () => {
      if (!this.isInAir) return

      if (this.app.level.currentTime >= this.landingTime) {
          this.jumpOffset = 0
          this.isInAir = false
          console.log("PLAYER JUST LANDED", this.isInAir)
          if (!this.isGrinding) {
            this.playAnimation(ENUMS.ANIMATIONS.IDLE)
          }
          return
      }

      const totalAirTime = this.landingTime - this.airStartTime
      const elapsed = this.app.level.currentTime - this.airStartTime
      const t = elapsed / totalAirTime  // 0 to 1

      const RISE_PORTION = 0.35  // rise takes 35% of air time, fall takes 65%

      if (t < RISE_PORTION) {
          // rising — ease out (fast start, slow finish into the float)
          const riseT = t / RISE_PORTION
          this.jumpOffset = this.jumpHeight * (1 - Math.pow(1 - riseT, 2))
      } else {
          // falling — ease in hard (slow start, fast snap down)
          const fallT = (t - RISE_PORTION) / (1 - RISE_PORTION)
          this.jumpOffset = this.jumpHeight * (1 - Math.pow(fallT, 3))
      }
  }

  grind = (grindStartTime, grindEndTime, grindDuration) => {
    if(!this.isGrinding)this.isGrinding = true
    this.grindStartTime = grindStartTime
    this.grindEndTime = grindEndTime
    this.grindDuration = grindDuration
    console.log('PLAYING GRIND ANIMATION FROM GRIND')
    this.playAnimation(ENUMS.ANIMATIONS.GRIND_ENTER, {returnTo: ENUMS.ANIMATIONS.GRIND_HOLD})
  }

  updateGrind = (wKeyIsHeld) => {
    if(wKeyIsHeld === false) {
      this.isGrinding = false
      this.grindStartTime = null
      this.grindDuration = null
      this.playAnimation(ENUMS.ANIMATIONS.IDLE)
    }
    else if(this.animationManager.currentAnimation !== this.animationsDict[ENUMS.ANIMATIONS.GRIND]){
      this.playAnimation(ENUMS.ANIMATIONS.GRIND_HOLD)
    }
  }

  resync = () => {
    //TO DO
    //MANUAL ANIMATION
    this.playAnimation(ENUMS.ANIMATIONS.IDLE)
  }

  setSubLane = (index) => {
    this.isInAir = false
    this.jumpOffset = 0

    this.subLane = index
    this.targetLaneOffset = this.subLaneOffsets[index]

    //TO DO: MOVE THIS TO ANIMATION MANAGER
    //play alternate pumping every key press
    if(this.animationManager.lastAnimation === this.animationsDict[ENUMS.ANIMATIONS.PUMPR]) {
      this.playAnimation(ENUMS.ANIMATIONS.PUMPL, {returnTo: ENUMS.ANIMATIONS.PUMPR}, {cossfadeDuration: 0.01})
    }
      else this.playAnimation(ENUMS.ANIMATIONS.PUMPR, {returnTo: ENUMS.ANIMATIONS.PUMPL}, {cossfadeDuration: 0.01})
  }

  updateMovement = (deltaTime) => {
    const lerpFactor = 1 - Math.pow(0.001, deltaTime)
    this.laneOffset += (this.targetLaneOffset - this.laneOffset) * lerpFactor
  }

  updatePosition = () => {
    //final angle is angle but with laneOffset for movement
    const finalAngle = this.angle + this.laneOffset

    const effectiveRadius = this.baseRadius - this.jumpOffset

    const x = Math.cos(finalAngle) * effectiveRadius
    const y = Math.sin(finalAngle) * effectiveRadius
    this.mesh.position.set(x, y, this.initialZPosition + .2)
  }

  slamDown = () => {
    //final angle is angle but with laneOffset for movement
    if (!this.isInAir) return
    this.isInAir = false
    this.jumpOffset = 0
    //slam one shot later???
    this.playAnimation(ENUMS.ANIMATIONS.IDLE) 
  }

  onBeat = (beatInBar) => {
    // console.log("BEAT!", beatInBar)
    this.playerRing.pulse(beatInBar)
  }

  // playAnimation = (name, crossfadeDuration = 0.1) => {
  //   //store upcoming animation
  //   const next = this.animations[name]
  //   if (!next ) return
  //   //and save the current one as the last one
  //   this.lastAnimation = this.currentAnimation
    
  //   if (this.currentAnimation) {
  //       this.currentAnimation.crossFadeTo(next, crossfadeDuration, true)
  //   }
    
  //   next.reset().play()
  //   this.currentAnimation = next

  //   // only set return-to-idle timeout for pump animations
  //   // if (name !== 'idle') {
  //   //     clearTimeout(this.pumpTimeout)
  //   //     this.pumpTimeout = setTimeout(() => {
  //   //         if(!this.isCrouching && !this.isInAir)this.playAnimation('idle')
  //   //     }, 500)
  //   // }
  // }

  playAnimation = (name, options = {}) => {
    this.animationManager.transitionTo(name, options)
  }

  update = (deltaTime) => {
    if(this.isGrinding)console.log('BROOOOOOOOO UR GRINDING BROOO')
    // this.updateJumpPhysics()
    this.updateJumpArc()

    this.updateMovement(deltaTime)

    //animations
    if (this.animationManager) this.animationManager.update(deltaTime)

    this.updatePosition()

    //update player ring
    this.playerRing.update()

    if(this.isPulsing){
      //stuff for pulsing on key press
      this.pulseAmount *= Math.pow(0.01, deltaTime)
      // this.pulseAmount *= 0.9
      const eased = this.pulseAmount * this.pulseAmount
      this.currentScale = this.baseScale + (this.pulseMaxScale - this.baseScale) * eased
      if (this.pulseAmount < 0.01) {
        this.isPulsing = false
      }
    }
    else this.currentScale = this.baseScale
    this.mesh.scale.set(this.currentScale, this.currentScale, this.currentScale)
  }
}

