import { levelConfig } from "../../config"

//------just a note for future me----
//oooOOOOKAY! so the level editor uses an accumulator for some of its math, and that
//starts at 0. but theres also the map/song beat system which starts at beat 1. but also
//there's a 4 beat countdown at the beginning of each song. nbut not being able to place notes
//in countdown is enforced by the level editor itself.
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
        this.noteMap.patternLengthBeats = songLengthInBeats
    }

    //ok accumulator beat indexing is 0, so need to add 1. making these their own method
    //so i can remember lol and to avoid arbitrary '+ 1's
    accumulatorToSongBeat = (accumulatorBeat) => {
        return accumulatorBeat + 1
    }

    mapBeatToAccumulatorBeat = (mapBeat) => {
        return mapBeat - 1
    }

    notePlacementIsValid = (accumulatorBeat) => {
        //account for the countdown
        const mapBeat = this.accumulatorToSongBeat(accumulatorBeat)
        if(mapBeat <= levelConfig.COUNTDOWN_BEATS) return false
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
        const noteToPlace = { lane, subLane, beat: this.accumulatorToSongBeat(accumulatorBeat) }
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