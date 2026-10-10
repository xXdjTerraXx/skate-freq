import * as THREE from 'three'
import { COLOR_PALETTE, levelConfig } from '../../../config'
import { createTextNode } from '../../../utils'

export default class GenericCheckbox{
    constructor(app, parentContainer, clickableMeshes, editorComponentsArray, labelText, isChecked, POSITION){
        this.app = app
        this.parentContainer = parentContainer
        this.labelText = labelText
        //set default state from config
        this.isChecked = levelConfig.EDITOR_DISPLAY_LABELS_DEFAULT_VALUE
        this.clickableMeshes = clickableMeshes
        this.editorComponentsArray = editorComponentsArray
        //set during init
        this.clickFunction = null
        
        //CONSTANTS
        this.POSITION = POSITION
        this.GAP = 50 //spacve between box and label
        this.FONT_SIZE = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericCheckbox.fontSize
        this.FONT_COLOR = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericCheckbox.fontColor
        this.BOX_SIZE = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericCheckbox.boxSize
        this.ARM_LENGTH = this.BOX_SIZE * 0.9
        this.ARM_THICKNESS = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericCheckbox.xArmThickness
        this.X_COLOR = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericCheckbox.xColor
        this.BORDER_COLOR = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericCheckbox.borderColor
        this.BOX_BG_COLOR = levelConfig.EDITOR_UI_COMPONENT_SETTINGS.genericCheckbox.boxBackgroundColor

        //CONTAINERS
        this.boxContainer = new THREE.Group()
        this.boxContainer.name = 'box container'

        this.xContainer = new THREE.Group()
        this.xContainer.name = 'x container'
        this.xContainer.visible = false
        
        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'checkbox main container'

        //LABEL
        this.label = createTextNode({
            text: `${this.labelText}`,
            fontSize: this.FONT_SIZE,
            fontColor: this.FONT_COLOR,
            x: this.GAP,
            y: 0,
            z: 0,
        })

        //THE X
        this.xGeometry = new THREE.PlaneGeometry(this.ARM_LENGTH, this.ARM_THICKNESS)
        this.xMaterial = new THREE.MeshBasicMaterial({ color: this.X_COLOR})
        this.arm1 = new THREE.Mesh(this.xGeometry, this.xMaterial)
        this.arm2 = new THREE.Mesh(this.xGeometry, this.xMaterial)
        this.arm1.rotation.z =  Math.PI / 4
        this.arm2.rotation.z = -Math.PI / 4
        this.arm1.position.z = this.arm2.position.z = 0.2
        

        // THE BOX
        this.boxGeometry = new THREE.PlaneGeometry(this.BOX_SIZE, this.BOX_SIZE)
        this.boxMaterial = new THREE.MeshBasicMaterial({ color: this.BOX_BG_COLOR })
        this.boxMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial)
        this.boxMesh.layers.set(1)

        // BOX BORDERS
        this.borderGeometry = new THREE.EdgesGeometry(this.boxGeometry)
        this.borderMaterial = new THREE.LineBasicMaterial({ color: this.BORDER_COLOR })
        this.borderMesh = new THREE.LineSegments(this.borderGeometry, this.borderMaterial)
        this.borderMesh.position.z = 0.1
        this.borderMesh.layers.set(1)

        this.init()
    }

    init = () => {

        this.setChecked()
        
        //add to groups
        this.boxContainer.add(this.boxMesh, this.borderMesh)
        this.xContainer.add(this.arm1, this.arm2)
        this.mainContainer.add(this.boxContainer, this.xContainer, this.label)
        this.parentContainer.add(this.mainContainer)

        //position stuff
        this.mainContainer.position.set(this.POSITION.x, this.POSITION.y, this.POSITION.z)

        //do stuff to make clicking work
        this.clickableMeshes.push(this.boxMesh)
        this.boxMesh.userData.component = this  
        //store in array that lives in EditorWriteHUD
        this.editorComponentsArray.push(this)
    }

    giveClickFunction = (clickFunction) => {
        this.clickFunction = clickFunction
    }

    setChecked = () => {
        this.xContainer.visible = this.isChecked
    }

    toggle = () => {
        this.isChecked = !this.isChecked
    }
    
    onClick = () => {
        console.log("WOOWOWWWW U CLICKED THE CHECK BOXOXOXOXO")
        this.toggle()
        this.setChecked()
        if(this.clickFunction)this.clickFunction(this.isChecked)
    }

    dispose = () => {
        //dispose materials, geometry, and text
        this.borderGeometry.dispose()
        this.borderMaterial.dispose()
        this.boxGeometry.dispose()
        this.boxMaterial.dispose()
        this.label.dispose()
        //clear containers
        this.boxContainer.clear()
        this.xContainer.clear()
        this.mainContainer.clear()
        this.clickFunction = null
    }
}