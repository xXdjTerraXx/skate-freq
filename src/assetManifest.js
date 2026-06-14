
export const graphics2DAssetManifest = {
    hitEffects: {
        PERFECT: '/assets/img/ui_hits/perfect.png',
        GOOD: '/assets/img/ui_hits/good.png',
        MISS: '/assets/img/ui_hits/miss.png'
    },
    titleScreen:{
        titleScreen1: '/assets/img/title_screen/title_screen.png'
    },
    textures:{
        circuitEmissive: '/assets/img/textures/circuit_emissive_texture3.png',
        circuitColor: '/assets/img/textures/circuit_color_texture3.png'
    }
}

export const graphics3DAssetManifest = {
    character: {
        djTerra: '/assets/models/characters/terra_model.glb'
    },
    environment: {}
}

export const audioAssetManifest = {
    songs: {
        testSong: {
            path: '/assets/audio/song_library/the_end_of_biters_prefuse_73.wav',
            bpm: 120,  
            title: 'The End of Biters',
            artist: 'Prefuse 73',
            noteMap: {
                patternLengthBeats: 128,
                patterns: {
                    tapNotes: [
                            // =====================
                            // BARS 1-8 (beats 1-32)
                            // LANE 0 — intro, simple quarter notes to get player oriented
                            // =====================
                            { lane: 0, subLane: 1, beat: 1 },
                            { lane: 0, subLane: 1, beat: 2 },
                            { lane: 0, subLane: 1, beat: 3 },
                            { lane: 0, subLane: 1, beat: 4 },
                
                            { lane: 0, subLane: 0, beat: 5 },
                            { lane: 0, subLane: 2, beat: 6 },
                            { lane: 0, subLane: 0, beat: 7 },
                            { lane: 0, subLane: 2, beat: 8 },
                
                            { lane: 0, subLane: 1, beat: 9 },
                            { lane: 0, subLane: 0, beat: 10 },
                            { lane: 0, subLane: 2, beat: 11 },
                            { lane: 0, subLane: 1, beat: 12 },
                
                            { lane: 0, subLane: 1, beat: 13 },
                            { lane: 0, subLane: 1, beat: 14 },
                            { lane: 0, subLane: 0, beat: 15 },
                            { lane: 0, subLane: 2, beat: 16 },
                
                            // lane 0 continues bars 5-8
                            { lane: 0, subLane: 1, beat: 17 },
                            { lane: 0, subLane: 0, beat: 18 },
                            { lane: 0, subLane: 1, beat: 19 },
                            { lane: 0, subLane: 2, beat: 20 },
                
                            { lane: 0, subLane: 0, beat: 21 },
                            { lane: 0, subLane: 1, beat: 21.5 },
                            { lane: 0, subLane: 2, beat: 22 },
                            { lane: 0, subLane: 1, beat: 22.5 },
                
                            { lane: 0, subLane: 1, beat: 23 },
                            { lane: 0, subLane: 0, beat: 24 },
                            { lane: 0, subLane: 1, beat: 25 },
                            { lane: 0, subLane: 2, beat: 26 },
                
                            { lane: 0, subLane: 0, beat: 27 },
                            { lane: 0, subLane: 1, beat: 28 },
                            { lane: 0, subLane: 2, beat: 29 },
                            { lane: 0, subLane: 1, beat: 30 },
                            { lane: 0, subLane: 0, beat: 31 },
                            { lane: 0, subLane: 1, beat: 32 },
                
                            // =====================
                            // BARS 9-16 (beats 33-64)
                            // LANE 1 — player should hop here after completing lane 0 OC section
                            // getting busier, eighth notes introduced more
                            // =====================
                            { lane: 1, subLane: 1, beat: 33 },
                            { lane: 1, subLane: 0, beat: 34 },
                            { lane: 1, subLane: 1, beat: 35 },
                            { lane: 1, subLane: 2, beat: 36 },
                
                            { lane: 1, subLane: 1, beat: 37 },
                            { lane: 1, subLane: 1, beat: 37.5 },
                            { lane: 1, subLane: 0, beat: 38 },
                            { lane: 1, subLane: 0, beat: 38.5 },
                
                            { lane: 1, subLane: 2, beat: 39 },
                            { lane: 1, subLane: 1, beat: 39.5 },
                            { lane: 1, subLane: 0, beat: 40 },
                            { lane: 1, subLane: 1, beat: 40.5 },
                
                            { lane: 1, subLane: 1, beat: 41 },
                            { lane: 1, subLane: 2, beat: 42 },
                            { lane: 1, subLane: 1, beat: 43 },
                            { lane: 1, subLane: 0, beat: 44 },
                
                            { lane: 1, subLane: 0, beat: 45 },
                            { lane: 1, subLane: 1, beat: 45.5 },
                            { lane: 1, subLane: 2, beat: 46 },
                            { lane: 1, subLane: 1, beat: 46.5 },
                            { lane: 1, subLane: 0, beat: 47 },
                            { lane: 1, subLane: 1, beat: 48 },
                
                            { lane: 1, subLane: 1, beat: 49 },
                            { lane: 1, subLane: 0, beat: 50 },
                            { lane: 1, subLane: 2, beat: 51 },
                            { lane: 1, subLane: 1, beat: 52 },
                
                            { lane: 1, subLane: 2, beat: 53 },
                            { lane: 1, subLane: 2, beat: 53.5 },
                            { lane: 1, subLane: 1, beat: 54 },
                            { lane: 1, subLane: 1, beat: 54.5 },
                            { lane: 1, subLane: 0, beat: 55 },
                            { lane: 1, subLane: 0, beat: 55.5 },
                
                            { lane: 1, subLane: 1, beat: 56 },
                            { lane: 1, subLane: 0, beat: 57 },
                            { lane: 1, subLane: 1, beat: 58 },
                            { lane: 1, subLane: 2, beat: 59 },
                            { lane: 1, subLane: 1, beat: 60 },
                            { lane: 1, subLane: 0, beat: 61 },
                            { lane: 1, subLane: 2, beat: 62 },
                            { lane: 1, subLane: 1, beat: 63 },
                            { lane: 1, subLane: 0, beat: 64 },
                
                            // =====================
                            // BARS 17-24 (beats 65-96)
                            // LANE 2 — things getting spicy, more eighth notes, wider sublane movement
                            // =====================
                            { lane: 2, subLane: 0, beat: 65 },
                            { lane: 2, subLane: 1, beat: 65.5 },
                            { lane: 2, subLane: 2, beat: 66 },
                            { lane: 2, subLane: 1, beat: 66.5 },
                
                            { lane: 2, subLane: 0, beat: 67 },
                            { lane: 2, subLane: 2, beat: 68 },
                            { lane: 2, subLane: 0, beat: 69 },
                            { lane: 2, subLane: 2, beat: 70 },
                
                            { lane: 2, subLane: 1, beat: 71 },
                            { lane: 2, subLane: 1, beat: 71.5 },
                            { lane: 2, subLane: 0, beat: 72 },
                            { lane: 2, subLane: 0, beat: 72.5 },
                            { lane: 2, subLane: 2, beat: 73 },
                            { lane: 2, subLane: 2, beat: 73.5 },
                
                            { lane: 2, subLane: 1, beat: 74 },
                            { lane: 2, subLane: 0, beat: 75 },
                            { lane: 2, subLane: 2, beat: 76 },
                            { lane: 2, subLane: 1, beat: 77 },
                
                            { lane: 2, subLane: 0, beat: 78 },
                            { lane: 2, subLane: 1, beat: 78.5 },
                            { lane: 2, subLane: 2, beat: 79 },
                            { lane: 2, subLane: 1, beat: 79.5 },
                            { lane: 2, subLane: 0, beat: 80 },
                
                            { lane: 2, subLane: 2, beat: 81 },
                            { lane: 2, subLane: 1, beat: 81.5 },
                            { lane: 2, subLane: 0, beat: 82 },
                            { lane: 2, subLane: 1, beat: 82.5 },
                            { lane: 2, subLane: 2, beat: 83 },
                
                            { lane: 2, subLane: 0, beat: 84 },
                            { lane: 2, subLane: 2, beat: 85 },
                            { lane: 2, subLane: 0, beat: 86 },
                            { lane: 2, subLane: 2, beat: 87 },
                            { lane: 2, subLane: 1, beat: 88 },
                
                            { lane: 2, subLane: 0, beat: 89 },
                            { lane: 2, subLane: 1, beat: 89.5 },
                            { lane: 2, subLane: 2, beat: 90 },
                            { lane: 2, subLane: 1, beat: 90.5 },
                            { lane: 2, subLane: 0, beat: 91 },
                            { lane: 2, subLane: 2, beat: 92 },
                            { lane: 2, subLane: 1, beat: 93 },
                            { lane: 2, subLane: 0, beat: 94 },
                            { lane: 2, subLane: 2, beat: 95 },
                            { lane: 2, subLane: 1, beat: 96 },
                
                            // =====================
                            // BARS 25-32 (beats 97-128)
                            // LANE 3 — finale, most intense, lots of eighth notes
                            // player should have full SURGE if they've been chasing OC sections
                            // =====================
                            { lane: 3, subLane: 0, beat: 97 },
                            { lane: 3, subLane: 1, beat: 97.5 },
                            { lane: 3, subLane: 2, beat: 98 },
                            { lane: 3, subLane: 1, beat: 98.5 },
                            { lane: 3, subLane: 0, beat: 99 },
                            { lane: 3, subLane: 2, beat: 100 },
                
                            { lane: 3, subLane: 1, beat: 101 },
                            { lane: 3, subLane: 0, beat: 101.5 },
                            { lane: 3, subLane: 2, beat: 102 },
                            { lane: 3, subLane: 0, beat: 102.5 },
                            { lane: 3, subLane: 1, beat: 103 },
                            { lane: 3, subLane: 2, beat: 103.5 },
                            { lane: 3, subLane: 1, beat: 104 },
                
                            { lane: 3, subLane: 0, beat: 105 },
                            { lane: 3, subLane: 2, beat: 106 },
                            { lane: 3, subLane: 0, beat: 107 },
                            { lane: 3, subLane: 2, beat: 108 },
                
                            { lane: 3, subLane: 1, beat: 109 },
                            { lane: 3, subLane: 1, beat: 109.5 },
                            { lane: 3, subLane: 0, beat: 110 },
                            { lane: 3, subLane: 0, beat: 110.5 },
                            { lane: 3, subLane: 2, beat: 111 },
                            { lane: 3, subLane: 2, beat: 111.5 },
                            { lane: 3, subLane: 1, beat: 112 },
                
                            { lane: 3, subLane: 0, beat: 113 },
                            { lane: 3, subLane: 1, beat: 113.5 },
                            { lane: 3, subLane: 2, beat: 114 },
                            { lane: 3, subLane: 1, beat: 114.5 },
                            { lane: 3, subLane: 0, beat: 115 },
                            { lane: 3, subLane: 2, beat: 116 },
                
                            { lane: 3, subLane: 1, beat: 117 },
                            { lane: 3, subLane: 0, beat: 117.5 },
                            { lane: 3, subLane: 1, beat: 118 },
                            { lane: 3, subLane: 2, beat: 118.5 },
                            { lane: 3, subLane: 1, beat: 119 },
                            { lane: 3, subLane: 0, beat: 119.5 },
                            { lane: 3, subLane: 2, beat: 120 },
                
                            { lane: 3, subLane: 0, beat: 121 },
                            { lane: 3, subLane: 2, beat: 122 },
                            { lane: 3, subLane: 0, beat: 123 },
                            { lane: 3, subLane: 2, beat: 124 },
                            { lane: 3, subLane: 1, beat: 125 },
                            { lane: 3, subLane: 0, beat: 125.5 },
                            { lane: 3, subLane: 2, beat: 126 },
                            { lane: 3, subLane: 1, beat: 126.5 },
                            { lane: 3, subLane: 0, beat: 127 },
                            { lane: 3, subLane: 2, beat: 127.5 },
                            { lane: 3, subLane: 1, beat: 128 },
                    ],
                    ramps: [
                        // one ramp per 8 bars on strong beats, spread across lanes
                        { lane: 0, beat: 8 },
                        { lane: 0, beat: 24 },
                        { lane: 1, beat: 40 },
                        { lane: 1, beat: 56 },
                        { lane: 2, beat: 72 },
                        { lane: 2, beat: 88 },
                        { lane: 3, beat: 104 },
                        { lane: 3, beat: 120 },
                    ]
        },
    
        // =====================
        // OVERCLOCK SECTIONS
        // 4 OC sections total — one per lane, each 8 bars (32 beats)
        // completing all 4 = 4 notches = full SURGE meter
        // designed to naturally push player across all 4 lanes
        // sections snap to bar boundaries (multiples of 4 beats)
        // =====================
        overclockSections: [
            { lane: 0, startBeat: 1,  endBeat: 32  },  // bars 1-8,   easy intro section
            { lane: 1, startBeat: 33, endBeat: 64  },  // bars 9-16,  medium section
            { lane: 2, startBeat: 65, endBeat: 96  },  // bars 17-24, harder section
            { lane: 3, startBeat: 97, endBeat: 128 },  // bars 25-32, finale
        ]
            } 
        },
        testSong2: {
            path: '/assets/audio/song_library/test_song_2.wav',
            bpm: 100,  
            title: 'Test Song 2',
            artist: 'xXdjTerraXx',
            noteMap: {
                patternLengthBeats: 16,
                patterns: {
                    tapNotes: [
                        // beat 1-4: straight quarter notes center lane
                        { lane: 0, subLane: 1, beat: 1 },
                        { lane: 0, subLane: 1, beat: 2 },
                        { lane: 0, subLane: 1, beat: 3 },
                        { lane: 0, subLane: 1, beat: 4 },

                        // beat 5-8: alternating left and right
                        { lane: 0, subLane: 0, beat: 5 },
                        { lane: 0, subLane: 2, beat: 6 },
                        { lane: 0, subLane: 0, beat: 7 },
                        { lane: 0, subLane: 2, beat: 8 },

                        // beat 9-12: eighth notes center
                        { lane: 0, subLane: 1, beat: 9 },
                        { lane: 0, subLane: 1, beat: 9.5 },
                        { lane: 0, subLane: 1, beat: 10 },
                        { lane: 0, subLane: 1, beat: 10.5 },
                        { lane: 0, subLane: 1, beat: 11 },
                        { lane: 0, subLane: 1, beat: 11.5 },

                        // beat 13-16: mixed pattern
                        { lane: 0, subLane: 0, beat: 13 },
                        { lane: 0, subLane: 1, beat: 13.5 },
                        { lane: 0, subLane: 2, beat: 14 },
                        { lane: 0, subLane: 1, beat: 14.5 },
                        { lane: 0, subLane: 0, beat: 15 },
                        { lane: 0, subLane: 2, beat: 16 },
                    ],

                    ramps: [
                    // simple ramps on strong beats
                    { lane: 0, beat: 4 },
                    { lane: 1, beat: 8 },
                    { lane: 2, beat: 12 }
                    ]
                }
            }  
        },
        testSong3: {
            path: '/assets/audio/song_library/test_song_3.wav',
            bpm: 90,  
            title: 'Test Song 3',
            artist: 'xXdjTerraXx',
            noteMap: {
                patternLengthBeats: 16,
                patterns: {
                    tapNotes: [
                        // beat 1-4: offbeat pattern, alternating outer lanes
                        { lane: 0, subLane: 0, beat: 1 },
                        { lane: 0, subLane: 2, beat: 1.5 },
                        { lane: 0, subLane: 0, beat: 2.5 },
                        { lane: 0, subLane: 2, beat: 3 },
                        { lane: 0, subLane: 1, beat: 4 },

                        // beat 5-8: eighth note run across all three sub-lanes
                        { lane: 0, subLane: 0, beat: 5 },
                        { lane: 0, subLane: 1, beat: 5.5 },
                        { lane: 0, subLane: 2, beat: 6.5 },
                        { lane: 0, subLane: 1, beat: 7.5 },
                        { lane: 0, subLane: 0, beat: 8.5 },
                        { lane: 0, subLane: 1, beat: 9 },
                        { lane: 0, subLane: 2, beat: 9.5 },

                        // beat 9-12: sparse, heavy hits on strong beats only
                        { lane: 0, subLane: 1, beat: 10 },
                        { lane: 0, subLane: 0, beat: 10.5 },
                        { lane: 0, subLane: 2, beat: 11 },
                        { lane: 0, subLane: 1, beat: 12 },

                        // beat 13-16: chaotic cascade
                        { lane: 0, subLane: 2, beat: 13 },
                        { lane: 0, subLane: 0, beat: 13.5 },
                        { lane: 0, subLane: 2, beat: 14 },
                        { lane: 0, subLane: 0, beat: 14.5 },
                        { lane: 0, subLane: 1, beat: 15 },
                        { lane: 0, subLane: 0, beat: 15.5 },
                        { lane: 0, subLane: 2, beat: 16 },
                        { lane: 0, subLane: 1, beat: 16.5 },
                    ],

                    ramps: [
                    // simple ramps on strong beats
                    { lane: 0, beat: 4 },
                    { lane: 1, beat: 8 },
                    { lane: 2, beat: 12 }
                    ]
                }
            }  
        },
    },

    music: {
        menuMusic1:{
            path: '/assets/audio/ui/select_music.wav',
        }
    },

    sfx:{
        changeSongSelection:{
            path: '/assets/audio/ui/sfx_change_song_selection.wav',
        },
        confirmSelection:{
            path: '/assets/audio/ui/sfx_confirm_selection.wav',
        }
    }

}
