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
            //player subLane movement
            if(e.code === this.aKey){
                this.playerSubLaneSwitch(0)
            }
            if(e.code === this.sKey){
                this.playerSubLaneSwitch(1)
            }
            if(e.code === this.dKey){
                this.playerSubLaneSwitch(2)
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
        console.log("SPACE BAR PRESS")
        this.player.jump()
        this.level.checkRampHit()
    }

    playerSubLaneSwitch = (index) => {
        // console.log('111 subState:', this.app.stateMachine.statesDict.PLAYING.subState)
        // console.log('222 note:', this.level.checkTapNoteHit(index).note)
        // console.log('333 currentTime:', this.level.currentTime)
        // console.log('444 first note time:', this.level.tapNotes[0].time)
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