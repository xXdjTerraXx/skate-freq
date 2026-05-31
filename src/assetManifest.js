
export const graphicsAssetManifest = {
    hitEffects: {
        PERFECT: '/assets/img/ui_hits/perfect.png',
        GOOD: '/assets/img/ui_hits/good.png',
        MISS: '/assets/img/ui_hits/miss.png'
    },
    titleScreen:{
        titleScreen1: '/assets/img/title_screen/title_screen.png'
    }
}

export const audioAssetManifest = {
    songs: {
        testSong: {
            path: '/assets/audio/song_library/the_end_of_biters_prefuse_73.wav',
            bpm: 120,  
            title: 'The End of Biters',
            artist: 'Prefuse 73',
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
