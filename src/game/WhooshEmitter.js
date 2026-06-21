import * as THREE from 'three'
import { levelConfig } from '../config'

export default class WhooshEmitter {
    constructor(app) {
        this.app = app

        //these get set in handleStart
        this.lane = null
        this.activated = false

        //sooo this buffer geometry is basically a low level geometry object. 
        //it basically is being given a bunch of points via the 
        this.geometry = new THREE.BufferGeometry()

        this.material = new THREE.PointsMaterial({ 
            color: 0xffffff, 
            size: levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.particleSize,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false  // important with additive, prevents sorting issues
        })

        this.points = new THREE.Points(this.geometry, this.material)

        //number of particles
        this.n = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.numberOfParticles
        //number of trail particles
        this.trailN = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticles.numberOfParticles

        this.mainColor = new THREE.Color(levelConfig.UI_COLOR_PALETTE.purple)   
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
        this.particleMaxLifes = new Float32Array(this.n)
        //colors also needs 3 index per entry for r g b
        this.particleColors = new Float32Array(this.n * 3)
        this.renderColors = new Float32Array(this.n*3)
        

        this.startingZPosition = 0//levelConfig.PLAYER_Z_VALUE 
        this.endingZosition = -15
        this.EMITTER_SPEED = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.emitterSpeed
        this.TRAIL_EMITTER_SPEED = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticlesEmitterSpeed

        this.trailParticles = []
        this.trailParticlesGroup = new THREE.Group()
        this.trailParticlesGroup.name = 'trail particles group'
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
            this.particleVelocities[i * 3]     = (Math.random() - 0.5) * velocity.x  
            this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * velocity.y   
            this.particleVelocities[i * 3 + 2] = velocity.z  
        }

        //LIFETIME
        for(let i = 0; i < this.n; i++){
            const maxLife = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.lifetime * (0.5 + Math.random() * 0.5)
            this.particleLifes[i] = maxLife
            this.particleMaxLifes[i] = maxLife
        }

        //for ~20% of particles, make the trail particles with different velocity and life 
        for(let i = 0; i < this.n; i++){
            const isTrail = i > this.n * 0.8
            const trailParticleVelocity = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticles.velocity
            const trailParticleLife = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticles.lifetime
                if(isTrail){
                    //trail particle velocity
                    this.particleVelocities[i * 3]     = (Math.random() - 0.5) * trailParticleVelocity.x  
                    this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * trailParticleVelocity.y   
                    this.particleVelocities[i * 3 + 2] = trailParticleVelocity.z  
                    //trail particle life
                    this.particleLifes[i] = trailParticleLife * (0.5 + Math.random() * 0.5)
                    this.particleMaxLifes[i] = trailParticleLife * (0.5 + Math.random() * 0.5)
                }
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


        //init trail particles
        for(let i = 0; i < this.trailN; i++){
            const localPos = {
                x: (Math.random() - 0.5) * this.panelWidth,  // x
                y: (Math.random() - 0.5) * this.panelHeight,  // y
                z: 0 // z
             }
            // const newTrailParticle = new TrailParticle(localPos, this.trailParticlesGroup, i)
            const newTrailParticle = new TrailParticle(this.app, this.trailParticlesGroup, localPos, i)

            this.trailParticles.push(newTrailParticle)
        }
    }

    handleStart = (currentSurgeObject) => {
        this.lane = currentSurgeObject.lane

        // add to normal particles to floorPanelsContainer 
        this.app.level.floorPanelsContainer.add(this.points)
        //and add trail particles group too
        // this.app.level.floorPanelsContainer.add(this.trailParticlesGroup)   //OG
        this.app.scene.add(this.trailParticlesGroup)
        // get the surge panel
        const panel = this.app.level.floorPanels[this.lane]
        
        //position the normal particles
        // use lane x/y but player z
        this.points.position.set(panel.x, panel.y, levelConfig.PLAYER_Z_VALUE)
        this.points.rotation.z = panel.angle + Math.PI/2

        this.trailParticlesGroup.position.set(0, -1, levelConfig.PLAYER_Z_VALUE)
        // this.trailParticlesGroup.rotation.x = Math.PI

        this.trailParticles.forEach(tp => {
            tp.init()
        })
    
        //set activated
        this.activated = true
    }

