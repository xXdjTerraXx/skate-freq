import * as THREE from 'three'
import { levelConfig } from '../../../config'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

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
        this.lines = []
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

        //init the lines that connect nodes
        for(let i = 0; i < this.nodes.length - 1; i++){
            const nodeToTheLeftPosition = this.nodes[i].position
            const nodeToTheRightPosition = this.nodes[i + 1].position
            const newLine = new ConnectingLine(nodeToTheLeftPosition, nodeToTheRightPosition, this.mainContainer, this.nodeSize)
            newLine.init()
            this.lines.push(newLine)
        }

        //add to parent container
        this.parentContainer.add(this.mainContainer)
    }

    onBeat = () => {
        this.lines.forEach(line => {
            line.onBeat()
        })
    }

    updateMeter = (playerSurgeAmount) => {
        //update the nodes of the meter
        for(let i = 0; i < playerSurgeAmount; i++){
            this.nodes[i].updateFilled(true)
        }

        //now update the lines
        if(playerSurgeAmount <= 1) return
        else{
            for(let i = 1; i < playerSurgeAmount; i++){
                this.lines[i - 1].activate()
            }
        }
    }

    update = (deltaTime) => {

        this.nodes.forEach(node => {
            node.update(deltaTime)
        })

        this.lines.forEach(line => {
            line.update(deltaTime)
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
        this.position = position

        //if this meter node is filled or not
        this.isFilled = false

        //constants from config
        this.fillColor = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.nodeColorActive
        this.outlineColor = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.nodeColorInactive

        //create stuff for the mesh that will be used for when node is filled
        this.geometry = geometry
        this.material = material
        this.material.color.set(this.fillColor)
        this.fillMesh = new THREE.Mesh(this.geometry, this.material)
        this.fillMesh.renderOrder = levelConfig.RENDER_ORDER.UI
        this.fillMesh.name = `surge ${this.index} fill`
        this.fillMesh.visible = false

        //and now the outline for when the node isnt filled
        this.shape = shape
        this.points = this.shape.getPoints()
        this.outlineGeometry = new THREE.BufferGeometry().setFromPoints(this.points)
        //set the points, and also set the first point as the last one so its closed!!!
        this.outlineGeometry.setFromPoints([...this.points, this.points[0]])
        this.outlineMaterial = new THREE.LineBasicMaterial({ color: this.outlineColor })
        this.outline = new THREE.Line(this.outlineGeometry, this.outlineMaterial)
        this.outline.name = `surge ${this.index} outline`

        //add only outline to parent
        this.parentContainer.add(this.outline, this.fillMesh)

        //position both
        this.fillMesh.position.set(position.x, position.y, position.z)
        this.outline.position.set(position.x, position.y, position.z)

        //init with no bloom
        this.fillMesh.layers.set(1)
        this.outline.layers.set(1)

    }

    updateFilled = (newIsFilled) => {
        this.isFilled = newIsFilled
        if(this.isFilled){
            //swap outline mesh for filled mesh
            this.outline.visible = false
            this.fillMesh.visible = true
        }
        else{
            this.outline.visible = true
            this.fillMesh.visible = false
        }
    }

    pulse = () => {

    }

    update = (deltaTime) => {

    }

    reset = () => {

    }
}

class ConnectingLine{
    constructor(nodeToTheLeftPos, nodeToTheRightPos, parentContainer, nodeSize){
        this.nodeToTheLeftPos = nodeToTheLeftPos
        this.nodeToTheRightPos = nodeToTheRightPos
        this.parentContainer = parentContainer
         //nodes size is half the distance left to right, up down of the diamond shape node
        this.nodeSize = nodeSize

        this.lineColorActive = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.connectingLineColorActive
        this.lineColorInactive = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.connectingLineColorInactive
        this.lineWidth = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.connectingLineWidth
        this.n = 20 //how many points along the line
        this.lineLength = Math.abs(this.nodeToTheLeftPos.x - this.nodeToTheRightPos.x) - (this.nodeSize*2)
        this.distanceBetweenPoints = this.lineLength / this.n
        this.baseWaveAmplitude = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.baseWaveAmplitude
        this.maxWaveAmplitude = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.maxWaveAmplitude

        this.beatIntensity = 0
        
        this.elapsedTime = 0

        this.points = []

        this.isActivated = false
    }

    init = () => {
        
        for(let i = 0; i <= this.n; i++){
            const t = i / this.n
            const x = this.nodeToTheLeftPos.x + t * this.lineLength + this.nodeSize
            const y = this.nodeToTheLeftPos.y
            this.points.push(new THREE.Vector3(x, y, 0))
        }

        this.lineGeometry = new MeshLineGeometry()
        this.lineGeometry.setPoints(this.points)
        this.originalPoints = this.points.map(p => p.clone())
        this.lineMaterial = new MeshLineMaterial({
            color: this.lineColorInactive,
            lineWidth: this.lineWidth,  
            resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
        })
        this.line = new THREE.Mesh(this.lineGeometry, this.lineMaterial)
       
        this.line.layers.set(0)
        this.lineMaterial.transparent = true
        this.lineMaterial.opacity = 0.3

        this.parentContainer.add(this.line)

    }

    activate = () => {
        this.isActivated = true
        //change line color and opacity
        this.lineMaterial.color.set(this.lineColorActive)
        this.lineMaterial.opacity = 0.7
    }

    deactivate = () => {
        this.isActivated = false
        //change line color and opacity
        this.lineMaterial.color.set(this.lineColorActive)
        this.lineMaterial.opacity = 0.3
    }

    onBeat = () => {
        if(this.isActivated)this.beatIntensity = levelConfig.UI_COMPONENT_SETTINGS.surgeMeter.beatIntensity
        //lower beat intensity if not activated
        else this.beatIntensity = .5
    }

    update = (deltaTime) => {
        // if(!this.isActivated) return

        this.elapsedTime += deltaTime

   
        const lerpFactor = 1 - Math.pow(.001, deltaTime)
        this.beatIntensity = Math.max(0, this.beatIntensity - 0.3 * lerpFactor)
        
        //loops through all the points and add the sine wave effect 
        for(let i = 0; i <= this.n; i++){
            const originalY = this.originalPoints[i].y
            const t = i / this.n
            const amplitude = this.baseWaveAmplitude + this.beatIntensity * this.maxWaveAmplitude
            
            const wave = 
            Math.sin(t * Math.PI * 4 + this.elapsedTime * 3) * amplitude  +
            Math.sin(t * Math.PI * 8 + this.elapsedTime * 5) * (amplitude  * 0.3) +
            Math.sin(t * Math.PI * 2 + this.elapsedTime * 1.5) * (amplitude  * 0.5) 

            this.points[i].y = this.originalPoints[i].y + wave

        }
        this.lineGeometry.setPoints(this.points)
        // this.lineGeometry.attributes.position.needsUpdate = true

    }
}