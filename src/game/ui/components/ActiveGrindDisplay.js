import * as THREE from 'three'

export default class ActiveGrindDisplay{
    constructor(parentContainer){
        //gameplay HUD main container is the parent container
        this.parentContainer = parentContainer

        this.mainContainer = new THREE.Group()
        this.mainContainer.name = 'active grind container'
    }

    updateActiveGrind = (grindMultiplier, grindJudgement) => {

    }

    init = () => {

    }

    update = () => {

    }
}