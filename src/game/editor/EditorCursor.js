import { levelConfig } from "../../config"
import * as THREE from 'three'

export default class EditorCursor{
    constructor(app, levelEditor){
        this.app = app
        this.levelEditor = levelEditor
        
        //some constants
        this.TUNNEL_RADIUS = levelConfig.TUNNEL_RADIUS 
        this.INITIAL_Z_POSITION = levelConfig.PLAYER_Z_VALUE
        //measurement of one 'side' of the level/tunnel
        this.LANE_ANGLE = (Math.PI * 2) / levelConfig.LANE_COUNT

        this.currentAngle = this.levelEditor.cursorCurrentLane * this.LANE_ANGLE
        this.laneOffset = 0

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
        //set initial position
        this.mesh.position.set(0, -this.TUNNEL_RADIUS, this.INITIAL_Z_POSITION)
        //add main container to level editor
        this.levelEditor.mainContainer.add(this.mainCursorContainer)

        this.updatePosition()
    }

    init = () => {
      
    }

    updatePosition = () => {
      //final angle is angle but with laneOffset for movement
      const finalAngle = this.currentAngle + this.laneOffset

      // const effectiveRadius = this.baseRadius - this.jumpOffset

      const x = Math.cos(finalAngle) //* effectiveRadius
      const y = Math.sin(finalAngle) //* effectiveRadius
      this.mesh.position.set(x, y, this.INITIAL_Z_POSITION + .2)
    }
}