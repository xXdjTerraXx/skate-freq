export default class Controller{
    constructor(app, level, player, hitManager){
        this.app = app
        this.level = level
        this.player = player
        this.hitManager = hitManager

        this.leftArrow = 'ArrowLeft'
        this.rightArrow = 'ArrowRight'
        this.qKey = 'KeyQ'
        this.eKey = 'KeyE'
        this.aKey = 'KeyA'
        this.sKey = 'KeyS'
        this.dKey = 'KeyD'
        this.wKey = 'KeyW'
        this.spacebar = 'Space'
    }

    init = () => {
        window.addEventListener('keydown', (e) => {
            //left lane switch
            if (e.code === this.leftArrow || e.code === this.qKey) {
                this.rotateRightPress()
            }
            //right lane switch
            if (e.code ===  this.rightArrow || e.code === this.eKey) {
                this.rotateLeftPress()
            }
            //crouch
            if(e.code === this.spacebar){
                this.crouch()
            }
            //player subLane movement/tricks
            if(e.code === this.aKey){
                //is the player on a ramp?
                if(this.level.playerIsInAir){
                //if so handle an air trick
                    this.handlePlayerTrick('A')
                }
                //if not, sublane switch
                else{
                    this.handlePlayerSubLaneSwitch(0)
                }
            }
            if(e.code === this.sKey){
                if(this.level.playerIsInAir){
                    this.handlePlayerTrick('S')
                }
                else{
                    this.handlePlayerSubLaneSwitch(1)
                }
            }
            if(e.code === this.dKey){
                if(this.level.playerIsInAir){
                    this.handlePlayerTrick('D')
                }
                else{
                    this.handlePlayerSubLaneSwitch(2)
                }
            }
            if(e.code === this.wKey){
                if(this.level.playerIsInAir){
                    this.handlePlayerLand()
                }
            }
        })

        window.addEventListener('keyup', (e) => {
             //jump
            if(e.code === this.spacebar){
                this.jump()
            }
        })
    }

    rotateLeftPress = () => {
        console.log("LEFT KEY PRESS")
        this.level.changeLane(1)
        this.player.playAnimation('powerslide')
    }

    rotateRightPress = () => {
        console.log("RIGHT KEY PRESS")
        this.level.changeLane(-1)
        this.player.playAnimation('powerslide')
    }

    crouch = () => {
        console.log("CROUCH PRESS")
        this.player.handleCrouch()
    }

    jump = () => {
        console.log("SPACE BAR UP")

        const { ramp, currentTime } = this.level.checkRampHit()
        console.log("DEBUGGIN SOME SHIT",ramp, currentTime)
        this.player.handleJump()
        if(this.app.level.isActivated) this.hitManager.registerHit(ramp, currentTime)
        this.player.pulse()
    }

    handlePlayerTrick = (keyString) => {
        const { trick, currentTime } = this.level.handlePlayerTrick(keyString)
        if(this.app.level.isActivated) this.hitManager.registerTrickHit(trick, currentTime)
    }

    handlePlayerLand = () => {
        this.player.setSubLane(1)
        const currentTime = this.level.handlePlayerLand
        this.hitManager.registerLandingHit(currentTime)
    }

    handlePlayerSubLaneSwitch = (index) => {
        //DEBUG play key press click
        this.app.audioManager.playKeyPressClick()
        //move the player to the correct sub lane
        this.player.setSubLane(index)
        //check for a tapNote hit inside of Level
        const { tapNote, currentTime } = this.level.checkTapNoteHit(index)
        if(this.app.level.isActivated) this.hitManager.registerHit(tapNote, currentTime)
        //player pulse effect
        this.player.pulse()
    }

    run = (deltaTime) => {
        // if(this.moveKeys.left === true){
        //     this.player.direction = -1
        //     this.player.isMoving = true
        // }
        // else if(this.moveKeys.right === true){
        //     this.player.direction = 1
        //     this.player.isMoving = true
        // }
        // else {
        //     this.player.direction = 0
        //     this.player.isMoving = false
        // }
    }
}