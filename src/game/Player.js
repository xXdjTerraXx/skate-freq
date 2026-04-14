import * as THREE from 'three'
import { levelConfig } from '../config'
import PlayerRing from './PlayerRing';

export default class Player {
  constructor(app) {
    this.app = app

    this.initialZPosition = .2

    this.mainPlayerContainer = new THREE.Group()

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

    // POSITIONING
    // match tunnel radius
    this.radius = levelConfig.TUNNEL_RADIUS 
    this.baseRadius = levelConfig.TUNNEL_RADIUS 

    // position around tunnel   
    this.angle = -1.5  

    //physics
    this.gravity = levelConfig.WORLD_GRAVITY
    this.friction = levelConfig.WORLD_FRICTION

    //stuff for jumping
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
    // 90% of half-lane so player wont hit edges exactly
    this.maxLaneOffset = ((Math.PI * 2) / levelConfig.LANE_COUNT) / 2 * 0.9


    //place player on inner wall of tunnel
    this.updatePosition()
  }

  init = () => {
    //set initial position
    this.mesh.position.set(0, -this.radius, this.initialZPosition)
    //add player to container and container to scene
    this.mainPlayerContainer.add(this.mesh)
    this.app.scene.add(this.mainPlayerContainer)
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
    if(!this.isJumping){
      this.isJumping = true
      this.jumpVelocity = this.TARGET_JUMP_VELOCITY
    }
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

  updateMovement = () => {
    console.log("DEBUG: MOVEMENT FIRING")
    //set velocity to positive or negative (directin is always 1 or -1)
    this.laneOffsetVelocity += this.direction * levelConfig.PLAYER_ACCEL
    //apply friction
    this.laneOffsetVelocity *= this.friction
    //apply movment
    this.laneOffset += this.laneOffsetVelocity
    // clamp to lane bounds
    if (this.laneOffset > this.maxLaneOffset) {
      this.laneOffset = this.maxLaneOffset;
      this.laneOffsetVelocity = 0;
    }
    if (this.laneOffset < -this.maxLaneOffset) {
      this.laneOffset = -this.maxLaneOffset;
      this.laneOffsetVelocity = 0;
    }

    this.mesh.rotation.z = this.laneOffsetVelocity * 20;
  }

  updatePosition = () => {
    //final angle is angle but with laneOffset for movement
    const finalAngle = this.angle + this.laneOffset;

    const effectiveRadius = this.baseRadius - this.jumpOffset

    const x = Math.cos(finalAngle) * effectiveRadius
    const y = Math.sin(finalAngle) * effectiveRadius
    this.mesh.position.set(x, y, this.initialZPosition)
  }

  update = (deltaTime) => {
    this.updateJumpPhysics()
    if(this.isMoving !== false){
      this.updateMovement()
    }
    this.updatePosition()
  }
}

