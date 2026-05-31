import * as THREE from 'three'
import { createCircleMath, createTextNode } from '../utils'
import { levelConfig } from '../config'

export default class SongSelectScreen{
    constructor(app, loadedSongs){
        this.app = app
        //an array from audio manager
        this.loadedSongs = loadedSongs
        this.loadedSongArray = Object.entries(this.loadedSongs)
        this.selectedIndex = 0

        this.mainContainer = new THREE.Group()
        this.mainContainer.label = 'song select container'
        this.mainContainer.position.set(0,0,0)

        this.ringContainer = new THREE.Group()
        this.ringContainer.label = 'song select RING container'
        this.ringContainer.position.set(0,0,0)
        this.ringContainer.rotation.y=(2*Math.PI*1.2)

        this.cardsContainer = new THREE.Group()
        this.cardsContainer.label = 'song select CARDS container'
        this.cardsContainer.position.set(0,0,0)

        this.ringGeometry = new THREE.RingGeometry(1, 0.97, levelConfig.LANE_COUNT)
        this.ringMaterial = new THREE.MeshBasicMaterial({
            color: levelConfig.RING_COLOR,
            side: THREE.DoubleSide
        })
        this.ringMesh = new THREE.Mesh(this.ringGeometry, this.ringMaterial)

        this.ringContainer.add(this.ringMesh, this.cardsContainer)
        this.mainContainer.add(this.ringContainer)

        //this array just holds all the song cards just in case it's needed
        this.songCardArray = []


        /////////////////////////////
        ///circle mafs ya daft cunt///
        //this is the distance between each point where a song card will be around the 
        //circle.
        this.angleStep = Math.PI * 2 / this.loadedSongArray.length


        //these values for lerping ring movement
        this.currentRotation = 0
        this.targetRotation = 0
    }

    handleSelect = () => {
        this.app.audioManager.selectSong(
            this.loadedSongArray[this.selectedIndex][0]
        )
    }

    incrementSelection = (upOrDown) => {
        //upOrDown === 1 || -1
        this.selectedIndex += upOrDown
        if(this.selectedIndex>this.loadedSongArray.length-1)this.selectedIndex = 0
        else if(this.selectedIndex < 0)this.selectedIndex = this.loadedSongArray.length - 1

        //rotate the selection circle
        // this.ringContainer.rotation.x += upOrDown * this.angleStep
        
        //get target rotation on key press
        this.targetRotation -= upOrDown * this.angleStep

    }

    

    initUi = () => {
        //offset to keep selected card centered and close to camera
        const ANGLE_OFFSET = Math.PI
        const vertices = createCircleMath(0,0,1,this.loadedSongArray.length, ANGLE_OFFSET)
        this.loadedSongArray.forEach((songDetailsArray, i) => {
            ///////~*~*~*  TO DO  *~*~*~///////////////////////
            const songObject = songDetailsArray[1]
            const x = vertices[i].x
            const y = vertices[i].y
            const z = vertices[i].z
            console.log("DEBUG SONG OBJECT: ", i, songObject)
            ///////~*~*~*  <3<3<3  *~*~*~//////////////////////
            const newSongCard = new SongCard(songObject, i, x, y, z, this.cardsContainer)
            //push to array for safe keeping
            this.songCardArray.push(newSongCard)
        })
    }

    resetUi = () => {

    }

    makeCardsFaceZ = () => {
        this.songCardArray.forEach(songCard => {
            songCard.cardGroup.lookAt(0, 0, 2)
        })
    }

    handleLerp = (deltaTime) => {
        const lerpFactor = 1- Math.pow(.001, deltaTime)
        this.currentRotation += (this.targetRotation - this.currentRotation) * lerpFactor
        this.ringContainer.rotation.x = this.currentRotation
    }

    update = (deltaTime) => {
        this.handleLerp(deltaTime)
        //keep all the cards correctly facing the camera
        this.makeCardsFaceZ()
    }

}

class SongCard {
    constructor(songObject, index, x, y, z, parentContainer){
        this.songTitle = songObject.title
        this.songArtist = songObject.artist
        this.parentContainer = parentContainer

        //main group for the whole card. holds textGroup and geometryGroup
        this.cardGroup = new THREE.Group()
        this.cardGroup.name = `${index} song card`
        this.cardGroup.position.set(x,y,0)

        //this group just holds the TEXT
        this.textGroup = new THREE.Group()
        this.textGroup.name = `${index} song card text group`
        this.textGroup.position.set(0,0,.01)

        //this group just holds the GEMOETRY
        this.geometryGroup = new THREE.Group()
        this.geometryGroup.name = `${index} song card geometry group`
        this.geometryGroup.position.set(0,0,0)

        this.HEIGHT = .3
        this.WIDTH = .2
        this.FONT_SIZE = .1

        this.backgroundGeometry = new THREE.PlaneGeometry(1.8, 0.5)
        this.backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff})
        this.backgroundMesh = new THREE.Mesh(this.backgroundGeometry, this.backgroundMaterial)

        this.borderGeometry = new THREE.EdgesGeometry(this.backgroundGeometry)
        this.borderMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff })
        this.borderMesh = new THREE.LineSegments(this.borderGeometry, this.borderMaterial)
        this.borderMesh.position.z = 0.01

        this.titleText = createTextNode({text: `${this.songTitle}`, fontSize: this.FONT_SIZE, color: 0xffffff, x: 0, y: -.1, z: 0})
        this.artistText = createTextNode({text: `${this.songArtist}`, fontSize: this.FONT_SIZE, color: 0xffffff, x: 0, y: 0, z: 0})

        this.geometryGroup.add(this.backgroundMesh, this.borderMesh)
        this.textGroup.add(this.titleText, this.artistText)
        this.cardGroup.add(this.geometryGroup, this.textGroup)
        //add to main container that holds all cards
        this.parentContainer.add(this.cardGroup)
    }

    select = () => {

    }

    deselect = () => {
        
    }
}