import * as THREE from 'three'
import { levelConfig } from '../../../config'
import { createTextNode } from '../../../utils'

export default class BPMInput{
    constructor(parentContainer, clickableMeshesArray, editorComponentsArray){
        this.parentContainer = parentContainer
        this.clickableMeshesArray = clickableMeshesArray
        this.editorComponentsArray = editorComponentsArray

        //this is like "focus" state when the user clicks on the element. changes border color
        this.isActive = false
        this.BORDER_COLOR_INACTIVE = 0x6b6260
        this.BORDER_COLOR_ACTIVE = 0x2bfbc9
        this.BORDER_COLOR_SUCCESS = 0x00ff00
        this.BORDER_COLOR_ERROR = 0xff0000

        this.currentBPM = null
        this.currentBpmString = '---'
    }

    init = () => {

        //the container for all the parts of the load song button
        this.bpmInputContainer = new THREE.Group()
        this.bpmInputContainer.name = 'bpm input container'
        this.bpmInputContainer.position.set(
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.position.x, 
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.position.y,
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.position.z
        )

        this.bpmInputBackgroundGeometry = new THREE.PlaneGeometry(
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.size.width, 
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.size.height
        )
        this.bpmInputBackgroundMaterial = new THREE.MeshPhysicalMaterial({
                            color: 0xffffff,
                            transmission: 0.85,  
                            roughness: 0.15,      
                            metalness: 0.0,
                            thickness: 0.1,
                            transparent: true,
                            depthWrite: false,
                            side: THREE.FrontSide
                        })
        this.bpmInputBackgroundMesh = new THREE.Mesh(this.bpmInputBackgroundGeometry, this.bpmInputBackgroundMaterial)
        this.bpmInputBackgroundMesh.layers.set(1)

        //ok so basically ifound out every object3d in three.hs has this userData object
        //and it's basically an empty object for whatever. so every editor component will have 
        //these to help with the raycaster/click detection. 
        this.bpmInputBackgroundMesh.userData.component = this
        this.clickableMeshesArray.push(this.bpmInputBackgroundMesh)

        this.bpmInputBorderGeometry = new THREE.EdgesGeometry(this.bpmInputBackgroundGeometry)
        this.bpmInputBorderMaterial = new THREE.LineBasicMaterial({ color: this.BORDER_COLOR_INACTIVE })
        this.bpmInputBorderMesh = new THREE.LineSegments(this.bpmInputBorderGeometry, this.bpmInputBorderMaterial)
        this.bpmInputBorderMesh.position.z = 0.02
        this.bpmInputBorderMesh.layers.set(1)

        this.bpmInputLabel = createTextNode({
            text: `INPUT BPM`, 
            fontSize:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.fontSize.label, 
            color:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.fontColor, 
            x: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.size.width / 2),
            y: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.size.height / 2) - 20, 
            z: 0,
            layers: 1
        })

        this.currentBpmTextNode = createTextNode({
            text: `${this.currentBpmString}`, 
            fontSize:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.fontSize.text, 
            color:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.fontColor, 
            x: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.bpmInputContainer.size.width / 2),
            y: -1, 
            z: 0,
            layers: 1
        })

        this.bpmInputContainer.add(this.bpmInputBackgroundMesh, this.bpmInputBorderMesh, this.currentBpmTextNode, this.bpmInputLabel)
    
        this.parentContainer.add(this.bpmInputContainer)

        this.editorComponentsArray.push(this)
    }

    onClick = () => {
        console.log("clicked the bpm input!")
        if(!this.isActive)this.toggleActive()
    }

    toggleActive = () => {
        console.log("OFF CLICKL!")
        this.isActive = !this.isActive
        if(this.isActive){
            this.bpmInputBorderMaterial.color.set(this.BORDER_COLOR_ACTIVE)
            if(this.currentBpmString === "---"){
                this.currentBpmString = ""
                this.currentBpmTextNode.text = this.currentBpmString
                this.currentBpmTextNode.sync()
            }
        }else{
            this.bpmInputBorderMaterial.color.set(this.BORDER_COLOR_INACTIVE)
        }
    }

    handleKeyInput = (eventKey) => {
        const regEx = /^\d$/
        const isNumber = regEx.test(eventKey)
        const isBackspace = eventKey === "Backspace"

        if(!isNumber && !isBackspace) return

        //an array of string digits from the currentBPM string
        const currentBpmArray = Array.from(this.currentBpmString)

        //return if backspacing empty string
        if(isBackspace && currentBpmArray.length === 0)return

        //ok backspace case first
        if(isBackspace){
            currentBpmArray.pop()
        }
        //theeen case if player entered a number
        else{
            //sub-case 1 -  ignore if the string already has 3 numbers & user typed a number
            if(currentBpmArray.length > 2){
                return
            }
            //sub-case 2 
            else{
                currentBpmArray.push(eventKey)
            }
        }

        //join the array and update the bpm string!
        this.currentBpmString = currentBpmArray.join('')
        this.currentBpmTextNode.text = this.currentBpmString
        this.currentBpmTextNode.sync()
    }

    //returns true if bpm is valid false if not. also sets border color to success or error 
    //also if valid set this.currentBPM
    checkValidBPM = () => {
        const bpmIsValid = +this.currentBpmString >= 70 && +this.currentBpmString <= 220
        console.log("BPM is valid debug: ", bpmIsValid)
        if(bpmIsValid) {
            this.bpmInputBorderMaterial.color.set(this.BORDER_COLOR_SUCCESS)
            this.currentBPM = +this.currentBpmString
            return true
        }
        else {
            this.bpmInputBorderMaterial.color.set(this.BORDER_COLOR_ERROR)
            return false
        }
    }

    reset = () => {
        this.currentBPM = null
        this.currentBpmString = "---"
        this.currentBpmTextNode.text = this.currentBpmString
        this.currentBpmTextNode.sync()
    }
}