import * as THREE from 'three';


class Application{
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


class Level{
  constructor(app){
    this.app = app

    //SHAPE setup
    this.geometry = new THREE.CylinderGeometry(
      1,     // radius top
      1,     // radius bottom
      50,    // length of tunnel
      6,     // sides (hexagon)
      1,
      true   // open ended
    )

    //MATERIAL setup
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      side: THREE.BackSide // THIS puts you inside the tunnel
    })

    //TUNNEL setup
    this.tunnel = new THREE.Mesh(this.geometry, this.material);
    //roate tunnel 90 degrees 
    this.tunnel.rotation.x = Math.PI / 2;
    
    
    //EDGES
    this.edges = new THREE.EdgesGeometry(this.geometry);
    this.line = new THREE.LineSegments(
      this.edges,
      new THREE.LineBasicMaterial({ color: 0xF57927 })
    );
     this.tunnel.add(this.line);
  }

  init = () => {
    
    //FOG EFFECT
    this.app.scene.fog = new THREE.Fog(0x000000, 2, 15)

    //add tunnel to scene
    this.app.scene.add(this.tunnel)
  }

  //ANIMATE//
  animate = () => {
    requestAnimationFrame(() => this.animate());

    // move tunnel toward camera
    this.tunnel.position.z += 0.01;


    // reset for looping effect
    if (this.tunnel.position.z > 50) {
      this.tunnel.position.z = -50;
    }

    this.app.renderer.render(this.app.scene, this.app.camera);
  }
}


const mainApplication = new Application()
mainApplication.init()
const level = new Level(mainApplication)
level.init()
level.animate();