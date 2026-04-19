export default class AudioManager {
  constructor() {
    this.audioContext = null
  }

  init = () => {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }

  playClick = (isDownbeat = false) => {
    const ctx = this.audioContext

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "square"
    osc.frequency.value = isDownbeat ? 1000 : 700

    gain.gain.value = isDownbeat ? 0.3 : 0.15

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.05)
    }
}