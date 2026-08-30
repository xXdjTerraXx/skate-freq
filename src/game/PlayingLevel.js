import BaseLevel from "./BaseLevel";

export default class PlayingLevel extends BaseLevel{
    constructor(app, hitManager, overclockVisualsManager){
        super(app)
        this.hitManager = hitManager
        this.overclockVisualsManager = overclockVisualsManager

        //this flag is for cleaning up note arrays after a note has been hit
        this.dirtyNotesExist = false
    
        //this property used for transition from countdown -> playing
        this.isActivated = false

    }
}