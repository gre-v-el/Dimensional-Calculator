"use strict";
var UNITS = {
    SI: ["kg", "m", "s", "A", "K", "mol", "cd", "rad", "sr"],
    derived: [
        {
            symbol: "Hz",
            multiplier: 1,
            definition: {
                s: -1,
                kg: 0,
                m: 0,
                A: 0,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            },
            alternative: {
                symbol: "Bq"
            }
        },
        {
            symbol: "N",
            multiplier: 1,
            definition: {
                kg: 1,
                m: 1,
                s: -2,
                A: 0,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "Pa",
            multiplier: 1,
            definition: {
                kg: 1,
                m: -1,
                s: -2,
                A: 0,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "J",
            multiplier: 1,
            definition: {
                kg: 1,
                m: 2,
                s: -2,
                A: 0,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "W",
            multiplier: 1,
            definition: {
                kg: 1,
                m: 2,
                s: -3,
                A: 0,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "C",
            multiplier: 1,
            definition: {
                s: 1,
                A: 1,
                kg: 0,
                m: 0,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "V",
            multiplier: 1,
            definition: {
                kg: 1,
                m: 2,
                s: -3,
                A: -1,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "F",
            multiplier: 1,
            definition: {
                kg: -1,
                m: -2,
                s: 4,
                A: 2,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "Ω",
            multiplier: 1,
            definition: {
                kg: 1,
                m: 2,
                s: -3,
                A: -2,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "S",
            multiplier: 1,
            definition: {
                kg: -1,
                m: -2,
                s: 3,
                A: 2,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "Wb",
            multiplier: 1,
            definition: {
                kg: 1,
                m: 2,
                s: -2,
                A: -1,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "T",
            multiplier: 1,
            definition: {
                kg: 1,
                s: -2,
                A: -1,
                m: 0,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "H",
            multiplier: 1,
            definition: {
                kg: 1,
                m: 2,
                s: -2,
                A: -2,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        },
        {
            symbol: "lm",
            multiplier: 1,
            definition: {
                cd: 1,
                sr: 1,
                kg: 0,
                m: 0,
                s: 0,
                A: 0,
                K: 0,
                mol: 0,
                rad: 0
            }
        },
        {
            symbol: "lx",
            multiplier: 1,
            definition: {
                m: -2,
                cd: 1,
                sr: 1,
                kg: 0,
                s: 0,
                A: 0,
                K: 0,
                mol: 0,
                rad: 0
            }
        },
        {
            symbol: "Gy",
            multiplier: 1,
            definition: {
                m: 2,
                s: -2,
                kg: 0,
                A: 0,
                K: 0,
                mol: 0,
                cd: 0,
                rad: 0,
                sr: 0
            },
            "alternative": {
                symbol: "Sv"
            }
        },
        {
            symbol: "kat",
            multiplier: 1,
            definition: {
                s: -1,
                mol: 1,
                kg: 0,
                m: 0,
                A: 0,
                K: 0,
                cd: 0,
                rad: 0,
                sr: 0
            }
        }
    ],
    "prefixes": [
        {
            symbol: "Q",
            exponent: 30
        },
        {
            symbol: "R",
            exponent: 27
        },
        {
            symbol: "Y",
            exponent: 24
        },
        {
            symbol: "Z",
            exponent: 21
        },
        {
            symbol: "E",
            exponent: 18
        },
        {
            symbol: "P",
            exponent: 15
        },
        {
            symbol: "T",
            exponent: 12
        },
        {
            symbol: "G",
            exponent: 9
        },
        {
            symbol: "M",
            exponent: 6
        },
        {
            symbol: "k",
            exponent: 3
        },
        {
            symbol: "h",
            exponent: 2
        },
        {
            symbol: "da",
            exponent: 1
        },
        {
            symbol: "d",
            exponent: -1
        },
        {
            symbol: "c",
            exponent: -2
        },
        {
            symbol: "m",
            exponent: -3
        },
        {
            symbol: "µ",
            exponent: -6
        },
        {
            symbol: "n",
            exponent: -9
        },
        {
            symbol: "p",
            exponent: -12
        },
        {
            symbol: "f",
            exponent: -15
        },
        {
            symbol: "a",
            exponent: -18
        },
        {
            symbol: "z",
            exponent: -21
        },
        {
            symbol: "y",
            exponent: -24
        },
        {
            symbol: "r",
            exponent: -27
        },
        {
            symbol: "q",
            exponent: -30
        }
    ]
};
