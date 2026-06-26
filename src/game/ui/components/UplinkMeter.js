import * as THREE from 'three'
import { levelConfig } from '../../../config'

//this is sort of like the health bar?? it works like the health meter in DDR
export default class UplinkMeter{
    constructor(parentContainer){

        //gameplay HUD main container is the parent container
        this.parentContainer = parentContainer

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

        })
        this.backgroundMesh = new THREE.Mesh(this.backgroundPlateGeometry, this.backgroundPlateMaterial)
        this.backgroundMesh.name = "uplink meter bg"

        //MAIN METER
        this.mainMeterGeometry = new THREE.PlaneGeometry(
            this.meterWidth, this.meterHeight
        )
        this.mainMeterMaterial = new THREE.MeshBasicMaterial()
        this.mainMeterMesh = new THREE.Mesh(this.mainMeterGeometry, this.mainMeterMaterial)
        this.mainMeterMesh.name = "uplink meter main"

        //OVERYLAY
        this.OVERLAYGeometry = new THREE.PlaneGeometry(
            this.meterWidth, this.meterHeight
        )
        this.overlayMaterial = new THREE.MeshBasicMaterial()
        this.overlayMesh = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.overlayMesh.name = "uplink overlay"
    }

    init = () => {
        this.mainContainer.add(this.backgroundMesh, this.mainMeterMesh)
        this.parentContainer.add(this.mainContainer)
    }


    onBeat = () => {
        this.lines.forEach(line => {
            line.onBeat()
        })
    }

    updateMeter = () => {

    }

    update = (deltaTime) => {

    }

    reset = () => {
        
    }
}