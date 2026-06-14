import * as THREE from 'three'
import { levelConfig } from '../config'

////// NOTE ///////////
// this class contains 2 meshes - glass mesh that covers the whole lane and an OC mesh
// for overclock sections that sits on top of the glass mesh. because of rotation wierdness,
// the meshes are both the children of a "bespokeContainer", which is what ultimately get's
// moved along the z axis during update
export default class FloorPanel{
    constructor(app, 
        floorPanelsContainer, 
        colorMap, 
        emissiveMap, 
        alphaMap,
        index, 
        overclockSectionsArray, 
        songLength, 
        beatsPerBar,
        secondsPerBeat,
        levelSpeed,
        currenTime,
        panelBeginTimeInSeconds,
        zRotationOffset){
            
        this.app = app
        //the main parent container that holds all the floor panels
        this.floorPanelsContainer = floorPanelsContainer
        //what lane this panel sits in
        this.lane = index
        //the color and emissive maps for the overclock texture
        this.colorMapTexture = colorMap
        this.emissiveMapTexture = emissiveMap
        this.alphaMapTexture = alphaMap
        //an array of objects, each object is data for an overclock section from level noteMap:   
        this.overclockSectionsArray = overclockSectionsArray
        //song length in seconds
        this.songLength = songLength
        this.beatsPerBar = beatsPerBar
        this.secondsPerBeat = secondsPerBeat
        this.levelSpeed = levelSpeed
        this.currentTime = currenTime
        this.panelBeginTimeInSeconds = panelBeginTimeInSeconds
        this.zRotationOffset = zRotationOffset

        //it is possible for one lane to have multiple oc sections. this array for saving
        //oc section meshes in a single lane
        this.overclockMeshArray = []

        //SOME MAFS AND POSITIONG BRUV
        this.laneAngle = (Math.PI * 2) / levelConfig.LANE_COUNT
        //z rotation offset to center each lane at the center of face
        this.angle = this.lane * this.laneAngle - this.zRotationOffset
        this.hitlineZPosition = levelConfig.PLAYER_Z_VALUE
        this.initialZPosition = this.hitlineZPosition - (this.panelBeginTimeInSeconds * levelConfig.SPEED)

        this.x = Math.cos(this.angle) * levelConfig.TUNNEL_RADIUS
        this.y = Math.sin(this.angle) * levelConfig.TUNNEL_RADIUS
        this.z = this.initialZPosition

        //WIDTH SAME FOR BOTH GLASS AND OC PANELS
        this.panelWidth = (2 * Math.PI * levelConfig.TUNNEL_RADIUS) / levelConfig.LANE_COUNT

        //state inited 
        this.currentState = 'GLASS' //state is GLASS or OVERCLOCK
    }

    init = () => {
        // FOR DEBUGGING
        // const helper = new THREE.AxesHelper(1)
        // this.mesh.add(helper)
        //INIT BESPOKE GROUP
        this.bespokeGroup = new THREE.Group()
        this.bespokeGroup.name = `lane group ${this.lane}`
        this.bespokeGroup.position.set(this.x, this.y, this.initialZPosition)
        this.bespokeGroup.rotation.z = this.angle + Math.PI

        //init both panel types
        this.initGlassPanel()
        this.initOverclockPanel()
        
        //bespoke group gets added to main floorPanelsContainer
        this.floorPanelsContainer.add(this.bespokeGroup)
    }

