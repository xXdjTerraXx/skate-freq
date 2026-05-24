import { GAME_STATES } from "./gameStates"

export const levelConfig = {
    INITIAL_GAME_STATE: GAME_STATES.TITLE,
    TUNNEL_LENGTH: 100,
    TUNNEL_RADIUS: 1,
    LANE_COUNT: 8,
    SUB_LANE_COUNT: 3,
    STARTING_LANE: 0,
    STARTING_SUB_LANE: 1,
    SPEED: 5,
    RING_COUNT: 12,
    RING_SPACING: 2,
    GATE_RING_BEAT_SUBDIVISION: 2,
    RING_COLOR: 0x27BBF5,
    PLAYER_Z_VALUE: .2,
    PLAYER_RING_COLOR: 0x27F542,
    PLAYER_ACCEL: 5,
    WORLD_FRICTION: 0.98,
    WORLD_GRAVITY: -.008,
    UI_HIT_EFFECT_COLOR_DICT:{
        PERFECT: 0x2b73fb,
        GOOD: 0xfbe52b,
        MISS: 0xfb2b35 
    },
    //timing windows for all note node - ramps, rails, tapNotes
    NOTE_TIMING: {
        GOOD: 0.3,
        PERFECT: 0.15
    }
}