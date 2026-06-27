import * as THREE from 'three'
import { levelConfig } from '../../../config'

//this is sort of like the health bar?? it works like the health meter in DDR
export default class UplinkMeter{
    constructor(parentContainer){

        //gameplay HUD main container is the parent container
        this.parentContainer = parentContainer

        //constants from config
        //how much uplink value the meter starts with
        this.currentUplink = levelConfig.PLAYER_STARTING_UPLINK
        this.maxUplink = levelConfig.PLAYER_MAX_UPLINK
        
        
        this.targetUplink = this.currentUplink

        this.colorHealthy = new THREE.Color(levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.meterColors["healthy"])
        this.colorWarning = new THREE.Color(levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.meterColors["warning"])
        this.colorCritical = new THREE.Color(levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.meterColors["critical"])
        this.currentColor = new THREE.Color(0x00ffcc)
        this.targetColor = new THREE.Color(0x00ffcc)

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'packet meter container'

        //get constants from config
        this.backgroundPadding = levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.backgroundPadding
        this.meterWidth = levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.meterWidth
        this.meterHeight = levelConfig.UI_COMPONENT_SETTINGS.uplinkMeter.meterHeight

        //BACKGROUND 
        this.backgroundPlateGeometry = new THREE.PlaneGeometry(
            this.meterWidth + this.backgroundPadding, this.meterHeight + this.backgroundPadding
        )
        this.backgroundPlateMaterial = new THREE.MeshStandardMaterial({
            color: 0x767676
        })
        this.backgroundMesh = new THREE.Mesh(this.backgroundPlateGeometry, this.backgroundPlateMaterial)
        this.backgroundMesh.name = "uplink meter bg"

        //MAIN METER
        //initialize meter geometry
        const uplinkRatio = this.currentUplink/this.maxUplink
        this.mainMeterGeometry = new THREE.PlaneGeometry(this.meterWidth, this.meterHeight)
        this.mainMeterGeometry.translate(this.meterWidth / 2, 0, 0)
        //material
        this.mainMeterMaterial = new THREE.MeshBasicMaterial()
        //mesh
        this.mainMeterMesh = new THREE.Mesh(this.mainMeterGeometry, this.mainMeterMaterial)
        this.mainMeterMesh.name = "uplink meter main"
        this.mainMeterMesh.scale.x = uplinkRatio
        this.mainMeterMesh.position.x = -this.meterWidth / 2

    }

    init = () => {

        //add everything to groups
        this.mainContainer.add(this.backgroundMesh, this.mainMeterMesh)
        // this.mainContainer.rotation.z = Math.PI/2
        this.parentContainer.add(this.mainContainer)
    }


    onBeat = () => {
    }

    //called by score manager -> ui manager -> this method
    updateUplink = (newUplinkValue) => {
        this.targetUplink = newUplinkValue
    }   

    update = (deltaTime) => {

        //lerp the meter amount changes
        if(Math.abs(this.currentUplink - this.targetUplink) > 0.5){
            this.currentUplink = THREE.MathUtils.lerp(
                this.currentUplink,
                this.targetUplink,
                deltaTime * 8
            )
            const uplinkRatio = this.currentUplink/this.maxUplink
            //set new size
            this.mainMeterMesh.scale.x = uplinkRatio
        }

        //color stuff
        const uplinkRatio = this.currentUplink/this.maxUplink
        // figure out target color based on ratio
        if(uplinkRatio > 0.6){
            this.targetColor.set(0x00ffcc)
        } else if(uplinkRatio > 0.3){
            // lerp between warning and healthy based on where we are in the 0.3-0.6 range
            const t = (uplinkRatio - 0.3) / 0.3
            this.targetColor.lerpColors(this.colorCritical, this.colorWarning, t)
        } else {
            this.targetColor.set(0xff2244)
        }
        // lerp current color toward target
        this.currentColor.lerp(this.targetColor, deltaTime * 5)

        // apply to material
        this.mainMeterMaterial.color.copy(this.currentColor)

    }

    reset = () => {
        this.currentUplink = levelConfig.PLAYER_STARTING_UPLINK
        this.targetUplink = levelConfig.PLAYER_STARTING_UPLINK  
        this.displayUplink = levelConfig.PLAYER_STARTING_UPLINK

        //reset meter length
        const uplinkRatio = this.currentUplink/this.maxUplink
        this.mainMeterMesh.scale.x = uplinkRatio
        this.peakMeterStartingPosition = this.mainMeterMesh.position.x + this.meterWidth * uplinkRatio
        this.peakMesh.position.x = this.peakMeterStartingPosition

    }
}