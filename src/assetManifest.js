
export const graphics2DAssetManifest = {
    hitEffects: {
        PERFECT: '/assets/img/ui_hits/locked.png',
        GOOD: '/assets/img/ui_hits/clean.png',
        MISS: '/assets/img/ui_hits/dropped.png'
    },
    titleScreen:{
        titleScreen1: '/assets/img/title_screen/title_screen.png'
    },
    textures:{
        circuitEmissive: '/assets/img/textures/circuit_emissive_texture3.png',
        circuitColor: '/assets/img/textures/circuit_color_texture3.png',
        circuitAlphaMap: '/assets/img/textures/circuit_alpha_map3.png'
    }
}

export const graphics3DAssetManifest = {
    character: {
        djTerra: '/assets/models/characters/terra_model.glb'
    },
    environment: {}
}

//all the notes of each song's notemap should be offset by + 4. 
// this will be enforced in the map editor later
export const audioAssetManifest = {
    songs: {
        testSong: {
            path: '/assets/audio/song_library/the_end_of_biters_prefuse_73.wav',
            bpm: 120,  
            title: 'The End of Biters',
            artist: 'Prefuse 73',
            noteMap: {
                patternLengthBeats: 132,
                patterns: {
                    tapNotes: [
                        // =====================
                        // BARS 2-9 (beats 5-36)
                        // LANE 0 — intro, simple quarter notes to get player oriented
                        // (beats 1-4 are SIGNAL WARMUP — no notes)
                        // =====================
                        { lane: 0, subLane: 1, beat: 5 },
                        { lane: 0, subLane: 1, beat: 6 },
                        { lane: 0, subLane: 1, beat: 7 },
                        { lane: 0, subLane: 1, beat: 8 },

                        { lane: 0, subLane: 0, beat: 9 },
                        { lane: 0, subLane: 2, beat: 10 },
                        { lane: 0, subLane: 0, beat: 11 },
                        { lane: 0, subLane: 2, beat: 12 },

                        { lane: 0, subLane: 1, beat: 13 },
                        { lane: 0, subLane: 0, beat: 14 },
                        { lane: 0, subLane: 2, beat: 15 },
                        { lane: 0, subLane: 1, beat: 16 },

                        { lane: 0, subLane: 1, beat: 17 },
                        { lane: 0, subLane: 1, beat: 18 },
                        { lane: 0, subLane: 0, beat: 19 },
                        { lane: 0, subLane: 2, beat: 20 },

                        { lane: 0, subLane: 1, beat: 21 },
                        { lane: 0, subLane: 0, beat: 22 },
                        { lane: 0, subLane: 1, beat: 23 },
                        { lane: 0, subLane: 2, beat: 24 },

                        { lane: 0, subLane: 0, beat: 25 },
                        { lane: 0, subLane: 1, beat: 25.5 },
                        { lane: 0, subLane: 2, beat: 26 },
                        { lane: 0, subLane: 1, beat: 26.5 },

                        { lane: 0, subLane: 1, beat: 27 },
                        { lane: 0, subLane: 0, beat: 28 },
                        { lane: 0, subLane: 1, beat: 29 },
                        { lane: 0, subLane: 2, beat: 30 },

                        { lane: 0, subLane: 0, beat: 31 },
                        { lane: 0, subLane: 1, beat: 32 },
                        { lane: 0, subLane: 2, beat: 33 },
                        { lane: 0, subLane: 1, beat: 34 },
                        { lane: 0, subLane: 0, beat: 35 },
                        { lane: 0, subLane: 1, beat: 36 },

                        // =====================
                        // BARS 10-17 (beats 37-68)
                        // LANE 1 — player should hop here after completing lane 0 OC section
                        // getting busier, eighth notes introduced more
                        // =====================
                        { lane: 1, subLane: 1, beat: 37 },
                        { lane: 1, subLane: 0, beat: 38 },
                        { lane: 1, subLane: 1, beat: 39 },
                        { lane: 1, subLane: 2, beat: 40 },

                        { lane: 1, subLane: 1, beat: 41 },
                        { lane: 1, subLane: 1, beat: 41.5 },
                        { lane: 1, subLane: 0, beat: 42 },
                        { lane: 1, subLane: 0, beat: 42.5 },

                        { lane: 1, subLane: 2, beat: 43 },
                        { lane: 1, subLane: 1, beat: 43.5 },
                        { lane: 1, subLane: 0, beat: 44 },
                        { lane: 1, subLane: 1, beat: 44.5 },

                        { lane: 1, subLane: 1, beat: 45 },
                        { lane: 1, subLane: 2, beat: 46 },
                        { lane: 1, subLane: 1, beat: 47 },
                        { lane: 1, subLane: 0, beat: 48 },

                        { lane: 1, subLane: 0, beat: 49 },
                        { lane: 1, subLane: 1, beat: 49.5 },
                        { lane: 1, subLane: 2, beat: 50 },
                        { lane: 1, subLane: 1, beat: 50.5 },
                        { lane: 1, subLane: 0, beat: 51 },
                        { lane: 1, subLane: 1, beat: 52 },

                        { lane: 1, subLane: 1, beat: 53 },
                        { lane: 1, subLane: 0, beat: 54 },
                        { lane: 1, subLane: 2, beat: 55 },
                        { lane: 1, subLane: 1, beat: 56 },

                        { lane: 1, subLane: 2, beat: 57 },
                        { lane: 1, subLane: 2, beat: 57.5 },
                        { lane: 1, subLane: 1, beat: 58 },
                        { lane: 1, subLane: 1, beat: 58.5 },
                        { lane: 1, subLane: 0, beat: 59 },
                        { lane: 1, subLane: 0, beat: 59.5 },

                        { lane: 1, subLane: 1, beat: 60 },
                        { lane: 1, subLane: 0, beat: 61 },
                        { lane: 1, subLane: 1, beat: 62 },
                        { lane: 1, subLane: 2, beat: 63 },
                        { lane: 1, subLane: 1, beat: 64 },
                        { lane: 1, subLane: 0, beat: 65 },
                        { lane: 1, subLane: 2, beat: 66 },
                        { lane: 1, subLane: 1, beat: 67 },
                        { lane: 1, subLane: 0, beat: 68 },

                        // =====================
                        // BARS 18-25 (beats 69-100)
                        // LANE 2 — things getting spicy, more eighth notes, wider sublane movement
                        // =====================
                        { lane: 2, subLane: 0, beat: 69 },
                        { lane: 2, subLane: 1, beat: 69.5 },
                        { lane: 2, subLane: 2, beat: 70 },
                        { lane: 2, subLane: 1, beat: 70.5 },

                        { lane: 2, subLane: 0, beat: 71 },
                        { lane: 2, subLane: 2, beat: 72 },
                        { lane: 2, subLane: 0, beat: 73 },
                        { lane: 2, subLane: 2, beat: 74 },

                        { lane: 2, subLane: 1, beat: 75 },
                        { lane: 2, subLane: 1, beat: 75.5 },
                        { lane: 2, subLane: 0, beat: 76 },
                        { lane: 2, subLane: 0, beat: 76.5 },
                        { lane: 2, subLane: 2, beat: 77 },
                        { lane: 2, subLane: 2, beat: 77.5 },

                        { lane: 2, subLane: 1, beat: 78 },
                        { lane: 2, subLane: 0, beat: 79 },
                        { lane: 2, subLane: 2, beat: 80 },
                        { lane: 2, subLane: 1, beat: 81 },

                        { lane: 2, subLane: 0, beat: 82 },
                        { lane: 2, subLane: 1, beat: 82.5 },
                        { lane: 2, subLane: 2, beat: 83 },
                        { lane: 2, subLane: 1, beat: 83.5 },
                        { lane: 2, subLane: 0, beat: 84 },

                        { lane: 2, subLane: 2, beat: 85 },
                        { lane: 2, subLane: 1, beat: 85.5 },
                        { lane: 2, subLane: 0, beat: 86 },
                        { lane: 2, subLane: 1, beat: 86.5 },
                        { lane: 2, subLane: 2, beat: 87 },

                        { lane: 2, subLane: 0, beat: 88 },
                        { lane: 2, subLane: 2, beat: 89 },
                        { lane: 2, subLane: 0, beat: 90 },
                        { lane: 2, subLane: 2, beat: 91 },
                        { lane: 2, subLane: 1, beat: 92 },

                        { lane: 2, subLane: 0, beat: 93 },
                        { lane: 2, subLane: 1, beat: 93.5 },
                        { lane: 2, subLane: 2, beat: 94 },
                        { lane: 2, subLane: 1, beat: 94.5 },
                        { lane: 2, subLane: 0, beat: 95 },
                        { lane: 2, subLane: 2, beat: 96 },
                        { lane: 2, subLane: 1, beat: 97 },
                        { lane: 2, subLane: 0, beat: 98 },
                        { lane: 2, subLane: 2, beat: 99 },
                        { lane: 2, subLane: 1, beat: 100 },

                        // =====================
                        // BARS 26-33 (beats 101-132)
                        // LANE 3 — finale, most intense, lots of eighth notes
                        // player should have full SURGE if they've been chasing OC sections
                        // =====================
                        { lane: 3, subLane: 0, beat: 101 },
                        { lane: 3, subLane: 1, beat: 101.5 },
                        { lane: 3, subLane: 2, beat: 102 },
                        { lane: 3, subLane: 1, beat: 102.5 },
                        { lane: 3, subLane: 0, beat: 103 },
                        { lane: 3, subLane: 2, beat: 104 },

                        { lane: 3, subLane: 1, beat: 105 },
                        { lane: 3, subLane: 0, beat: 105.5 },
                        { lane: 3, subLane: 2, beat: 106 },
                        { lane: 3, subLane: 0, beat: 106.5 },
                        { lane: 3, subLane: 1, beat: 107 },
                        { lane: 3, subLane: 2, beat: 107.5 },
                        { lane: 3, subLane: 1, beat: 108 },

                        { lane: 3, subLane: 0, beat: 109 },
                        { lane: 3, subLane: 2, beat: 110 },
                        { lane: 3, subLane: 0, beat: 111 },
                        { lane: 3, subLane: 2, beat: 112 },

                        { lane: 3, subLane: 1, beat: 113 },
                        { lane: 3, subLane: 1, beat: 113.5 },
                        { lane: 3, subLane: 0, beat: 114 },
                        { lane: 3, subLane: 0, beat: 114.5 },
                        { lane: 3, subLane: 2, beat: 115 },
                        { lane: 3, subLane: 2, beat: 115.5 },
                        { lane: 3, subLane: 1, beat: 116 },

                        { lane: 3, subLane: 0, beat: 117 },
                        { lane: 3, subLane: 1, beat: 117.5 },
                        { lane: 3, subLane: 2, beat: 118 },
                        { lane: 3, subLane: 1, beat: 118.5 },
                        { lane: 3, subLane: 0, beat: 119 },
                        { lane: 3, subLane: 2, beat: 120 },

                        { lane: 3, subLane: 1, beat: 121 },
                        { lane: 3, subLane: 0, beat: 121.5 },
                        { lane: 3, subLane: 1, beat: 122 },
                        { lane: 3, subLane: 2, beat: 122.5 },
                        { lane: 3, subLane: 1, beat: 123 },
                        { lane: 3, subLane: 0, beat: 123.5 },
                        { lane: 3, subLane: 2, beat: 124 },

                        { lane: 3, subLane: 0, beat: 125 },
                        { lane: 3, subLane: 2, beat: 126 },
                        { lane: 3, subLane: 0, beat: 127 },
                        { lane: 3, subLane: 2, beat: 128 },
                        { lane: 3, subLane: 1, beat: 129 },
                        { lane: 3, subLane: 0, beat: 129.5 },
                        { lane: 3, subLane: 2, beat: 130 },
                        { lane: 3, subLane: 1, beat: 130.5 },
                        { lane: 3, subLane: 0, beat: 131 },
                        { lane: 3, subLane: 2, beat: 131.5 },
                        { lane: 3, subLane: 1, beat: 132 },
                    ],
                    ramps: [
                        // shifted +4, one ramp per 8 bars on strong beats
                        { lane: 0, beat: 12 },
                        { lane: 0, beat: 28 },
                        { lane: 1, beat: 44 },
                        { lane: 1, beat: 60 },
                        { lane: 2, beat: 76 },
                        { lane: 2, beat: 92 },
                        { lane: 3, beat: 108 },
                        { lane: 3, beat: 124 },
                    ]
                },

                // =====================
                // OVERCLOCK SECTIONS — shifted +4
                // beats 1-4 are SIGNAL WARMUP, OC sections start at beat 5
                // =====================
                overclockSections: [
                    { lane: 0, startBeat: 5,   endBeat: 7  },  // DEBUG
                    { lane: 1, startBeat: 37,  endBeat: 39  },  // DEBUG
                    { lane: 2, startBeat: 69,  endBeat: 100 },  // DEBUG
                    { lane: 3, startBeat: 101, endBeat: 132 },  // DEBUG
                    // { lane: 0, startBeat: 5,   endBeat: 36  },  // bars 2-9
                    // { lane: 1, startBeat: 37,  endBeat: 68  },  // bars 10-17
                    // { lane: 2, startBeat: 69,  endBeat: 100 },  // bars 18-25
                    // { lane: 3, startBeat: 101, endBeat: 132 },  // bars 26-33
                    ]
            }
        },
        testSong2: {
            path: '/assets/audio/song_library/test_song_2.wav',
            bpm: 100,  
            title: 'Test Song 2',
            artist: 'xXdjTerraXx',
            noteMap: {
                patternLengthBeats: 132,
                patterns: {
                    tapNotes: [
                        // =====================
                        // BARS 2-9 (beats 5-36)
                        // LANE 0 — intro, simple quarter notes to get player oriented
                        // (beats 1-4 are SIGNAL WARMUP — no notes)
                        // =====================
                        { lane: 0, subLane: 1, beat: 5 },
                        { lane: 0, subLane: 1, beat: 6 },
                        { lane: 0, subLane: 1, beat: 7 },
                        { lane: 0, subLane: 1, beat: 8 },

                        { lane: 0, subLane: 0, beat: 9 },
                        { lane: 0, subLane: 2, beat: 10 },
                        { lane: 0, subLane: 0, beat: 11 },
                        { lane: 0, subLane: 2, beat: 12 },

                        { lane: 0, subLane: 1, beat: 13 },
                        { lane: 0, subLane: 0, beat: 14 },
                        { lane: 0, subLane: 2, beat: 15 },
                        { lane: 0, subLane: 1, beat: 16 },

                        { lane: 0, subLane: 1, beat: 17 },
                        { lane: 0, subLane: 1, beat: 18 },
                        { lane: 0, subLane: 0, beat: 19 },
                        { lane: 0, subLane: 2, beat: 20 },

                        { lane: 0, subLane: 1, beat: 21 },
                        { lane: 0, subLane: 0, beat: 22 },
                        { lane: 0, subLane: 1, beat: 23 },
                        { lane: 0, subLane: 2, beat: 24 },

                        { lane: 0, subLane: 0, beat: 25 },
                        { lane: 0, subLane: 1, beat: 25.5 },
                        { lane: 0, subLane: 2, beat: 26 },
                        { lane: 0, subLane: 1, beat: 26.5 },

                        { lane: 0, subLane: 1, beat: 27 },
                        { lane: 0, subLane: 0, beat: 28 },
                        { lane: 0, subLane: 1, beat: 29 },
                        { lane: 0, subLane: 2, beat: 30 },

                        { lane: 0, subLane: 0, beat: 31 },
                        { lane: 0, subLane: 1, beat: 32 },
                        { lane: 0, subLane: 2, beat: 33 },
                        { lane: 0, subLane: 1, beat: 34 },
                        { lane: 0, subLane: 0, beat: 35 },
                        { lane: 0, subLane: 1, beat: 36 },

                        // =====================
                        // BARS 10-17 (beats 37-68)
                        // LANE 1 — player should hop here after completing lane 0 OC section
                        // getting busier, eighth notes introduced more
                        // =====================
                        { lane: 1, subLane: 1, beat: 37 },
                        { lane: 1, subLane: 0, beat: 38 },
                        { lane: 1, subLane: 1, beat: 39 },
                        { lane: 1, subLane: 2, beat: 40 },

                        { lane: 1, subLane: 1, beat: 41 },
                        { lane: 1, subLane: 1, beat: 41.5 },
                        { lane: 1, subLane: 0, beat: 42 },
                        { lane: 1, subLane: 0, beat: 42.5 },

                        { lane: 1, subLane: 2, beat: 43 },
                        { lane: 1, subLane: 1, beat: 43.5 },
                        { lane: 1, subLane: 0, beat: 44 },
                        { lane: 1, subLane: 1, beat: 44.5 },

                        { lane: 1, subLane: 1, beat: 45 },
                        { lane: 1, subLane: 2, beat: 46 },
                        { lane: 1, subLane: 1, beat: 47 },
                        { lane: 1, subLane: 0, beat: 48 },

                        { lane: 1, subLane: 0, beat: 49 },
                        { lane: 1, subLane: 1, beat: 49.5 },
                        { lane: 1, subLane: 2, beat: 50 },
                        { lane: 1, subLane: 1, beat: 50.5 },
                        { lane: 1, subLane: 0, beat: 51 },
                        { lane: 1, subLane: 1, beat: 52 },

                        { lane: 1, subLane: 1, beat: 53 },
                        { lane: 1, subLane: 0, beat: 54 },
                        { lane: 1, subLane: 2, beat: 55 },
                        { lane: 1, subLane: 1, beat: 56 },

                        { lane: 1, subLane: 2, beat: 57 },
                        { lane: 1, subLane: 2, beat: 57.5 },
                        { lane: 1, subLane: 1, beat: 58 },
                        { lane: 1, subLane: 1, beat: 58.5 },
                        { lane: 1, subLane: 0, beat: 59 },
                        { lane: 1, subLane: 0, beat: 59.5 },

                        { lane: 1, subLane: 1, beat: 60 },
                        { lane: 1, subLane: 0, beat: 61 },
                        { lane: 1, subLane: 1, beat: 62 },
                        { lane: 1, subLane: 2, beat: 63 },
                        { lane: 1, subLane: 1, beat: 64 },
                        { lane: 1, subLane: 0, beat: 65 },
                        { lane: 1, subLane: 2, beat: 66 },
                        { lane: 1, subLane: 1, beat: 67 },
                        { lane: 1, subLane: 0, beat: 68 },

                        // =====================
                        // BARS 18-25 (beats 69-100)
                        // LANE 2 — things getting spicy, more eighth notes, wider sublane movement
                        // =====================
                        { lane: 2, subLane: 0, beat: 69 },
                        { lane: 2, subLane: 1, beat: 69.5 },
                        { lane: 2, subLane: 2, beat: 70 },
                        { lane: 2, subLane: 1, beat: 70.5 },

                        { lane: 2, subLane: 0, beat: 71 },
                        { lane: 2, subLane: 2, beat: 72 },
                        { lane: 2, subLane: 0, beat: 73 },
                        { lane: 2, subLane: 2, beat: 74 },

                        { lane: 2, subLane: 1, beat: 75 },
                        { lane: 2, subLane: 1, beat: 75.5 },
                        { lane: 2, subLane: 0, beat: 76 },
                        { lane: 2, subLane: 0, beat: 76.5 },
                        { lane: 2, subLane: 2, beat: 77 },
                        { lane: 2, subLane: 2, beat: 77.5 },

                        { lane: 2, subLane: 1, beat: 78 },
                        { lane: 2, subLane: 0, beat: 79 },
                        { lane: 2, subLane: 2, beat: 80 },
                        { lane: 2, subLane: 1, beat: 81 },

                        { lane: 2, subLane: 0, beat: 82 },
                        { lane: 2, subLane: 1, beat: 82.5 },
                        { lane: 2, subLane: 2, beat: 83 },
                        { lane: 2, subLane: 1, beat: 83.5 },
                        { lane: 2, subLane: 0, beat: 84 },

                        { lane: 2, subLane: 2, beat: 85 },
                        { lane: 2, subLane: 1, beat: 85.5 },
                        { lane: 2, subLane: 0, beat: 86 },
                        { lane: 2, subLane: 1, beat: 86.5 },
                        { lane: 2, subLane: 2, beat: 87 },

                        { lane: 2, subLane: 0, beat: 88 },
                        { lane: 2, subLane: 2, beat: 89 },
                        { lane: 2, subLane: 0, beat: 90 },
                        { lane: 2, subLane: 2, beat: 91 },
                        { lane: 2, subLane: 1, beat: 92 },

                        { lane: 2, subLane: 0, beat: 93 },
                        { lane: 2, subLane: 1, beat: 93.5 },
                        { lane: 2, subLane: 2, beat: 94 },
                        { lane: 2, subLane: 1, beat: 94.5 },
                        { lane: 2, subLane: 0, beat: 95 },
                        { lane: 2, subLane: 2, beat: 96 },
                        { lane: 2, subLane: 1, beat: 97 },
                        { lane: 2, subLane: 0, beat: 98 },
                        { lane: 2, subLane: 2, beat: 99 },
                        { lane: 2, subLane: 1, beat: 100 },

                        // =====================
                        // BARS 26-33 (beats 101-132)
                        // LANE 3 — finale, most intense, lots of eighth notes
                        // player should have full SURGE if they've been chasing OC sections
                        // =====================
                        { lane: 3, subLane: 0, beat: 101 },
                        { lane: 3, subLane: 1, beat: 101.5 },
                        { lane: 3, subLane: 2, beat: 102 },
                        { lane: 3, subLane: 1, beat: 102.5 },
                        { lane: 3, subLane: 0, beat: 103 },
                        { lane: 3, subLane: 2, beat: 104 },

                        { lane: 3, subLane: 1, beat: 105 },
                        { lane: 3, subLane: 0, beat: 105.5 },
                        { lane: 3, subLane: 2, beat: 106 },
                        { lane: 3, subLane: 0, beat: 106.5 },
                        { lane: 3, subLane: 1, beat: 107 },
                        { lane: 3, subLane: 2, beat: 107.5 },
                        { lane: 3, subLane: 1, beat: 108 },

                        { lane: 3, subLane: 0, beat: 109 },
                        { lane: 3, subLane: 2, beat: 110 },
                        { lane: 3, subLane: 0, beat: 111 },
                        { lane: 3, subLane: 2, beat: 112 },

                        { lane: 3, subLane: 1, beat: 113 },
                        { lane: 3, subLane: 1, beat: 113.5 },
                        { lane: 3, subLane: 0, beat: 114 },
                        { lane: 3, subLane: 0, beat: 114.5 },
                        { lane: 3, subLane: 2, beat: 115 },
                        { lane: 3, subLane: 2, beat: 115.5 },
                        { lane: 3, subLane: 1, beat: 116 },

                        { lane: 3, subLane: 0, beat: 117 },
                        { lane: 3, subLane: 1, beat: 117.5 },
                        { lane: 3, subLane: 2, beat: 118 },
                        { lane: 3, subLane: 1, beat: 118.5 },
                        { lane: 3, subLane: 0, beat: 119 },
                        { lane: 3, subLane: 2, beat: 120 },

                        { lane: 3, subLane: 1, beat: 121 },
                        { lane: 3, subLane: 0, beat: 121.5 },
                        { lane: 3, subLane: 1, beat: 122 },
                        { lane: 3, subLane: 2, beat: 122.5 },
                        { lane: 3, subLane: 1, beat: 123 },
                        { lane: 3, subLane: 0, beat: 123.5 },
                        { lane: 3, subLane: 2, beat: 124 },

                        { lane: 3, subLane: 0, beat: 125 },
                        { lane: 3, subLane: 2, beat: 126 },
                        { lane: 3, subLane: 0, beat: 127 },
                        { lane: 3, subLane: 2, beat: 128 },
                        { lane: 3, subLane: 1, beat: 129 },
                        { lane: 3, subLane: 0, beat: 129.5 },
                        { lane: 3, subLane: 2, beat: 130 },
                        { lane: 3, subLane: 1, beat: 130.5 },
                        { lane: 3, subLane: 0, beat: 131 },
                        { lane: 3, subLane: 2, beat: 131.5 },
                        { lane: 3, subLane: 1, beat: 132 },
                    ],
                    ramps: [
                        // shifted +4, one ramp per 8 bars on strong beats
                        { lane: 0, beat: 12 },
                        { lane: 0, beat: 28 },
                        { lane: 1, beat: 44 },
                        { lane: 1, beat: 60 },
                        { lane: 2, beat: 76 },
                        { lane: 2, beat: 92 },
                        { lane: 3, beat: 108 },
                        { lane: 3, beat: 124 },
                    ]
                },

                // =====================
                // OVERCLOCK SECTIONS — shifted +4
                // beats 1-4 are SIGNAL WARMUP, OC sections start at beat 5
                // =====================
                overclockSections: [
                    { lane: 0, startBeat: 5,   endBeat: 7  },  // DEBUG
                    { lane: 1, startBeat: 37,  endBeat: 39  },  // DEBUG
                    { lane: 2, startBeat: 69,  endBeat: 100 },  // DEBUG
                    { lane: 3, startBeat: 101, endBeat: 132 },  // DEBUG
                    // { lane: 0, startBeat: 5,   endBeat: 36  },  // bars 2-9
                    // { lane: 1, startBeat: 37,  endBeat: 68  },  // bars 10-17
                    // { lane: 2, startBeat: 69,  endBeat: 100 },  // bars 18-25
                    // { lane: 3, startBeat: 101, endBeat: 132 },  // bars 26-33
                    ]
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
