import { GAME_STATES } from "./gameStates"

export const levelConfig = {
    INITIAL_GAME_STATE: GAME_STATES.TITLE,
    TUNNEL_LENGTH: 100,
    TUNNEL_RADIUS: 1,
    LANE_COUNT: 8,
    SUB_LANE_COUNT: 3,
    STARTING_LANE: 0,
    STARTING_SUB_LANE: 1,
    SPEED: 7,
    RING_COUNT: 12,
    RING_SPACING: 2,
    GATE_RING_BEAT_SUBDIVISION: 2,
    RING_COLOR: 0x27BBF5,
    PLAYER_Z_VALUE: .2,
    PLAYER_RING_COLOR: 0x27F542,
    PLAYER_ACCEL: 5,
    PLAYER_STARTING_HEALTH: 3000,
    SURGE_LIMIT: 3,  //how much surge u need to overclock
    COUNTDOWN_OFFSET: 4,  //how many beats the countdown is. used to offset notes
    WORLD_FRICTION: 0.98,
    WORLD_GRAVITY: -.007,
    //how much a miss good or perfect affect player health
    HIT_RATING_VALUES:{
        PERFECT: 3,
        GOOD: 2,
        MISS: -3
    },
    UI_HIT_EFFECT_COLOR_DICT:{
        PERFECT: 0x00FFEE,//<--cyan from UI_COLOR_PALETTE
        GOOD: 0x00FF88,  //<--green from UI_COLOR_PALETTE
        MISS: 0xFF2244 
    },
    UI_FONTS_DICT: {
        uiFont1: '/assets/fonts/OCRAEXT.TTF',
        uiFont2: '/assets/fonts/whitrabt.ttf'
    },
    UI_COLOR_PALETTE: {
        black: '#050510',
        cyan: '#00FFEE',
        orange: '#FF5500',
        purple: '#9900FF',
        gold: '#FFD700',
        green: '#00FF88',
        red: '#FF2244',
        highlight: '#F0F0FF',
    },
    //general ui settings:
    UI_SETTINGS: {
        width: 1600,
        height: 900,
    },
    //UI COORD SYSTEM IS:
    //               height/2
    //                  |
    //                  |
    // -width/2<--------+------->width/2
    //                  |
    //                  |
    //              -height/2
    //positions, sizes, etc for individual ui "components" (meters, indicators, ui text)
    UI_COMPONENT_SETTINGS:{
        //all positions here are positions of the component's main container
        //local positioning within a main container handled in each class
        surgeMeter: {
            position: {x: -600, y: 350, z: 0},
            //meter nodes
            nodeSize: 30,
            fillColor: 0x00ffff, 
            outlineColor: 0x00ffff,
            //meter connecting line stuff
            connectingLineColorInactive: 0xffffff,
            connectingLineColorActive: 0xc979f0,
            baseWaveAmplitude: 1,
            maxWaveAmplitude: 5,
            beatIntensity: 2,
            connectingLineWidth: .02,
        },
        hitEffects: {
            position: {x: 0, y: 0, z: 0}
        },
        scoreContainer: {
            fontSize: 50,
            position: {x: 300, y: 200, z: 0}
        },
        comboContainer: {
            fontSize: 50,
            position: {x: -200, y: -100, z: 0}
        },
        healthContainer: {
            fontSize: 50,
            position: {x: 300, y: 350, z: 0}
        }
    },


    TAP_NOTE_COLORS: {
        0: '#FFD700',
        1: '#00FF88',
        2: '#FF2244'
    },
    //timing windows for all note node - ramps, rails, tapNotes
    NOTE_TIMING: {
        GOOD: 0.3,
        PERFECT: 0.15
    },
    TAP_NOTE_SCORE_DICT: {
        PERFECT: 100,
        GOOD: 50,
        MISS: 0
    },
    OVERCLOCK_VISUALS_SETTINGS:{
        WhooshEmitter: {
            //amount of emitters to spawn at the beginning of level to save resources
            amount: 14,
            //the speed the emitter travels down the lane
            emitterSpeed: 14,
            particleColor: 0x00ffff,
            particleSize: 0.2 ,
            particleSpeed: 3,
            numberOfParticles: 300,
            
            lifetime: 2,
            lifetimeVariation: 1,
            velocity: {
                x: .0025, 
                y: .0025,
                z: 0
            },
            velocityVariation: 1,
            
            trailParticles: {
                speed : 14,
                size: 0.3,
                velocity: {
                    x: 0.01,
                    y: 0.21,
                    z: 0.0
                },
                lifetime: .5,
                numberOfParticles: 4,
                color: 0xffffff
            }
        }
    },






    RENDER_ORDER: {
        WORLD_OPAQUE: 0,      // tunnel, notes, ramps, rings
        FLOOR_GLASS: 1,       // transparent glass panels
        FLOOR_OVERCLOCK: 2,   // opaque circuit board panels
        WORLD_FX: 3,          // hit effects in world space
        UI: 4                 // HUD, score, combo text
    },
    GRAPHICS: {
        BLOOM: {
            STRENGTH: .5,
            RADIUS: 0.4,
            THRESHOLD: 0.3,
        },
        TONE_MAPPING_EXPOSURE: 1.0,
    }
}