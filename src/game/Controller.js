import { levelConfig } from "../config"
import ENUMS from "../enums"
import GamepadManager from "./GamePadManager"

export default class Controller{
    constructor(app, level, player, hitManager){
        this.app = app
        this.level = level
        this.player = player
        this.hitManager = hitManager

        this.aKey = 'KeyA'
        this.dKey = 'KeyD'
        this.eKey = 'KeyE'
        this.jKey = 'KeyJ'
        this.kKey = 'KeyK'
        this.lKey = 'KeyL'
        this.iKey = 'KeyI'
        this.qKey = 'KeyQ'
        this.wKey = 'KeyW'
        this.eKey = 'KeyE'
        this.spacebar = 'Space'

        this.heldKeys = new Set()

        this.gamepadManager = new GamepadManager(this)
    }

    init = () => {
        window.addEventListener('keydown', (e) => {
            //left lane switch
            if (e.code === this.aKey) {
                this.rotateRightPress()
            }
            //right lane switch
            if (e.code ===  this.dKey) {
                this.rotateLeftPress()
            }
            //crouch
            if(e.code === this.spacebar){
                this.handleCrouch()
            }
            if(e.code === this.jKey){
                this.handlePlayerSubLaneSwitch(0)
            }
            if(e.code === this.kKey){
                this.handlePlayerSubLaneSwitch(1)
            }
            if(e.code === this.lKey){
                this.handlePlayerSubLaneSwitch(2)
            }
            if(e.code === this.qKey){
                if(this.player.isInAir) this.handlePlayerTrick('A')
            }
            if(e.code === this.wKey){
                if(this.player.isInAir) this.handlePlayerTrick('S')
            }
            if(e.code === this.eKey){
                if(this.player.isInAir) this.handlePlayerTrick('D')
            }
///////////////////////POSSIBLE OLD CODE////////////////////////////////////////////////
            // //player subLane movement AND air tricks
            // if(e.code === this.jKey){
            //     //priority is given to tap notes!! so if theres a tap note close
            //     //even if player is technically still in the air, prioritize tap note
            //     if(this.level.hasHittableTapNote()) {
            //         this.handlePlayerSubLaneSwitch(0)
            //     }
            //     //is the player on a ramp?
            //     else if(this.player.isInAir){
            //     //if so handle an air trick
            //         this.handlePlayerTrick('A')
            //     }
            //     //if not, sublane switch
            //     else{
            //         this.handlePlayerSubLaneSwitch(0)
            //     }
            // }
            // if(e.code === this.kKey){
            //     if(this.level.hasHittableTapNote()) {
            //         this.handlePlayerSubLaneSwitch(1)
            //     }
            //     else if(this.player.isInAir){
            //         this.handlePlayerTrick('S')
            //     }
            //     else{
            //         this.handlePlayerSubLaneSwitch(1)
            //     }
            // }
            // if(e.code === this.lKey){
            //     if(this.level.hasHittableTapNote()) {
            //         this.handlePlayerSubLaneSwitch(2)
            //     }
            //     else if(this.player.isInAir){
            //         this.handlePlayerTrick('D')
            //     }
            //     else{
            //         this.handlePlayerSubLaneSwitch(2)
            //     }
            // }
////////////////////////////////////////////////////////////////////////////
            if(e.code === this.iKey){
                if(!this.heldKeys.has(this.iKey)) this.handlePlayerLand()
                this.heldKeys.add(this.iKey)
            }
        })

        window.addEventListener('keyup', (e) => {
             //jump
            if(e.code === this.spacebar){
                this.handleJump()
            }
            //w key up
            if(e.code === this.iKey){
                this.heldKeys.delete(this.iKey)
                if(this.player.isGrinding) this.handleGrindRelease()
            }
        })
    }

    rotateLeftPress = () => {
        console.log("LEFT KEY PRESS")
        this.level.changeLane(1)
        this.player.playAnimation(ENUMS.ANIMATIONS.POWERSLIDE, {returnTo: ENUMS.ANIMATIONS.IDLE})
    }

    rotateRightPress = () => {
        console.log("RIGHT KEY PRESS")
        this.level.changeLane(-1)
        this.player.playAnimation(ENUMS.ANIMATIONS.POWERSLIDE, {returnTo: ENUMS.ANIMATIONS.IDLE})
    }

