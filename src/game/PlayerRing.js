import * as THREE from 'three';
import { levelConfig } from '../config';

export default class PlayerRing {
  constructor(app) {
    this.app = app;

    // slightly larger than tunnel radius
    const inner = levelConfig.TUNNEL_RADIUS * 1.15;
    const outer = levelConfig.TUNNEL_RADIUS * 1.2;

    this.geometry = new THREE.RingGeometry(inner, outer, levelConfig.LANE_COUNT);

    this.material = new THREE.MeshBasicMaterial({
      color: levelConfig.PLAYER_RING_COLOR,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.rotation.z = Math.PI / levelConfig.LANE_COUNT


    //stuff for rhythmic scale pulse
    this.baseScale = 1
    this.currentScale = this.baseScale
    this.targetScale = 1.5
    this.pulseDecaySpeed = 0.03
    this.pulseAttackSpeed = 0.5
    this.pulseAmount = 0

    //stuff for rhythmic color pulse
    this.colorPulse = 0
    this.baseOpacity = 0.3
    this.maxOpacity = 0.7
  }

  //pulses the player ring on beats
  pulse = (beatInBar) => {
    
  if (beatInBar === 1) {
    //strong hit on beat 1
    this.pulseAmount = 1.2   
    this.colorPulse = 1.0   
  } else {
    //weaker on beat2
    this.pulseAmount = 0.5   
    this.colorPulse = 0.5
  }
}

  init(playerZ, playerContainer) {
    // place at player depth
    this.mesh.position.z = playerZ
    //add to player container
    playerContainer.add(this.mesh)
  }

  update = (deltaTime) => {
    // decay pulse
    this.pulseAmount *= 0.9
    // easing curve
    const eased = this.pulseAmount * this.pulseAmount
    //adjust scale
    this.currentScale = this.baseScale + (this.targetScale - this.baseScale) * eased

    this.mesh.scale.set(this.currentScale, this.currentScale, this.currentScale)

      // 🎨 color / opacity pulse
    const opacityBoost = this.colorPulse * 0.4

    this.material.color.setHSL(0.5, 1, 0.5 + this.colorPulse * 0.2)
    this.material.opacity = this.baseOpacity + opacityBoost
  }
}