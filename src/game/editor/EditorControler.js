export default class EditorControler{
    constructor(app, levelEditor, cursor){
        this.app = app
        this.levelEditor = levelEditor
        this.cursor = cursor

        this.aKey = 'KeyA'
        this.dKey = 'KeyD'
        this.eKey = 'KeyE'
        this.jKey = 'KeyJ'
        this.kKey = 'KeyK'
        this.lKey = 'KeyL'
        this.iKey = 'KeyI'
        this.qKey = 'KeyQ'
        this.wKey = 'KeyW'
        this.sKey = 'KeyS'
        this.spacebar = 'Space'
        this.key1 = 'Digit1'
        this.key2 = 'Digit2'

        // this.heldKeys = new Set()
    }

    addKeyEvents = () => {
        window.addEventListener('keydown', this.controllerKeyEvents)
    }

    controllerKeyEvents = (e) => {
        //lane forward
        if(e.code === this.wKey){
            this.moveTunnel(e)
        }
        //lane back
        if(e.code === this.sKey){
            this.moveTunnel(e)
        }
        //lane switch
        if (e.code === this.aKey) {
            this.rotateTunnel(e)
        }
        //lane switch
        if (e.code ===  this.dKey) {
            this.rotateTunnel(e)
        }
        //crouch
        if(e.code === this.spacebar){
            // this.handleCrouch()
        }
        if(e.code === this.jKey){
            this.handlePlaceTapNote(0)
        }
        if(e.code === this.kKey){
            this.handlePlaceTapNote(1)
        }
        if(e.code === this.lKey){
            this.handlePlaceTapNote(2)
        }
        if(e.code === this.qKey){
            // if(this.player.isInAir) this.handlePlayerTrick('A')
        }
        if(e.code === this.eKey){
            // if(this.player.isInAir) this.handlePlayerTrick('D')
        }
        if(e.code === this.key1){
            this.setNewCamera(0)
        }
        if(e.code === this.key2){
            this.setNewCamera(1)
        }
    }

    removeKeyEvents = () => {
        window.removeEventListener('keydown', this.controllerKeyEvents)
    }

    rotateTunnel = (e) => {
        console.log("editor rotating...")
        if (e.code === this.aKey) this.levelEditor.changeLane(1)
            //right lane switch
        if (e.code ===  this.dKey) this.levelEditor.changeLane(-1)
    }

    handlePlaceTapNote = (subLaneIndex) => {
        this.app.levelEditor.placeTapNote(subLaneIndex)
    }

    moveTunnel = (e) => {
        console.log("editor moving...")
        if (e.code === this.wKey) this.levelEditor.moveTunnel(1)
            //right lane switch
        if (e.code ===  this.sKey) this.levelEditor.moveTunnel(-1)
    }

    setNewCamera = (newIndex) => {
        this.app.setNewCamera(newIndex)
    }

    run = (deltaTime) => {

    }
}