export default class AudioManager {
  constructor(app, audioAssetManifest) {
    this.app = app
    this.audioAssetManifest = audioAssetManifest
    this.audioContext = null

    this.loadedSongs = {}

    this.isLoaded = false
    this.currentSong = null

    this.latencyOffset = 0.05
  }


  loadSong = (songKey, data) => {

    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.src = data.path

      //future me---know that canplaythrough is just an event that fires when
      //enough song has loaded so u can play it w/o stop for buffering
      audio.addEventListener('canplaythrough', () => {
          this.loadedSongs[songKey] = {...data, audio: audio}
          console.log(`audio loaded: ${songKey}`)
          resolve()
      })

      audio.addEventListener('error', (e) => {
          console.error(`failed to load the song ${songKey} at ${data.path} T-T`)
          reject(e)
      })

      audio.load()
    })
  }

  // loops through the manifest and loads all songs. uses promise.all bc it's quicker
  //for big audio files
  loadAllSongs = async () => {
      console.log('loading songs...')

      //okkiiii first make the songs object into a little 2d array [[key, value], [key,value]...]
      const songEntries = Object.entries(this.audioAssetManifest.songs)
      console.log('DEBUGGGG, SONG ENTRIES: ', songEntries)
      //then convert each entry of that array into promises (loadSong returns a promiseXD)
      //and load them all at the same time.
      await Promise.all(
          songEntries.map(([songKey, data]) => this.loadSong(songKey, data))
      )

      this.isLoaded = true
      console.log('all songs loaded yaay! here they are:', this.loadedSongs)
  }

  selectSong = (songKey) => {
    //check that song exists first
    if(!this.loadedSongs[songKey]){
      console.warn(`song not found: ${songKey}`)
    }
    this.currentSong = this.loadedSongs[songKey]
  }

  // sets the active song and plays it from the beginning
  playSong = (songKey) => {
      if (!this.isLoaded) {
          console.warn('audio not loaded yet!')
          return
      }
      if (!this.loadedSongs[songKey]) {
          console.warn(`song not found: ${songKey}`)
          return
      }

      // this.currentSong = this.loadedSongs[songKey]
      this.currentSong.audio.currentTime = 0
      this.currentSong.audio.play()
  }

  getCurrentTime = () => {
    if(!this.currentSong)return 0
    //return currentTime but factor in latencyOffset.
    //math.max to prevent from going negative at the start
    return Math.max(0, this.currentSong.audio.currentTime + this.latencyOffset) 
  }

  getCurrentBpm = () => {
    if (!this.currentSong) return null
    return this.currentSong.bpm
}

  // check if the song has ended
  isFinished = () => {
      if (!this.currentSong) return false
      return this.currentSong.audio.ended
  }

  playClick = (isDownbeat = false, offset = 0) => {
    //audio context needs to be created here bc of that bullshit w the browser
    //needing to wait for user input before playing audio
    if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }

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

  playKeyPressClick = () => {
    //audio context needs to be created here bc of that bullshit w the browser
    //needing to wait for user input before playing audio
    if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    const ctx = this.audioContext

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "sawtooth"
    osc.frequency.value = 700

    gain.gain.value = 0.3

    osc.connect(gain)
    gain.connect(ctx.destination)
const latencyOffset = 0.00
    osc.start(ctx.currentTime + latencyOffset)
    osc.stop(ctx.currentTime + 0.05 + latencyOffset)
  }
}