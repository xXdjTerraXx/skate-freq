import * as THREE from 'three';
import { levelConfig } from '../config';

export default class GateRing {
  constructor(app, ringContainer, index, ringSpacing, hitlineZPosition, ringCount) {
    this.app = app
    this.ringContainer = ringContainer
    //the index is basically which gate ring this is, from the for loop where
    //gate rings are created in level.js
    this.gateRingIndex = index
    //distance in seconds between rings
    this.ringSpacing = ringSpacing
    this.hitlineZPosition = hitlineZPosition
    //total number of rings inited in Level
    this.ringCount = ringCount

    //hex geometry 
    this.geometry = new THREE.RingGeometry(1, 0.97, levelConfig.LANE_COUNT)

    //material
    this.material = new THREE.MeshBasicMaterial({
      color: levelConfig.RING_COLOR,
      side: THREE.DoubleSide
    })

    //mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    //layer 1 is no bloom
    // this.mesh.layers.set(1)

  }

  init() {
    this.ringContainer.add(this.mesh)
  }

  update(deltaTime, speed, currentTime) {

      const cycleLength = this.ringCount * this.ringSpacing
      const baseRingTime = this.gateRingIndex * this.ringSpacing

      // how many full cycles have passed?
      const cyclesPassed = Math.floor(currentTime / cycleLength)

      // place ring at its position in the current cycle
      let ringTime = baseRingTime + (cyclesPassed * cycleLength)

      //linger time so the rings dont disappear imediately on hitting player
      //but rather a little after
      const lingerTime = 0.5
      // if that's already passed, bump to next cycle
      if(ringTime < currentTime - lingerTime){
          ringTime += cycleLength
      }

      const timeUntilHit = ringTime - currentTime
      this.mesh.position.z = this.hitlineZPosition - (speed * timeUntilHit)

      const t = performance.now() * 0.005
      const scale = 1 + Math.sin(t) * 0.05
      this.mesh.scale.set(scale, scale, scale)
  }
}