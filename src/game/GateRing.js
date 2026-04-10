import * as THREE from 'three';
import { levelConfig } from '../config';

export default class GateRing {
  constructor(app, zPosition, ringContainer) {
    this.app = app
    this.ringContainer = ringContainer

    //hex geometry 
    this.geometry = new THREE.RingGeometry(1, 0.9, 6)

    //material
    this.material = new THREE.MeshBasicMaterial({
      color: levelConfig.RING_COLOR,
      side: THREE.DoubleSide
    })

    //mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    // initial position
    this.mesh.position.z = zPosition
  }

  init() {
    this.ringContainer.add(this.mesh)
  }

  update(speed) {
    this.mesh.position.z += speed

    const t = performance.now() * 0.005
    const scale = 1 + Math.sin(t) * 0.05

    this.mesh.scale.set(scale, scale, scale)
  }
}