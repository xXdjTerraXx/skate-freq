import { levelConfig } from "../config"

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

        this.heldKeys = new Set()
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
                this.handleCrouch()
            }
            //player subLane movement/tricks
            if(e.code === this.aKey){
                //is the player on a ramp?
                if(this.player.isInAir){
                //if so handle an air trick
                    this.handlePlayerTrick('A')
                }
                //if not, sublane switch
                else{
                    this.handlePlayerSubLaneSwitch(0)
                }
            }
            if(e.code === this.sKey){
                if(this.player.isInAir){
                    this.handlePlayerTrick('S')
                }
                else{
                    this.handlePlayerSubLaneSwitch(1)
                }
            }
            if(e.code === this.dKey){
                if(this.player.isInAir){
                    this.handlePlayerTrick('D')
                }
                else{
                    this.handlePlayerSubLaneSwitch(2)
                }
            }
            if(e.code === this.wKey){
                if(!this.heldKeys.has(this.wKey)) this.handlePlayerLand()
                this.heldKeys.add(this.wKey)
            }
        })

        window.addEventListener('keyup', (e) => {
             //jump
            if(e.code === this.spacebar){
                this.handleJump()
            }
            //w key up
            if(e.code === this.wKey){
                this.heldKeys.delete(this.wKey)
                if(this.player.isGrinding) this.handleGrindRelease()
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

    handleCrouch = () => {
        this.player.handleCrouch()
    }

    handleJump = () => {
        const { ramp, currentTime } = this.level.checkRampHit()
        const secondsPerBeat = this.level.secondsPerBeat
        //handle case for a free jump aka no ramp or rail nearby
        if(!ramp){
            this.player.launch(currentTime, currentTime + secondsPerBeat)
        }
        //handle case for ramp
        else{
            if(this.app.level.isActivated) {
                const hitScore = this.hitManager.registerHit(ramp, currentTime)
                //update score manager
                this.app.scoreManager.updateScore(hitScore)
                this.app.scoreManager.updateHealth(hitScore)
                const hitEffectCategory = levelConfig.HIT_EFFECT_CATEGORY_ENUMS.NOTE
                this.app.ui.gameplayHUD.spawnHitEffect(hitScore, hitEffectCategory)
                const launchTime = ramp.time
                const secondsPerBeat = this.app.level.secondsPerBeat
                const landingTime = ramp.time + ramp.duration * secondsPerBeat
                const rampJumpHeight = levelConfig.PLAYER_MAX_JUMP_HEIGHT
                this.player.launch(launchTime, landingTime, rampJumpHeight)
            }
        }
         this.player.pulse()
    }

    handlePlayerTrick = (keyString) => {
        const { trick, currentTime } = this.level.handlePlayerTrick(keyString)
        if(this.app.level.isActivated) {
            const hitScore = this.hitManager.registerTrickHit(trick, currentTime)
            console.log('THE DEBUG OF A LFIETIME: ', hitScore)
            const hitEffectCategory = levelConfig.HIT_EFFECT_CATEGORY_ENUMS.TRICK
            this.app.ui.gameplayHUD.spawnHitEffect(hitScore, hitEffectCategory)
            this.app.scoreManager.updateScore(hitScore)

            //player pulse effect
            this.player.pulse()
        }
    }

    handlePlayerLand = () => {
        this.player.setSubLane(1)

        const { rail, currentTime, timeDiff } = this.level.checkRailHit()
        const landingTime = this.player.landingTime
        //if there is a rail:
        if(rail) {
            const hitScore = this.hitManager.registerHit(rail, currentTime)
            if(hitScore !== levelConfig.JUDGEMENT_ENUMS.MISS){
                //grind is the entry point for grinds, similar to launch for jumps
                const grindStartTime = currentTime
                const grindEndTime = grindStartTime + rail.duration
                const grindDuration = rail.duration
                this.player.grind(grindStartTime, grindEndTime, grindDuration)
            }
            this.app.scoreManager.updateGrind(hitScore)
            this.app.scoreManager.updateHealth(hitScore)
            const hitEffectCategory = levelConfig.HIT_EFFECT_CATEGORY_ENUMS.NOTE
            this.app.ui.gameplayHUD.spawnHitEffect(hitScore, hitEffectCategory)
        }
        //if no rail check for resync landing (combo continue/breka)
        else{
            const LANDING_WINDOW = levelConfig.NOTE_TIMING.RESYNCED
            if (Math.abs(this.level.currentTime - this.player.landingTime) < LANDING_WINDOW){
                const hitScore = this.hitManager.registerLandingHit(currentTime, landingTime)
                const hitEffectCategory = levelConfig.HIT_EFFECT_CATEGORY_ENUMS.LAND
                this.app.ui.gameplayHUD.spawnHitEffect(hitScore, hitEffectCategory)
                //TO DO: this will be where the entry point method in player
                //for trick continuation animation and stuff wil go
                //like:  handlePlayerManual() or smthn
            }
            
        }
    }

    handleGrindHold = () => {
        this.player.updateGrind(this.heldKeys.has(this.wKey))
        //this hitScore should be HOLD if player holding key, BAIL if not
        // const { hitScore, rail } = this.hitManager.updateGrind(this.level.currentTime)
        // this.app.scoreManager.updateGrind(hitScore)
    }

    handleGrindRelease = () => {
        this.player.updateGrind(this.heldKeys.has(this.wKey)) //should this be here? o_O
        const { hitScore, rail } = this.hitManager.registerGrindRelease(this.level.currentTime)
        this.app.scoreManager.updateGrind(hitScore)
    }

    handlePlayerSubLaneSwitch = (index) => {
        //DEBUG play key press click
        this.app.audioManager.playKeyPressClick()
        //move the player to the correct sub lane
        this.player.setSubLane(index)
        //check for a tapNote hit inside of Level
        const { tapNote, currentTime } = this.level.checkTapNoteHit(index)
        if(this.app.level.isActivated) {
            const hitScore = this.hitManager.registerHit(tapNote, currentTime)
            //update score manager
            this.app.scoreManager.updateScore(hitScore)
            this.app.scoreManager.updateHealth(hitScore)
            //is player on a surge panel, handle hits there too
            if(this.app.surgeManager.surging === true){
                this.app.surgeManager.handleNoteHit(hitScore, noteNode.beat)
            }
            const hitEffectCategory = levelConfig.HIT_EFFECT_CATEGORY_ENUMS.NOTE
            this.app.ui.gameplayHUD.spawnHitEffect(hitScore, hitEffectCategory)
        }
        //player pulse effect
        this.player.pulse()
    }

    run = (deltaTime) => {
        if(this.player.isGrinding) this.handleGrindHold()
        // if(this.heldKeys.has(this.wKey)) this.hitManager.updateGrind()
    }
}