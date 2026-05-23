
import { GAME_STATES } from "../gameStates"

export default class StateMachine {
    constructor(app, statesDict){
        this.app = app
        this.statesDict = statesDict
        this.currentState = null
        // this.currentState = initialState
        // this.currentState.onEnter()
    }

    setState = (newState) => {
        console.log(`state changing: ${this.currentState} to ${newState}`)
        if(this.currentState)this.currentState.onExit()
        this.currentState = this.statesDict[newState]
        this.currentState.onEnter()
    }

    update = (deltaTime) => {
        this.currentState.update(deltaTime)
    }
}