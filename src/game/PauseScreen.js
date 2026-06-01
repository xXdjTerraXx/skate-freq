import * as THREE from 'three'
import { createTextNode } from '../utils'
import { levelConfig } from '../config'

export default class PauseScreen {
    constructor(app) {
        this.app = app

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'pause screen container'
        this.mainContainer.position.set(0, 0, 0)
        //start invisible
        this.mainContainer.visible = false

        // semi transparent dark overlay plane
        this.overlayGeometry = new THREE.PlaneGeometry(10, 10)
        this.overlayMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.6
        })
        this.overlayMesh = new THREE.Mesh(this.overlayGeometry, this.overlayMaterial)
        this.overlayMesh.position.set(0, 0, -0.01)

        // paused text
        this.pausedText = createTextNode({
            text: 'PAUSED',
            fontSize: 0.4,
            color: levelConfig.UI_COLOR_PALETTE.gold,
            x: 0, y: 0.3, z: 0
        })

        this.mainContainer.add(this.overlayMesh, this.pausedText)
    }
}