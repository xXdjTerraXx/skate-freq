import * as THREE from 'three';
import { levelConfig } from '../config';

export default class PlayerRing {
  constructor(app) {
    this.app = app;

    // slightly larger than tunnel radius
    const inner = levelConfig.TUNNEL_RADIUS * 1.15;
    const outer = levelConfig.TUNNEL_RADIUS * 1.16;

    this.geometry = new THREE.RingGeometry(inner, outer, levelConfig.LANE_COUNT);

    this.material = new THREE.MeshBasicMaterial({
      color: levelConfig.PLAYER_RING_COLOR,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.rotation.z = Math.PI / levelConfig.LANE_COUNT

    
  }

  init(playerZ, playerContainer) {
    // place at player depth
    this.mesh.position.z = playerZ
    //add to player container
    playerContainer.add(this.mesh)
  }
}