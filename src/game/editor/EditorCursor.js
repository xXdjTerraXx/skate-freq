import { levelConfig } from "../../config"
import * as THREE from 'three'

export default class EditorCursor{
    constructor(app, levelEditor){
        this.app = app
        this.levelEditor = levelEditor
        
        //some constants
        this.TUNNEL_RADIUS = levelConfig.TUNNEL_RADIUS 
        this.INITIAL_Z_POSITION = levelConfig.PLAYER_Z_VALUE

        this.mainCursorContainer = new THREE.Group()
        this.mainCursorContainer.name = 'main cursor container'
        //GEOMETRY
        this.geometry = new THREE.SphereGeometry(0.05, 16, 16)
        //MATERIAL
        this.material = new THREE.MeshBasicMaterial({
        color: 0x00ffff
        })
        //MESH
        this.mesh = new THREE.Mesh(this.geometry, this.material)

        //add everything to groups
        this.mainCursorContainer.add(this.mesh)
        this.levelEditor.mainContainer.add(this.mainCursorContainer)
    }

      init = () => {
        //set initial position
        this.mesh.position.set(0, -this.TUNNEL_RADIUS, this.INITIAL_Z_POSITION)
        //add player to container and container to scene
        this.levelEditor.mainContainer.add(this.mesh)
      }
}