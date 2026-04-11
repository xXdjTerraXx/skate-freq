export default class Controller{
    constructor(level, player){
        this.level = level
        this.player = player

        this.leftArrow = 'ArrowLeft'
        this.rightArrow = 'ArrowRight'
        this.qKey = 'KeyQ'
        this.eKey = 'KeyE'
        this.aKey = 'KeyA'
        this.dKey = 'KeyD'
        this.spacebar = 'Space'


        this.moveKeys = {
            'left': false,
            'right': false,
        }
    }

    init = () => {
        window.addEventListener('keydown', (e) => {
            //left lane switch
            if (e.code === this.leftArrow || e.code === this.qKey) {
                this.rotateLeftPress()
            }
            //right lane switch
            if (e.code ===  this.rightArrow || e.code === this.eKey) {
                this.rotateRightPress()
            }
            //jump
            if(e.code === this.spacebar){
                this.jump()
            }
            //player movement left to right within a lane
            if(e.code === this.aKey){
                this.moveKeys.left = true
            }
            if(e.code === this.dKey){
                this.moveKeys.right = true
            }
        })

        window.addEventListener('keyup', (e) => {
            if(e.code === this.aKey){
                this.moveKeys.left = false
            }
            if(e.code === this.dKey){
                this.moveKeys.right = false
            }
        })
    }

    rotateLeftPress = () => {
        console.log("LEFT KEY PRESS")
        this.level.changeLane(-1)
    }

    rotateRightPress = () => {
        console.log("RIGHT KEY PRESS")
        this.level.changeLane(1)
    }

    jump = () => {
        console.log("SPACE BAR PRESS")
        this.player.jump()
    }

    run = () => {
        if(this.moveKeys.left === true){
            this.player.direction = -1
            this.player.isMoving = true
        }
        else if(this.moveKeys.right === true){
            this.player.direction = 1
            this.player.isMoving = true
        }
        else {
            this.player.direction = 0
            this.player.isMoving = false
        }
    }
}