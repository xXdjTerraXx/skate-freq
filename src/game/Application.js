import * as THREE from 'three';

export default class Application{
  constructor(){
    // SCENE setup
    this.scene = new THREE.Scene();
    // CAMERA setup
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    //RENDERER setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
  }

  init = () => {
    //position the camera
    this.camera.position.z = 2;
    //size the renderer and append to dom
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // --- RESIZE HANDLING ---
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
}