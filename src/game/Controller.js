export default class Controller{
    constructor(level){
        this.leftArrow = 'ArrowLeft'
        this.rightArrow = 'ArrowRight'
        this.aKey = 'KeyA'
        this.dKey = 'KeyD'
        this.level = level
    }

    init = () => {
        window.addEventListener('keydown', (e) => {
        if (e.code === this.leftArrow || e.code === this.aKey) {
            this.leftKeyPress()
        }

        if (e.code ===  this.rightArrow || e.code === this.dKey) {
            this.rightKeyPress()
        }
        });
    }

    leftKeyPress = () => {
        console.log("LEFT KEY PRESS")
        this.level.changeLane(-1)
    }

    rightKeyPress = () => {
        console.log("RIGHT KEY PRESS")
        this.level.changeLane(1)
    }
}