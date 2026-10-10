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

        this.PLACEMENT_STATUS_ENUMS = {
            ADDED: 'ADDED',
            REPLACED: 'REPLACED', 
            UNCHANGED: 'UNCHANGED', 
            INVALID: 'INVALID'
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

    //check if a tap note already exists at that lane and that beat and returns if one
    //exists, otherwise returns false
    findDuplicate = (noteObj) => {
        return this.noteMap.patterns.tapNotes.find(note => {
            return note.lane === noteObj.lane &&
            note.beat === noteObj.beat
        })
    }

    //adds tap note to the map and returns a status object: 
    // { status: 'ADDED' | 'REPLACED' | 'UNCHANGED' | 'INVALID', note, previousNote }
    addTapNote = (lane, subLane, accumulatorBeat) => {
        const noteToPlace = { lane, subLane, beat: this.accumulatorToSongBeat(accumulatorBeat) }
        //check for valid note placement
        const notePlacementIsValid = this.notePlacementIsValid(accumulatorBeat)
        if(!notePlacementIsValid) return {status: this.PLACEMENT_STATUS_ENUMS.INVALID, note: null, previousNote: null}
        const isDuplicate = this.findDuplicate(noteToPlace)
        //if no duplicate
        if(!isDuplicate){
            this.noteMap.patterns.tapNotes.push(noteToPlace)
            return {status: this.PLACEMENT_STATUS_ENUMS.ADDED, note: noteToPlace, previousNote: null}
        }
        //if duplicate, replace tap note
        //no need to replace if duplicate and new note already same sublane
        if(isDuplicate.subLane === noteToPlace.subLane) return {status: this.PLACEMENT_STATUS_ENUMS.UNCHANGED, note: noteToPlace, previousNote: null}
        else{
            const replacedNote = this.replaceTapNote(isDuplicate, noteToPlace)
            if(!replacedNote) return {status: 'invalid', note: null, previousNote: null}
            return {status: this.PLACEMENT_STATUS_ENUMS.REPLACED, note: replacedNote, previousNote: isDuplicate}
        }
    }

    //calls deleteTapNote and then places a new one
    replaceTapNote = (duplicateNote, newNoteToPlace) => {
        const deletedNote = this.deleteTapNote(duplicateNote)
        if(deletedNote){
            this.noteMap.patterns.tapNotes.push(newNoteToPlace)
            return newNoteToPlace
        }
        else return null
    }

    //deletes and returns deleted note
    deleteTapNote = (noteObj) => {
        const index = this.noteMap.patterns.tapNotes.findIndex(note => {
            return note.beat === noteObj.beat && note.lane === noteObj.lane
        })
        if(index === -1) return null
        return this.noteMap.patterns.tapNotes.splice(index, 1)[0]
    }

    //makes a deep copy of the current note map, sorting note arrays 
    // and setting patternLengthBeats from level editor
    toNoteMap = (newPatternLengthBeats) => {
        //clone the note map and set pattern length from level editor 
        const clone = structuredClone(this.noteMap)
        clone.patternLengthBeats = newPatternLengthBeats
        //sort note arrays
        //TODO: THIS WILL NEED TO CHANGE WHEN NOTES AND RAMPS ARENT JUST EMPTY ARRAYS
        for(const pattern in clone.patterns){
            clone.patterns[pattern].sort((a, b) => a.beat - b.beat)
        }
        return clone
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