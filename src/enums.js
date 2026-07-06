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
        SYNC_BROKEN: 'SYNC_BROKEN',
        HOLD: 'HOLD',
        BAIL: 'BAIL',
        RELEASE: 'RELEASE',
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
}

export default ENUMS