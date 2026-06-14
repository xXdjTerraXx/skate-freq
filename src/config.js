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
    PLAYER_STARTING_HEALTH: 30000,
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