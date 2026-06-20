import { levelConfig } from "../config"
import WhooshEmitter from "./WhooshEmitter"

export default class SurgeManager{
    constructor(app, scoreManager, level, surgeObj){
        this.app = app
        this.scoreManager = scoreManager
        this.level = level
        //surge data for this note map is refrmatted and stored here in init
        this.surgeArray = []

        //whether or not player is passing over a surge panel
        this.surging = false
        //whether or not player has achieved "overclock" (full surge meter)
        this.playerIsOverclocked = false
        //which surge object from the level's note map is player on
        this.currentSurgeObject = null
        //whoosh emitter gets instantiated and inited during init
        this.whooshEmitter = null
    }

    //formatting overclock to add a status property:
    //{lane: 2, startBeat: 1, endBeat: 32, status: 'IDLE'|'IN_PROGRESS' | 'BROKEN' | 'COMPLETED'
    init = (noteMap) => {
        noteMap.overclockSections.forEach(obj => {
            const reformatted = {...obj, status: 'IDLE'}
            this.surgeArray.push(reformatted)
        })
        this.secondsPerBeat = this.level.secondsPerBeat

        //also init the whoosh emitter!
        this.whooshEmitter = new WhooshEmitter(this.app)
        //pass floor panel width to init
        this.whooshEmitter.init(this.app.level.floorPanels[0].panelWidth)
    }

    //hit manager calls this on note hit
    handleNoteHit = (hitScore, noteBeat) => {
        if(!this.currentSurgeObject) return

        if(hitScore === 'PERFECT' || hitScore === 'GOOD'){
            this.app.scoreManager.updateSurge(this.currentSurgeObject, noteBeat)
        }
        else if(hitScore === 'MISS'){
            this.surging = false
            this.currentSurgeObject.status = 'BROKEN'
            this.currentSurgeObject = null
            console.log("U BROKE UR SURGE")
        }
    }

    //spawns whoosh effect and marks completed surge section's status as 'COMPLETE'
    handleSurgeSectionCompleted = () => {
        this.whooshEmitter.handleStart(this.currentSurgeObject)
    }

    update = (deltaTime) => {
        //first reset surging to false
        this.surging = false

        //run whoosh emitter update
        if(this.whooshEmitter.activated)this.whooshEmitter.update(deltaTime)

        //filter surgeArray for surge areas in same lane as player AND has status IDLE
        const filteredLaneMatchArray = this.surgeArray.filter(surge => (surge.lane === this.level.playerCurrentLane ))
        //check if any of those are on same beat as player aka crossing hit line
        filteredLaneMatchArray.forEach(match => {
            const countdownOffsetBeats = 4
            //account for 1 bar offset for the small pause after the countdown
            //as well as the fact that current beat of level starts at 0 instead of 1
            const playerBeat = this.level.currentBeat - this.level.songStartBeat + 1
            const playerInTime = playerBeat >= match.startBeat && playerBeat <= match.endBeat
                if(playerInTime){
                    //ok so a player is on a panel...now what?
                    if((match.status === 'BROKEN' || match.status === 'COMPLETED')){
                        this.surging = false
                        this.currentSurgeObject = null
                        return
                    }
                    else if(match.status === 'IDLE' || match.status === 'IN_PROGRESS'){
                        this.surging = true
                        this.currentSurgeObject = match
                        match.status = 'IN_PROGRESS'
                        console.log('SURGING BABY')
                        // console.log("surge section start beat: ", filteredLaneMatchArray[0].startBeat)
                        // console.log("level current beat: ", this.app.level.currentBeat)
                        // console.log("first note beat: ", this.app.level.tapNotes[0].beat)
                    }
                }
        })
    }

    reset = () => {
        this.surgeArray = []
    }
}