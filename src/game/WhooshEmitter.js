import * as THREE from 'three'
import { levelConfig } from '../config'

export default class WhooshEmitter {
    constructor(app) {
        // create a BufferGeometry with N particles
        // each particle is just an x,y,z position in a Float32Array
        // create Points with PointsMaterial
        // add to scene
        this.app = app

        //these get set in handleStart
        this.lane = null
        this.activated = false

        //sooo this buffer geometry is basically a low level geometry object. 
        //it basically is being given a bunch of points via the 
        this.geometry = new THREE.BufferGeometry()

        this.material = new THREE.PointsMaterial({ 
            color: levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.particleColor, 
            size: levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.particleSize,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false  // important with additive, prevents sorting issues
        })

        this.points = new THREE.Points(this.geometry, this.material)

        //number of particles
        this.n = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.numberOfParticles

        this.mainColor = new THREE.Color(levelConfig.UI_COLOR_PALETTE.gold)   
        this.secondaryColor = new THREE.Color(levelConfig.UI_COLOR_PALETTE.highlight) 

        //this is the 32 float array that the buffer can read straight from
        //holds all the particles positions, but these 32float arrays have to be flat.
        //so init particlesPositions as this.n * 3 bc each particle's length is x, y, and z
        //so init a space for each. this all ultimately to save resources and let the gpu
        //read straight from this
        this.particlePositions = new Float32Array(this.n * 3) 
        //and need parallel arrays to track velocity, lifespan and color
        this.particleVelocities = new Float32Array(this.n * 3)
        //lifetime is a single value so no "* 3"
        this.particleLifes = new Float32Array(this.n) 
        //colors also needs 3 index per entry for r g b
        this.particleColors = new Float32Array(this.n * 3)
        this.renderColors = new Float32Array(this.n*3)

        this.startingZPosition = 0//levelConfig.PLAYER_Z_VALUE 
        this.endingZosition = -15
        this.EMITTER_SPEED = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.speed

    }

    init = (panelWidth) => {
        //set up each of the parallel arrays

        //POSITIONS
        //panel width needed to provide a bounding rectangle to give the emitter shape
        this.panelWidth = panelWidth + .5
        this.panelHeight = .05
        for(let i = 0; i < this.n; i++){
            this.particlePositions[i * 3]     = (Math.random() - 0.5) * this.panelWidth  // x
            this.particlePositions[i * 3 + 1] = (Math.random() - 0.5) * this.panelHeight  // y
            this.particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0  // z
        }

        //VELOCITIES
        const velocity = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.velocity
        for(let i = 0; i < this.n; i++){
            this.particleVelocities[i * 3]     = (Math.random() - 0.5) * velocity  // x
            this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * velocity  // y
            this.particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * velocity  // z
        }

        //LIFETIME
        for(let i = 0; i < this.n; i++){
            const baseLifetime = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.lifetime
            const lifetimeVar = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.lifetimeVariation
            this.particleLifes[i] = baseLifetime * (0.5 + Math.random() * 0.5) 
        }

        //COLORS
        for(let i = 0; i < this.n; i++){
            const color = Math.random() > 0.5 ? this.mainColor : this.secondaryColor
            //bc main and secondary colors are three.js color objects they have rgb values
            this.particleColors[i * 3]     = color.r
            this.particleColors[i * 3 + 1] = color.g
            this.particleColors[i * 3 + 2] = color.b
        }

        //set the buffer geometry's 'positions' attribute with the 32float array of positions
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3))

        //set the buffer's 'color' attribute too
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.renderColors, 3))
    }

    handleStart = (currentSurgeObject) => {
        this.lane = currentSurgeObject.lane

        // add to floorPanelsContainer instead
        this.app.level.floorPanelsContainer.add(this.points)
        
        // position it at player Z, in the correct lane x/y
        const panel = this.app.level.floorPanels[this.lane]
        
        // use lane x/y but player z
        // this.points.position.set(worldPos.x, worldPos.y, levelConfig.PLAYER_Z_VALUE)
        this.points.position.set(panel.x, panel.y, levelConfig.PLAYER_Z_VALUE)
        this.points.rotation.z = panel.angle + Math.PI/2
        this.activated = true
    }

    //reset everything
    handleEnd = () => {
        console.log("ENDING WHOOSH")
        // reset all particles to local origin first
        const positions = this.geometry.attributes.position.array
        for(let i = 0; i < this.n; i++){
            positions[i * 3]     = 0
            positions[i * 3 + 1] = 0
            positions[i * 3 + 2] = 0
            //reset particle lifetime here too
            this.particleLifes[i] = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.lifetime
        }
        this.geometry.attributes.position.needsUpdate = true

        //and reset colors as well
        const colors = this.geometry.attributes.color.array
        for(let i = 0; i < this.n; i++){
            const color = Math.random() > 0.5 ? this.mainColor : this.secondaryColor
            colors[i * 3]     = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
            // also update particleColors so update loop has correct base color
            this.particleColors[i * 3]     = color.r
            this.particleColors[i * 3 + 1] = color.g
            this.particleColors[i * 3 + 2] = color.b
        }
        this.geometry.attributes.color.needsUpdate = true

        // now reset everything else
        this.lane = null
        this.activated = false
        this.points.position.z = this.startingZPosition

        //remove from group
        this.app.level.floorPanelsContainer.remove(this.points)
    }

    update(deltaTime) {
        if(!this.activated)return

        console.log("whooshing")

        // move the whole emitter down the lane
        this.points.position.z -= deltaTime * this.EMITTER_SPEED

        const positions = this.geometry.attributes.position.array
        const colors = this.geometry.attributes.color.array

        for(let i = 0; i < this.n; i++){

            //update particle positions based on velocity
            positions[i * 3] += this.particleVelocities[i * 3] // x position
            positions[i * 3 + 1] += this.particleVelocities[i * 3 + 1] // y position
            positions[i * 3 + 2] += this.particleVelocities[i * 3 + 2] // z position

            //and tick down particle life
            this.particleLifes[i] -= deltaTime
            //RESPAWN
            //if particle lifetime is up, reset its position
            if(this.particleLifes[i] <= 0){
                positions[i * 3]     = (Math.random() - 0.5) * this.panelWidth // x position
                positions[i * 3 + 1] = (Math.random() - 0.5) * this.panelHeight // y position
                positions[i * 3 + 2] = 0 // z position
                //reset liftime of dead particles when they "respawn"
                this.particleLifes[i] = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.lifetime * Math.random()
            }

            //fade each particle towards black (ultimately making it transparent)
            const lifeRatio = Math.min(this.particleLifes[i] / levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.lifetime, 1)            
            colors[i * 3] = this.particleColors[i * 3] * lifeRatio
            colors[i * 3 + 1] = this.particleColors[i * 3 + 1] * lifeRatio
            colors[i * 3 + 2] = this.particleColors[i * 3 + 2] * lifeRatio
        }

        this.geometry.attributes.position.needsUpdate = true
        this.geometry.attributes.color.needsUpdate = true

        //check if whoosh emitter has traveled far enough
        if(this.points.position.z < this.endingZosition) {
            this.handleEnd()
        }

    }   
}