import * as THREE from 'three'
import { createTextNode } from '../../../utils'
import { levelConfig } from '../../../config'

export default class GenericButton{
    constructor(parentContainer, clickableMeshesArray, componentsArray, position, bgColor, borderColor, fontColor, text){
        this.parentContainer = parentContainer
        this.clickableMeshesArray = clickableMeshesArray
        this.componentsArray = componentsArray
        this.text = text

        //set during init
        this.clickFunction = null

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = `${text} button`
        this.mainContainer.position.set(position.x, position.y, position.z)

        //BACKGROUND SETUP
        this.buttonBackgroundGeometry = new THREE.PlaneGeometry(
                    levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericButton.size.width, 
                    levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericButton.size.height
        )
        this.buttonBackgroundMaterial = new THREE.MeshPhysicalMaterial({
                            color: bgColor,
                            transmission: 0.85,  
                            roughness: 0.15,      
                            metalness: 0.0,
                            thickness: 0.1,
                            transparent: true,
                            depthWrite: false,
                            side: THREE.FrontSide
                        })
        this.buttonBackgroundMesh = new THREE.Mesh(this.buttonBackgroundGeometry, this.buttonBackgroundMaterial)
        this.buttonBackgroundMesh.layers.set(1)
        //TEXT SETUP
        this.buttonLabelTextNode = createTextNode({
            text: `${this.text}`,
            fontSize: levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericButton.fontSize,
            color: fontColor
        })
        //BORDER SETUP
        this.buttonBorderGeometry = new THREE.EdgesGeometry(this.buttonBackgroundGeometry)
        this.buttonBorderMaterial = new THREE.LineBasicMaterial({ color: borderColor })
        this.buttonBorderMesh = new THREE.LineSegments(this.buttonBorderGeometry, this.buttonBorderMaterial)
        this.buttonBorderMesh.position.z = 0.02
        this.buttonBorderMesh.layers.set(1)
        //ADD TO CONTAINERS
        this.mainContainer.add(this.buttonBackgroundMesh, this.buttonBorderMesh, this.buttonLabelTextNode)
        this.parentContainer.add(this.mainContainer)

        

        //ok so basically ifound out every object3d in three.hs has this userData object
        //and it's basically an empty object for whatever. so every editor component will have 
        //these to help with the raycaster/click detection. 
        this.buttonBackgroundMesh.userData.component = this
        this.clickableMeshesArray.push(this.buttonBackgroundMesh)
        //also add to components array
        this.componentsArray.push(this)
    }

    init = (clickFunction) => {
        this.clickFunction = clickFunction
    }

    onClick = () => {
        this.clickFunction()
    }
}