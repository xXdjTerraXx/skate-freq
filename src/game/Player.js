import * as THREE from 'three'
import { levelConfig } from '../config'
import PlayerRing from './PlayerRing';

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
    this.animations = {}
    this.gltf.animations.forEach((clip) => {
      console.log('DEBUG DEBUGanimation clip name:', clip.name)
        this.animations[clip.name] = this.mixer.clipAction(clip)
    })
    //set idle so that it plays through and holds
    this.animations['crouch'].setLoop(THREE.LoopOnce)
    this.animations['crouch'].clampWhenFinished = true
    //set default current animation
    this.currentAnimation = this.animations['idle']
    //set last animation same as current initially
    this.lastAnimation = this.currentAnimation
    // play idle by default
    this.animations['idle'].play()
    // attach the character model to the sphere
    // so it follows all the spheres movement automatically
    this.mesh.add(this.characterModel)

    //~~~~~*****~~~~~~!!!  TO DOO   !!!~~~~~~******~~~~
    //this light currently needed because of glb file setting or something asdfas
    const ambientLight = new THREE.AmbientLight(0xffffff, 2)
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
    this.isJumping = false
    //value of jump velocity when plyr hits actually jumps. never changes
    this.TARGET_JUMP_VELOCITY = .09
    //
    this.jumpVelocity = 0
    //jump offset is distance from ground  
    this.jumpOffset = 0

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
  }

  pulse = () => {
    this.pulseAmount = .4  
    this.isPulsing = true
  }

  //JUMP SYSTEM EXPLAINED:
  //1. player hits spacebar
  //2. the "isJumping" variable gets set to true
  //3. "jumpVelocity" gets set to the constant value "TARGET_JUMP_VELOCITY"
  //4. "isJumping" being true now allows "updateJumpPhysics" func to run
  //5. in that func, "gravity" slows "jumpVeloctity" a bit every time it runs
  //6. "jumVelocity" gets added to "jumpOffset" variable, which is added to "baseRadius"
  //7.  the value of that is the new radius - how far the player is from center
  //8. ????
  //9. profit
  jump = () => {
    //stop crouching
    this.isCrouching = false
    if(!this.isJumping){
      this.isJumping = true
      this.jumpVelocity = this.TARGET_JUMP_VELOCITY
    }
    this.playAnimation('crouch')
  }

  updateJumpPhysics = () => {
    if (this.isJumping) {
      //jump velocity slowed over time by gravity
      this.jumpVelocity += this.gravity
      this.jumpOffset += this.jumpVelocity 
      //landing check
      if (this.jumpOffset <= 0) {
        this.jumpOffset = 0
        this.jumpVelocity = 0
        this.isJumping = false
      }
    }
  }

  setSubLane = (index) => {
    this.subLane = index
    this.targetLaneOffset = this.subLaneOffsets[index]

    //play a pumping animation - left for left lane, right for right
    // if (index === 0) this.playAnimation('pump_LL')
    // else if (index === 2) this.playAnimation('pump_RR')
    // // center alternates, handle this next
    // else {
    //   if(this.lastAnimation === this.animations['pump_RR']) this.playAnimation('pump_LL')
    //   else this.playAnimation('pump_RR')
    // } 

    //TESTING THIS: play alternate pumping every key press
    if(this.lastAnimation === this.animations['pump_RR']) this.playAnimation('pump_LL')
      else this.playAnimation('pump_RR')
  }

  updateMovement = (deltaTime) => {
    const lerpFactor = 1 - Math.pow(0.001, deltaTime)
    this.laneOffset += (this.targetLaneOffset - this.laneOffset) * lerpFactor

    // this.mesh.rotation.z = (this.targetLaneOffset - this.laneOffset) * 10
  }

  updatePosition = () => {
    //final angle is angle but with laneOffset for movement
    const finalAngle = this.angle + this.laneOffset

    const effectiveRadius = this.baseRadius - this.jumpOffset

    const x = Math.cos(finalAngle) * effectiveRadius
    const y = Math.sin(finalAngle) * effectiveRadius
    this.mesh.position.set(x, y, this.initialZPosition)
  }

  onBeat = (beatInBar) => {
    // console.log("BEAT!", beatInBar)
    this.playerRing.pulse(beatInBar)
  }

  playAnimation = (name, crossfadeDuration = 0.1) => {
    //store upcoming animation
    const next = this.animations[name]
    if (!next ) return
    //and save the current one as the last one
    this.lastAnimation = this.currentAnimation
    
    if (this.currentAnimation) {
        this.currentAnimation.crossFadeTo(next, crossfadeDuration, true)
    }
    
    next.reset().play()
    this.currentAnimation = next

    // only set return-to-idle timeout for pump animations
    // if (name !== 'idle') {
    //     clearTimeout(this.pumpTimeout)
    //     this.pumpTimeout = setTimeout(() => {
    //         if(!this.isCrouching && !this.isJumping)this.playAnimation('idle')
    //     }, 500)
    // }
}

  handleCrouch = () => {
    if(!this.isCrouching){
      this.playAnimation('crouch')
      this.isCrouching = true
    }  
  }


  update = (deltaTime) => {
    this.updateJumpPhysics()
    // if(this.isMoving !== false){this.updateMovement(deltaTime)}
    this.updateMovement(deltaTime)

    //animations
    if (this.mixer) this.mixer.update(deltaTime)

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

