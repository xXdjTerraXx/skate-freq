import * as THREE from 'three'
import { levelConfig } from '../../../config'

export default class SurgeMeter{
    constructor(parentContainer){

        //gameplay HUD main container is the parent container
        this.parentContainer = parentContainer

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'surge meter container'

        //get constants from config
        this.nodeSize = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.nodeSize
        //num of surge needed for oc. basically, how many nodes will be in this meter
        this.surgeLimit = levelConfig.SURGE_LIMIT

        this.nodes = []
    }

    init = () => {
        //init all the nodes
        for(let i = 0; i < this.surgeLimit; i++){
            const nodeShape = new THREE.Shape()
            nodeShape.moveTo(0, this.nodeSize)      // top
            nodeShape.lineTo(this.nodeSize, 0)      // right
            nodeShape.lineTo(0, -this.nodeSize)     // bottom
            nodeShape.lineTo(-this.nodeSize, 0)     // left
            nodeShape.closePath()

            const nodeGeometry = new THREE.ShapeGeometry(nodeShape)

            const nodeMaterial = new THREE.MeshBasicMaterial({ color: this.nodeColor})
            //local coords within mainContainer of the individual node
            const x = i * 150
            const y = 0
            const z = 0
            const nodePos = { x, y, z }
            const newNode = new SurgeMeterNode(i, nodeShape, nodeGeometry, nodeMaterial, this.mainContainer, nodePos)
            this.nodes.push(newNode)
        }

        //add to parent container
        this.parentContainer.add(this.mainContainer)
    }

    update = (deltaTime) => {
        console.log("SURGE METER IS UPDATING")
        this.nodes.forEach(node => {
            node.update(deltaTime)
        })
    }

    reset = () => {
        this.nodes.forEach(node => node.reset())
    }
}

class SurgeMeterNode {
    constructor(index, shape, geometry, material, parentContainer, position){
        this.index = index
        this.parentContainer = parentContainer

        //constants from config
        this.nodeColorActive = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.nodeColorActive
        this.nodeColorInactive = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.nodeColorInactive

        this.shape = shape
        this.geometry = geometry
        this.material = material
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.renderOrder = levelConfig.RENDER_ORDER.UI

        this.parentContainer.add(this.mesh)
        //position
        this.mesh.position.set(position.x, position.y, position.z)
        //init with no bloom
        this.mesh.layers.set(1)

    }

    pulse = () => {

    }

    update = (deltaTime) => {

    }

    reset = () => {

    }
}