    handleCrouch = () => {
        this.player.handleCrouch()
    }

    //IMPORTANT NOTE FOR FUTURE ME:
    //the pattern for each of these note node press handlers is this:
    //  - Level.checkRampHit() is called, returns the time of note press and note
    //  - Player class is called to update status (isInAir, isGrinding) and animation
    //  - HitManager also uses note/timing info to score and return a judgement
    //  - judgement gets passed to ScoreManager for ui update
    //  - scoreManager calls UI methods for UI update 

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
            //since no timing on tricks currently, hitScore here is just
            //  basically returning A, S, or D
            const hitScore = this.hitManager.registerTrickHit(trick, currentTime)
            const hitEffectCategory = levelConfig.HIT_EFFECT_CATEGORY_ENUMS.TRICK
            this.player.playAnimation(ENUMS.ANIMATIONS.GRABS[hitScore], {crossfadeDuration: 0.01})
            this.app.ui.gameplayHUD.spawnHitEffect(hitScore, hitEffectCategory)
            this.app.scoreManager.updateScore(hitScore)

            //player pulse effect
            this.player.pulse()
        }
    }

    handlePlayerLand = () => {
        this.player.setSubLane(1)
        this.player.slamDown()

        const { rail, currentTime, timeSinceStart } = this.level.checkRailHit()
        console.log('RAIL DEBUG - rail from checkRailHit: ', rail)
        const landingTime = this.player.landingTime
        //if there is a rail:
        if(rail) {
            const hitScore = this.hitManager.registerHit(rail, currentTime)
            console.log("RAIL DEBUG - hitScore from registerHit", hitScore)
            const grindStartTime = currentTime
            const grindEndTime = grindStartTime + rail.duration //* this.level.secondsPerBeat
            const grindDuration = rail.duration
            this.player.grind(grindStartTime, grindEndTime, grindDuration)           
            this.app.scoreManager.updateGrind(hitScore)
        }
        //if no rail check for resync landing (combo continue/breka)
        else{
            const LANDING_WINDOW = levelConfig.NOTE_TIMING.RESYNCED
            if (Math.abs(this.level.currentTime - this.player.landingTime) < LANDING_WINDOW){
                const hitScore = this.hitManager.registerLandingHit(currentTime, landingTime)
                this.app.scoreManager.updateScore(hitScore)
                //handle animation changes
                if(hitScore === ENUMS.JUDGEMENT.RESYNCED){
                    this.player.resync()
                }
                else{
                    this.player.playAnimation(ENUMS.ANIMATIONS.IDLE)
                }
                //TO DO: this will be where the entry point method in player
                //for trick continuation animation and stuff wil go
                //like:  player.resync() or smthn
            }
            
        }
    }

    handleGrindHold = () => {
        this.player.updateGrind(this.heldKeys.has(this.iKey))
    }

    handleGrindRelease = () => {
        this.player.updateGrind(this.heldKeys.has(this.iKey)) //should this be here? o_O
        const { hitScore, rail } = this.hitManager.registerGrindRelease(this.level.currentTime)
        console.log('GRIND DEBUG - handleGrindRelease hitScore and rail: ', hitScore, rail)
        this.app.scoreManager.updateGrind(hitScore)
    }

    handlePlayerSubLaneSwitch = (index) => {
        if(this.player.isInAir)this.player.slamDown()
        //DEBUG play key press click
    ///////////////   debug feature /////////////
        // this.app.audioManager.playKeyPressClick()
    /////////////////////////////////////////////    
        //move the player to the correct sub lane
        this.player.setSubLane(index)
        //check for a tapNote hit inside of Level
        const { tapNote, currentTime } = this.level.checkTapNoteHit(index)
        if(this.app.level.isActivated) {
            const hitScore = this.hitManager.registerHit(tapNote, currentTime)
            //ignore nulls which are note inputes when no notes
            if(hitScore === ENUMS.JUDGEMENT.NULL) return
            //update score manager

            this.app.scoreManager.updateScore(hitScore)
            
            //is player on a surge panel, handle hits there too
            if(this.app.surgeManager.surging === true){
                this.app.surgeManager.handleNoteHit(hitScore, tapNote.beat)
            }
        }
        //player pulse effect
        this.player.pulse()
    }

    run = (deltaTime) => {
        if(this.player.isGrinding) this.handleGrindHold()
        this.gamepadManager.poll()
    }
}