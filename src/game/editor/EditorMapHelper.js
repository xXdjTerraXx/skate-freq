import { levelConfig } from "../../config"

export default class EditorMapHelper{
    constructor(){
        this.COUNTDOWN_BEATS = levelConfig.COUNTDOWN_BEATS

        this.noteMap = {
            patternLengthBeats: null,
            patterns: {
                tapNotes: [],
                ramps: [],
                rails: [],
            },
            overclockSections: []
        }
    }

    init = (songLengthInBeats) => {
        this.noteMap.patternLengthBeats = songLengthInBeats - this.COUNTDOWN_BEATS
    }

    accumulatorToMapBeat = (accumulatorBeat) => {
        return accumulatorBeat - this.COUNTDOWN_BEATS + 1
    }

    mapBeatToAccumulatorBeat = (mapBeat) => {
        return mapBeat + this.COUNTDOWN_BEATS - 1
    }

    notePlacementIsValid = (accumulatorBeat) => {
        //account for the countdown
        const mapBeat = this.accumulatorToMapBeat(accumulatorBeat)
        if(mapBeat < 1) return false
        return true
    }

    //check if a tap note already exists at that lane and that beat
    hasTapNoteAt = (noteObj) => {
        const noteIsDuplicate = this.noteMap.patterns.tapNotes.some(note => {
            return note.lane === noteObj.lane &&
            note.beat === noteObj.beat
        })
        return noteIsDuplicate
    }

    //adds tap note to the map and returns it (with converted beat space)
    addTapNote = (lane, subLane, accumulatorBeat) => {
        const noteToPlace = { lane, subLane, beat: this.accumulatorToMapBeat(accumulatorBeat) }
        //check for valid note placement, and get a converted beat if so
        const notePlacementIsValid = this.notePlacementIsValid(accumulatorBeat)
        const isDuplicate = this.hasTapNoteAt(noteToPlace)
        if(notePlacementIsValid && !isDuplicate){
            this.noteMap.patterns.tapNotes.push(noteToPlace)
            return noteToPlace
        }
        else return false
    }

    reset = () => {
        //reset noteMap
        this.noteMap.patternLengthBeats = null
        for(let pattern in this.noteMap.patterns){
            this.noteMap.patterns[pattern].length = 0
        }
        this.noteMap.overclockSections.length = 0
    }
}