const ENUMS = {
    NOTE_NODE_TYPE: {
        TAPNOTE: 'TAPNOTE',
        RAMP: 'RAMP',
        RAIL: 'RAIL'
    },
    JUDGEMENT: {
        PERFECT: 'PERFECT',
        GOOD: 'GOOD',
        MISS: 'MISS',
        RESYNCED: 'RESYNCED',
        //sync broken is purely internal - player never sees it
        SYNC_BROKEN: 'SYNC_BROKEN',
        HOLD: 'HOLD',
        BAIL: 'BAIL',
        RELEASE: 'RELEASE',
        NEURO: 'NEURO',
        A: 'A',
        S: 'S',
        D: 'D',
        //null is just for utility, preventing double taps,e tc
        NULL: 'NULL'
    },
    HIT_EFFECT_CATEGORY: {
        NOTE: 'NOTE',
        GRIND: 'GRIND',
        LAND: 'LAND',
        TRICK:'TRICK'
    },
    ANIMATIONS: {
        GRIND_ENTER: 'basic_grind_enter',
        GRIND_HOLD: 'basic_grind_hold',
        GRIND_CROUCH: 'grind_crouch',
        GRIND_JUMP: 'grind_jump',
        GRABS:{
            A: 'grab_1',
            S: 'grab_2',
            D: 'grab_3'
        },
        
        PUMPL: 'pump_LL',
        PUMPR: 'pump_RR',
        IDLEL: 'idle_pump_l',
        IDLER: 'idle_pump_r',
        IDLE: 'idle',
        JUMP: 'jump',
        CROUCH: 'crouch',
        POWERSLIDE: 'powerslide',
        MANUAL_ENTER: 'manual_enter',
        MANUAL_HOLD: 'manual_hold'
    }
}

export default ENUMS