    //reset everything
    handleEnd = () => {
        console.log("ENDING WHOOSH")
        // reset all particles to local origin first
        const positions = this.geometry.attributes.position.array
        for(let i = 0; i < this.n; i++){
            positions[i * 3]     = (Math.random() - 0.5) * this.panelWidth  // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * this.panelHeight  // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0  // z

            //reset particle lifetime here too
            const baseLifetime = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.lifetime
            this.particleLifes[i] = baseLifetime * (0.5 + Math.random() * 0.5) 
            this.particleMaxLifes[i] = baseLifetime * (0.5 + Math.random() * 0.5) 

            //reset trail particles
            const isTrail = i > this.n * 0.8
            const trailParticleVelocity = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticles.velocity
            const trailParticleLife = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticles.lifetime
                if(isTrail){
                    //trail particle velocity
                    this.particleVelocities[i * 3]     = (Math.random() - 0.5) * trailParticleVelocity.x  
                    this.particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * trailParticleVelocity.y   
                    this.particleVelocities[i * 3 + 2] = trailParticleVelocity.z  
                    //trail particle life
                    this.particleLifes[i] = trailParticleLife * (0.5 + Math.random() * 0.5)
                    this.particleMaxLifes[i] = trailParticleLife * (0.5 + Math.random() * 0.5)
                }
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

        //reset trail particles
        this.trailParticles.forEach(tp => tp.reset())

        //reset group position
        this.points.position.z = this.startingZPosition

        // now reset everything else
        this.lane = null
        this.activated = false
        
        //remove from group
        this.app.level.floorPanelsContainer.remove(this.points)
        this.app.level.floorPanelsContainer.remove(this.trailParticlesGroup)
    }

    update(deltaTime) {
        if(!this.activated)return

        console.log("whooshing")

        // move the whole emitter down the lane
        this.points.position.z -= deltaTime * this.EMITTER_SPEED
        //and the trail particles group
        this.trailParticlesGroup.position.z -= deltaTime * this.TRAIL_EMITTER_SPEED

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
                this.particleLifes[i] = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.lifetime * (0.5 + Math.random() * 0.5) 
            }

            //fade each particle towards black (ultimately making it transparent)
            const lifeRatio = Math.min(this.particleLifes[i] / this.particleMaxLifes[i], 1)
            colors[i * 3] = this.particleColors[i * 3] * lifeRatio
            colors[i * 3 + 1] = this.particleColors[i * 3 + 1] * lifeRatio
            colors[i * 3 + 2] = this.particleColors[i * 3 + 2] * lifeRatio
        }

        this.geometry.attributes.position.needsUpdate = true
        this.geometry.attributes.color.needsUpdate = true

        const groupWorldPos = new THREE.Vector3()
        this.points.getWorldPosition(groupWorldPos)

        //update all the trail particles
        this.trailParticles.forEach(tp => {
            tp.update(deltaTime, groupWorldPos)
        })

        //check if whoosh emitter has traveled far enough
        if(this.points.position.z < this.endingZosition) {
            this.handleEnd()
        }

    }   
}


class TrailParticle {
    constructor(app, trailParticlesGroup, localPos, index) {
        this.app = app
        this.trailParticlesGroup = trailParticlesGroup
        this.localPos = localPos
        this.index = index

        this.particles = []
        this.maxParticles = 50
        this.spawnTimer = 0
        // this.spawnRate = 0.016 
        this.spawnRate = 0.016 // spawn every ~1 frame

        // geometry and material
        this.geometry = new THREE.BufferGeometry()
        this.positions = new Float32Array(this.maxParticles * 3)
        this.colors = new Float32Array(this.maxParticles * 3)
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3))

        const canvas = document.createElement('canvas')
        canvas.width = 64
        canvas.height = 64
        const ctx = canvas.getContext('2d')
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
        gradient.addColorStop(0, 'rgba(255,255,255,1)')
        gradient.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 64, 64)
        const texture = new THREE.CanvasTexture(canvas)

        this.material = new THREE.PointsMaterial({
            color: levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticles.color,
            size: levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticles.size,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            map: texture,
            alphaTest: 0.001, 
        })

        this.points = new THREE.Points(this.geometry, this.material)
        this.points.frustumCulled = false
        this.points.layers.enable(0)
    }

    init = () => {
        console.log('TrailParticle init called, adding to scene')
        this.app.scene.add(this.points)
        // this.trailParticlesGroup.add(this.points)
    }

    reset = () => {
        this.particles = []
        this.spawnTimer = 0
        // clear positions and colors
        this.positions.fill(0)
        this.colors.fill(0)
        this.geometry.attributes.position.needsUpdate = true
        this.geometry.attributes.color.needsUpdate = true
        this.app.scene.remove(this.points)
    }

    update = (deltaTime, groupWorldPos) => {

        // spawn new particle at current world pos + local offset
        this.spawnTimer += deltaTime
        if(this.spawnTimer >= this.spawnRate && this.particles.length < this.maxParticles) {
            this.spawnTimer = 0
            const baseLife = levelConfig.OVERCLOCK_VISUALS_SETTINGS.WhooshEmitter.trailParticles.lifetime
            const maxLife = baseLife + Math.random() * 0.2
            this.particles.push({
                x: groupWorldPos.x + this.localPos.x + (Math.random() - 0.5) * 0.1,
                y: groupWorldPos.y + this.localPos.y + (Math.random() - 0.5) * 0.1,
                z: groupWorldPos.z,
                life: maxLife,
                maxLife: maxLife
            })
        }

        // update all particles
        for(let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i]
            p.life -= deltaTime
            if(p.life <= 0) {
                this.particles.splice(i, 1)
                continue  
            }
            p.z += deltaTime * levelConfig.SPEED
        }

        // write to buffers
        this.positions.fill(0)
        this.colors.fill(0)
        
        for(let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i]
            const lifeRatio = Math.max(p.life / p.maxLife, 0)
            this.positions[i * 3]     = p.x
            this.positions[i * 3 + 1] = p.y
            this.positions[i * 3 + 2] = p.z
            this.colors[i * 3]     = lifeRatio
            this.colors[i * 3 + 1] = lifeRatio
            this.colors[i * 3 + 2] = lifeRatio
        }

        this.geometry.attributes.position.needsUpdate = true
        this.geometry.attributes.color.needsUpdate = true

        this.points.rotation.z += deltaTime
    }

}