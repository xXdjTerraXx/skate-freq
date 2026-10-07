import * as THREE from 'three';
import { levelConfig } from '../config';
import ENUMS from '../enums';

export default class GateRing {
  constructor(app, ringContainer, index, ringSpacing, hitlineZPosition, ringCount, beatSubdivision = ENUMS.BEAT_SUBDIVISON_STRINGS.DOWN, stepValue) {
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
    //whether this gate ring falls on downbeat, upbeat, or sixteenth beat subdivision
    this.beatSubdivision = beatSubdivision
    this.stepValue = stepValue
    //hex geometry 
    this.geometry = new THREE.RingGeometry(1, 0.97, levelConfig.LANE_COUNT)

    //material
    this.material = new THREE.MeshBasicMaterial({
      // color: levelConfig.RING_COLOR,
      color: levelConfig.GATE_RING_COLORS[this.beatSubdivision],
      side: THREE.DoubleSide
    })
    //color rings that appear duriong the initial countdown grey
    if(this.stepValue !== undefined){
      if(this.stepValue <= levelConfig.COUNTDOWN_BEATS - 1/levelConfig.EDITOR_BEAT_SUBDIVISION_OPTIONS[levelConfig.EDITOR_BEAT_SUBDIVISION_OPTIONS.length - 1]){
      this.material.color.set(0xe3e3e3)
      }
    }

    //mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    //layer 1 is no bloom
    // this.mesh.layers.set(1)

  }

  init() {
    this.ringContainer.add(this.mesh)
  }

  initBarLabel = () => {
    // if(stepValue >= COUNTDOWN_BEATS && (stepValue - COUNTDOWN_BEATS) % beatsPerBar === 0)
  }

  initBeatAndTimeLabel = () => {
    //every one can get a beat/time label
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
      // this.mesh.scale.set(scale, scale, scale)
  }

  //TO DO: for now, separate update method for editor. this is because of editor using
  //a fixed amount of rings based on song length and gameplay using the looping method.
  //at some point both should use fixed amount. probly??
  updateEditor(deltaTime, speed, currentTime) {

      const ringTime = this.gateRingIndex * this.ringSpacing
      const timeUntilHit = ringTime - currentTime
      this.mesh.position.z = this.hitlineZPosition - (speed * timeUntilHit)

      
      //TO DO: DONT DELETE THIS MESH SCALE SET - IT MAKES RINGS PULSE AND COULD BE USED
      //TO SHOW CURRENT "SELECTED" BEAT??
      // const t = performance.now() * 0.005
      // const scale = 1 + Math.sin(t) * 0.05
      // this.mesh.scale.set(scale, scale, scale)
  }

  dispose = () => {
    this.material.dispose()
    this.geometry.dispose()
    this.ringContainer.remove(this.mesh)
  }
}