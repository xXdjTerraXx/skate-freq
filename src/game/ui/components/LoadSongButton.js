import * as THREE from 'three'
import { levelConfig } from '../../../config'
import { createTextNode } from '../../../utils'

export default class LoadSongButton{
    constructor(parentContainer, clickableMeshesArray, editorComponentsArray, editorScreenAssetBundle){
        this.parentContainer = parentContainer
        this.clickableMeshesArray = clickableMeshesArray
        this.editorComponentsArray = editorComponentsArray
        this.editorScreenAssetBundle = editorScreenAssetBundle

        this.songIsLoaded = false
        this.songFileName = ''
        this.loadedFile = null
        this.fileURL = null
    }

    init = () => {

        this.createHiddenInputElement()

        //the container for all the parts of the load song button
        this.loadSongButtonContainer = new THREE.Group()
        this.loadSongButtonContainer.name = 'load song btn container'
        this.loadSongButtonContainer.position.set(
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.position.x, 
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.position.y,
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.position.z
        )
        this.buttonBackgroundGeometry = new THREE.PlaneGeometry(
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.size.width, 
            levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.size.height
        )
        this.buttonBackgroundMaterial = new THREE.MeshPhysicalMaterial({
                            color: 0xffffff,
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

         //ok so basically ifound out every object3d in three.hs has this userData object
        //and it's basically an empty object for whatever. so every editor component will have 
        //these to help with the raycaster/click detection.  
        this.buttonBackgroundMesh.userData.component = this
        this.clickableMeshesArray.push(this.buttonBackgroundMesh)

        this.buttonBorderGeometry = new THREE.EdgesGeometry(this.buttonBackgroundGeometry)
        this.buttonBorderMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
        this.borderMesh = new THREE.LineSegments(this.buttonBorderGeometry, this.buttonBorderMaterial)
        this.borderMesh.position.z = 0.02
        this.borderMesh.layers.set(1)

        this.buttonLabel = createTextNode({
            text: `LOAD SONG`, 
            fontSize:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.fontSize.label, 
            color:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.fontColor, 
            x: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.size.width / 2),
            y: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.size.height / 2) - 20, 
            z: 0,
            layers: 1
        })

        //name of file that player has chosen - inited to hidden. replaces 
        //the folder icon when file chosen
        this.fileNameLabel = createTextNode({
            text: '', 
            fontSize:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.fontSize.label, 
            color:  levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.fontColor, 
            x: -(levelConfig.EDITOR_UI_COMPONENT_SETTINGS.loadSongButtonContainer.size.width / 2),
            y: 0, 
            z: 0,
            layers: 1
        })
        this.fileNameLabel.visible = false

        //folder icon
        this.folderIconMaterial = new THREE.SpriteMaterial({ map: this.editorScreenAssetBundle.folderIcon })
        console.log(this.folderIconMaterial, this.editorScreenAssetBundle, "<---DEBUG")
        this.folderIconSprite = new THREE.Sprite(this.folderIconMaterial)
        //set sprite scale and position
        this.folderIconSprite.name = 'folder_sprite'
        this.folderIconSprite.scale.set(81, 51, 1)
        this.folderIconSprite.position.set(
            0,
            0,
            0
        )
        this.folderIconSprite.layers.set(1)


        this.loadSongButtonContainer.add(this.buttonBackgroundMesh, this.borderMesh, this.buttonLabel, this.folderIconSprite, this.fileNameLabel)
    
        this.parentContainer.add(this.loadSongButtonContainer)

        this.editorComponentsArray.push(this)
    }

    createHiddenInputElement = () => {
        this.hiddenInput = document.createElement("input")
        this.hiddenInput.setAttribute("type", "file")
        this.hiddenInput.setAttribute("accept", "audio/*")
        //add the event listener for when user picks a file
        this.hiddenInput.addEventListener("change", e => this.handleFileSelect(e))
        
    }

    handleFileSelect = (e) => {
            const file = e.target.files[0]
            if(file){
                this.fileURL = URL.createObjectURL(file)
                this.songIsLoaded = true
                this.songFileName = file.name.replaceAll(" ", "_")
                //hide the folder icon
                this.fileNameLabel.text = `${this.songFileName.slice(0, 9)}...`
                this.fileNameLabel.sync()
                this.folderIconSprite.visible = false
                this.fileNameLabel.visible = true
                this.loadedFile = file
            }
        }

    onClick = () => {
        console.log("clicked the load song btn!")
        this.hiddenInput.click()
    }

    reset = () => {
        this.songIsLoaded = false
        this.songFileName = ''
        this.fileNameLabel.text = ''
        this.fileNameLabel.sync()
        this.folderIconSprite.visible = true
        this.fileNameLabel.visible = false
        //this has to be called 
        URL.revokeObjectURL(this.fileURL)
    }

}