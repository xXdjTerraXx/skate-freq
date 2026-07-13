// GamepadManager.js
import ENUMS from '../enums'

export default class GamepadManager {
  constructor(controller) {
    this.controller = controller
    this.connectedGamepad = null
    this.prevButtonStates = []

    // mirrors Controller's heldKeys pattern, but for gamepad buttons
    this.heldButtons = new Set()

    // BUTTON INDEX MAP — standard gamepad layout
    // adjust these once you've confirmed your Xbox/Switch controllers' actual indices
    this.BUTTONS = {
      FACE_BOTTOM: 0,  // A (Xbox) — launch/crouch (spacebar equivalent)
      FACE_RIGHT: 1,   // B (Xbox) — unmapped for now
      FACE_LEFT: 2,    // X (Xbox) — unmapped for now
      FACE_TOP: 3,     // Y (Xbox) — land/grind (W equivalent)
      L1: 4,           // tap note sublane 0
      R1: 5,           // tap note sublane 1
      R2: 7,           // tap note sublane 2
      DPAD_LEFT: 14,   // tunnel lane switch
      DPAD_RIGHT: 15,  // tunnel lane switch
    }

    window.addEventListener('gamepadconnected', this.handleConnect)
    window.addEventListener('gamepaddisconnected', this.handleDisconnect)
  }

  handleConnect = (e) => {
    console.log('Gamepad connected:', e.gamepad.id, 'mapping:', e.gamepad.mapping)
    this.connectedGamepad = e.gamepad
    this.prevButtonStates = e.gamepad.buttons.map(b => b.pressed)
  }

  handleDisconnect = (e) => {
    console.log('Gamepad disconnected:', e.gamepad.id)
    this.connectedGamepad = null
  }

  // called every frame from Controller.run()
  poll = () => {
    if (!this.connectedGamepad) return

    // gamepad snapshots don't live-update — must re-fetch fresh each frame
    const gamepads = navigator.getGamepads()
    const gp = gamepads[this.connectedGamepad.index]
    if (!gp) return

    gp.buttons.forEach((button, index) => {
      const wasPressed = this.prevButtonStates[index]
      const isPressed = button.pressed

      if (isPressed && !wasPressed) this.handleButtonDown(index)
      if (!isPressed && wasPressed) this.handleButtonUp(index)

      this.prevButtonStates[index] = isPressed
    })
  }

  handleButtonDown = (index) => {
    const c = this.controller
    const B = this.BUTTONS

    switch (index) {
      // tap note sublanes — priority-vs-trick logic already lives in
      // handlePlayerSubLaneSwitch/handlePlayerTrick via Controller,
      // so we just replicate Controller's own keydown branching here
      case B.L1:
        this.resolveTapOrTrick(0, 'A')
        break
      case B.R1:
        this.resolveTapOrTrick(1, 'S')
        break
      case B.R2:
        this.resolveTapOrTrick(2, 'D')
        break

      // lane switching
      case B.DPAD_LEFT:
        c.rotateRightPress()
        break
      case B.DPAD_RIGHT:
        c.rotateLeftPress()
        break

      // A — crouch (mirrors spacebar keydown)
      case B.FACE_BOTTOM:
        c.handleCrouch()
        break

      // Y — land/grind (mirrors W keydown), held via heldButtons same as heldKeys
      case B.FACE_TOP:
        if (!this.heldButtons.has(B.FACE_TOP)) c.handlePlayerLand()
        this.heldButtons.add(B.FACE_TOP)
        break
    }
  }

  handleButtonUp = (index) => {
    const c = this.controller
    const B = this.BUTTONS

    switch (index) {
      // A — jump fires on release, mirroring spacebar's keyup inversion
      case B.FACE_BOTTOM:
        c.handleJump()
        break

      // Y — grind release
      case B.FACE_TOP:
        this.heldButtons.delete(B.FACE_TOP)
        if (c.player.isGrinding) c.handleGrindRelease()
        break
    }
  }

  // replicates the exact tap-note-priority-over-trick logic from
  // Controller's keydown handler, since gamepad buttons need the same branching
  resolveTapOrTrick = (subLaneIndex, trickKeyString) => {
    const c = this.controller
    if (c.level.hasHittableTapNote()) {
      c.handlePlayerSubLaneSwitch(subLaneIndex)
    } else if (c.player.isInAir) {
      c.handlePlayerTrick(trickKeyString)
    } else {
      c.handlePlayerSubLaneSwitch(subLaneIndex)
    }
  }
}