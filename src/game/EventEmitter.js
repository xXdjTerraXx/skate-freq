//simple event emitter system, currently just being used between level and the note nodes
//for when notes need to despawn
export default class EventEmitter{
    constructor(){
        this.listeners = {}
    }

    on = (event, callback) => {
        if(!this.listeners[event]) this.listeners[event] = []
        this.listeners[event].push(callback)
    }

    emit = (event, data) => {
        if(!this.listeners[event]) return
        this.listeners[event].forEach(cb => cb(data))
    }
}