    initGlassPanel = () => {
        //LENGTH OF PANEL
        this.panelLengthGlass = this.levelSpeed * this.songLength

        //GLASS GEOMETRY
        this.glassPanelGeometry = new THREE.PlaneGeometry(this.panelWidth, this.panelLengthGlass)

        //GLASS MATERIAL
        this.glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x88ffff,
            transmission: 0.95,  
            roughness: 0.35,      
            metalness: 0.0,
            thickness: 0.1,
            transparent: true,
            depthWrite: false,
            side: THREE.FrontSide
        })

        //GLASS MESH
        this.glassMesh = new THREE.Mesh(this.glassPanelGeometry, this.glassMaterial)
        this.glassMesh.name = `floor panel lane ${this.lane} GLASS`
        this.glassMesh.renderOrder = levelConfig.RENDER_ORDER.FLOOR_GLASS

        //POSITION AND ROTATION
        this.glassMesh.position.set(0, 0, 0)
        this.glassMesh.rotation.y = Math.PI/2  
        this.glassMesh.rotation.z = Math.PI/2  

        //shifts the vertices of the geometry relative to its origin,
        //basically making the origin the leading edge
        this.glassPanelGeometry.translate(0, -(this.panelLengthGlass / 2), 0)

        //add to bespoke group
        this.bespokeGroup.add(this.glassMesh)
    }

    //overclock sections arr looks like:
    //     [ { lane: 0, startBeat: 1,  endBeat: 32  } ] 
    //loop over and create an oc mesh for each array item
    initOverclockPanel = () => {
        this.overclockSectionsArray.forEach((dataObj, i) => {
            //find the length of this oc panel
            const panelLengthBeats = (dataObj.endBeat - dataObj.startBeat) + 1
            const panelLengthSeconds = panelLengthBeats * this.secondsPerBeat 
            const panelLengthWorldUnits = panelLengthSeconds * this.levelSpeed

            //CREATE GEOMETRY
            const geometry = new THREE.PlaneGeometry(this.panelWidth, panelLengthWorldUnits)

            ////////  CLONING THE TEXTURES AND SETTING TILE/REPEAT
            ///////   ~~**~~**~   TO DO    ~**~~**~~**   
            //////    replace this hard coded value with a formula that uses
            /////     colorMapTexture.image.height/width
            const textureRepeatCount = 12

            const colorMapTextureCLONE = this.colorMapTexture.clone()
            colorMapTextureCLONE.needsUpdate = true
            colorMapTextureCLONE.wrapS = THREE.RepeatWrapping
            colorMapTextureCLONE.wrapT = THREE.RepeatWrapping
            colorMapTextureCLONE.repeat.set(1, textureRepeatCount)  

            const emissiveMapTextureCLONE = this.emissiveMapTexture.clone()
            emissiveMapTextureCLONE.needsUpdate = true
            emissiveMapTextureCLONE.wrapS = THREE.RepeatWrapping
            emissiveMapTextureCLONE.wrapT = THREE.RepeatWrapping
            emissiveMapTextureCLONE.repeat.set(1, textureRepeatCount) 

            const alphaMapTextureCLONE = this.alphaMapTexture.clone()
            alphaMapTextureCLONE.needsUpdate = true
            alphaMapTextureCLONE.wrapS = THREE.RepeatWrapping
            alphaMapTextureCLONE.wrapT = THREE.RepeatWrapping
            alphaMapTextureCLONE.repeat.set(1, textureRepeatCount) 
            
            //INIT MATERIAL
            const overclockMaterial = new THREE.MeshPhysicalMaterial({
                map: colorMapTextureCLONE,
                emissiveMap: emissiveMapTextureCLONE,
                emissive: new THREE.Color(0xffffff),
                alphaMap: alphaMapTextureCLONE,
                transparent: true,        // ← MUST be true for alphaMap to work
                depthWrite: false,        // ← prevents transparency sorting issues
                emissiveIntensity: 0.8,
                transmission: 0.2,
                roughness: 0.5,
                metalness: 0.4,
                thickness: 0.5,
                side: THREE.FrontSide
            })

            //CREATE THE MESH
            const overclockMesh = new THREE.Mesh(geometry, overclockMaterial)
            overclockMesh.name = `floor panel lane ${this.lane} OVERCLOCK`
            overclockMesh.renderOrder = levelConfig.RENDER_ORDER.FLOOR_OVERCLOCK

            const startOffset = dataObj.startBeat * this.secondsPerBeat * this.levelSpeed
            geometry.translate(0, -(panelLengthWorldUnits / 2) - startOffset, 0)
            //TO DO: POSITION THE MESH 
            overclockMesh.position.set(0, 0, 0)
            overclockMesh.rotation.y = Math.PI/2  
            overclockMesh.rotation.z = Math.PI/2 

            //add to bespoke group
            this.bespokeGroup.add(overclockMesh)
            //and to array for safe keeping :3
            this.overclockMeshArray.push(overclockMesh)
        })
    }

    // setState = (newState) => {
    //     this.currentState = newState
    //     if(this.currentState === 'GLASS'){
    //     }
    //     else if(this.currentState === 'OC'){
    //     }
    // }

    update = (deltaTime, currentTime) => {
        ///////update panel's  z position
        this.z += this.levelSpeed * deltaTime
        this.bespokeGroup.position.z = this.z
    }
}