export default class AudioManager {
  constructor(app, audioAssetManifest) {
    this.app = app
    this.audioAssetManifest = audioAssetManifest
    this.audioContext = null

    this.loadedSounds = {}

    this.isLoaded = false
    this.currentSong = null

    this.latencyOffset = 0.05
  }


  loadSound = (songKey, data) => {
 
    return new Promise((resolve, reject) => {
      const audio = new Audio()
      audio.src = data.path

      //future me---know that canplaythrough is just an event that fires when
      //enough song has loaded so u can play it w/o stop for buffering
      audio.addEventListener('canplaythrough', () => {
          console.log(`audio loaded: ${songKey}`)
          resolve({...data, audio: audio})
      })

      audio.addEventListener('error', (e) => {
          console.error(`failed to load the song ${songKey} at ${data.path} T-T`)
          reject(e)
      })

      audio.load()
    })
  }

  // loops through the manifest and loads all songs. uses promise.all bc it's quicker
  //for big wav files
  loadAllSounds = async () => {
      console.log('loading songs...')
    for(let key in this.audioAssetManifest){
      this.loadedSounds[key] = {}
      //okkiiii first make the songs object into a little 2d array [...[key, value], [key,value]...]
      const songEntries = Object.entries(this.audioAssetManifest[key])
     
      //map over that 2d array and call loadSound, which returns a promise
      //then use Promise.all on that mapped array
      const results = await Promise.all(
          songEntries.map(([songKey, data]) => {
            return this.loadSound(songKey, data)
          })
      )
      console.log("FUUUUAAAAAAAARRRRRRRKK: ", results)
      //then loop over the results array and put stuff in its respective dict/library/whatever
      results.forEach((songData, i) => {
        
          this.loadedSounds[key][songEntries[i][0]] = songData
      })
    }
    this.isLoaded = true
    console.log('all songs loaded yaay! here they are:', this.loadedSounds)
  }


  selectSong = (songKey) => {
    //check that song exists first
    if(!this.loadedSounds.songs[songKey]){
      console.warn(`song not found: ${songKey}`)
    }
    this.currentSong = this.loadedSounds.songs[songKey]
    console.log("WOO WOO WOOW OOO CURRENT OSNG: ", this.currentSong)
  }

  // sets the active song and plays it from the beginning
  playSong = () => {
      if (!this.isLoaded) {
          console.warn('audio not loaded yet!')
          return
      }
      if (!this.currentSong) {
          console.warn(`no song selected!`)
          return
      }

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

  resetSong = () => {
      this.currentSong.audio.pause()
      this.currentSong.audio.currentTime = 0
  }

  pause = () => {
    this.currentSong.audio.pause()
  }

  resume = () => {
    this.currentSong.audio.play()
  }

  playMenuMusic = () => {
    this.currentSong = this.loadedSounds.music.menuMusic1
    this.playSong()
  }

  playSfx = (sfxKey) => {
    const sfx = this.loadedSounds.sfx[sfxKey].audio
    sfx.currentTime = 0
    sfx.play()
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