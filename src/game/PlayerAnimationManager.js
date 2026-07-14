import { levelConfig } from "../config"
import ENUMS from "../enums"
import * as THREE from 'three'

export default class AnimationManager {
  constructor(mixer, animations) {
    this.mixer = mixer
    this.actions = animations
    this.currentAnimation = animations[ENUMS.ANIMATIONS.IDLER]
    this.lastAnimation = this.currentAnimation
    this.pendingReturnTarget = null

    this.legToggle = false

    // set up one-shots (loop once + clamp)
    levelConfig.ONE_SHOT_ANIMATIONS.forEach(name => {
      const action = this.actions[name]
      if (!action) return
      action.setLoop(THREE.LoopOnce)
      action.clampWhenFinished = true
    })

    this.currentAnimation.play()

    // handle one-shots finishing and returning to a target state
    this.mixer.addEventListener('finished', (e) => {
      //this is stale event guard
      if (e.action !== this.currentAnimation) return 
      if (this.pendingReturnTarget) {
        const target = this.pendingReturnTarget
        this.pendingReturnTarget = null
        this.transitionTo(target)
      }
    })
  }

  transitionTo = (name, { crossfadeDuration = 0.05, returnTo = null } = {}) => {
    const next = this.actions[name]
    if (!next) return

    this.lastAnimation = this.currentAnimation

    if (this.currentAnimation) {
      this.currentAnimation.crossFadeTo(next, crossfadeDuration, false)
    }

    next.reset().play()
    this.currentAnimation = next
    this.pendingReturnTarget = returnTo
  }

  autoAlternate = () => {
    if(this.currentAnimation === this.actions[ENUMS.ANIMATIONS.IDLEL] ||
       this.currentAnimation === this.actions[ENUMS.ANIMATIONS.IDLER]){
        this.legToggle = !this.legToggle
        const nextAnimationName = this.legToggle ? ENUMS.ANIMATIONS.IDLEL : ENUMS.ANIMATIONS.IDLER
        this.transitionTo(nextAnimationName)
    }
}

  update = (deltaTime) => {
    this.mixer.update(deltaTime)
  }
}