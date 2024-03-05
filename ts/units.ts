type Units = {
	SI: string[],
	derived: {
		name: string,
		symbol: string,
		definition: {
			multiplier?: number,
			kg?: number,
			m?: number,
			s?: number,
			A?: number,
			K?: number,
			mol?: number,
			cd?: number,
			rad?: number,
			sr?: number,
		},
		alternative?: {
			name: string,
			symbol: string
		}
	}[],
	prefixes: {
		name: string,
		symbol: string,
		multiplier: number
	}[]
};

let UNITS: Units = {
	SI: ["kg", "m", "s", "A", "K", "mol", "cd", "rad", "sr"],
	derived: [
		{
			name: "gram",
			symbol: "g",
			definition: {
				multiplier: 0.001,
				kg: 1
			}
		},
		{
			name: "hertz",
			symbol: "Hz",
			definition: {
				s: -1
			},
			alternative: {
				name: "becquerel",
				symbol: "Bq"
			}
		},
		{
			name: "newton",
			symbol: "N",
			definition: {
				kg: 1,
				m: 1,
				s: -2
			}
		},
		{
			name: "pascal",
			symbol: "Pa",
			definition: {
				kg: 1,
				m: -1,
				s: -2
			}
		},
		{
			name: "joule",
			symbol: "J",
			definition: {
				kg: 1,
				m: 2,
				s: -2
			}
		},
		{
			name: "watt",
			symbol: "W",
			definition: {
				kg: 1,
				m: 2,
				s: -3
			}
		},
		{
			name: "coulomb",
			symbol: "C",
			definition: {
				s: 1,
				A: 1
			}
		},
		{
			name: "volt",
			symbol: "V",
			definition: {
				kg: 1,
				m: 2,
				s: -3,
				A: -1
			}
		},
		{
			name: "farad",
			symbol: "F",
			definition: {
				kg: -1,
				m: -2,
				s: 4,
				A: 2
			}
		},
		{
			name: "ohm",
			symbol: "Ω",
			definition: {
				kg: 1,
				m: 2,
				s: -3,
				A: -2
			}
		},
		{
			name: "siemens",
			symbol: "S",
			definition: {
				kg: -1,
				m: -2,
				s: 3,
				A: 2
			}
		},
		{
			name: "weber",
			symbol: "Wb",
			definition: {
				kg: 1,
				m: 2,
				s: -2,
				A: -1
			}
		},
		{
			name: "tesla",
			symbol: "T",
			definition: {
				kg: 1,
				s: -2,
				A: -1
			}
		},
		{
			name: "henry",
			symbol: "H",
			definition: {
				kg: 1,
				m: 2,
				s: -2,
				A: -2
			}
		},
		{
			name: "lumen",
			symbol: "lm",
			definition: {
				cd: 1,
				sr: 1
			}
		},
		{
			name: "lux",
			symbol: "lx",
			definition: {
				m: -2,
				cd: 1,
				sr: 1
			}
		},
		{
			name: "gray",
			symbol: "Gy",
			definition: {
				m: 2,
				s: -2
			},
			"alternative": {
				name: "sievert",
				symbol: "Sv"
			}
		},
		{
			name: "katal",
			symbol: "kat",
			definition: {
				s: -1,
				mol: 1
			}
		}
	],
	"prefixes": [
		{
			name: "quetta",
			symbol: "Q",
			multiplier: 1e30
		},
		{
			name: "ronna",
			symbol: "R",
			multiplier: 1e27
		},
		{
			name: "yotta",
			symbol: "Y",
			multiplier: 1e24
		},
		{
			name: "zetta",
			symbol: "Z",
			multiplier: 1e21
		},
		{
			name: "exa",
			symbol: "E",
			multiplier: 1e18
		},
		{
			name: "peta",
			symbol: "P",
			multiplier: 1e15
		},
		{
			name: "tera",
			symbol: "T",
			multiplier: 1e12
		},
		{
			name: "giga",
			symbol: "G",
			multiplier: 1e9
		},
		{
			name: "mega",
			symbol: "M",
			multiplier: 1e6
		},
		{
			name: "kilo",
			symbol: "k",
			multiplier: 1e3
		},
		{
			name: "hecto",
			symbol: "h",
			multiplier: 1e2
		},
		{
			name: "deca",
			symbol: "da",
			multiplier: 1e1
		},
		{
			name: "deci",
			symbol: "d",
			multiplier: 1e-1
		},
		{
			name: "centi",
			symbol: "c",
			multiplier: 1e-2
		},
		{
			name: "milli",
			symbol: "m",
			multiplier: 1e-3
		},
		{
			name: "micro",
			symbol: "µ",
			multiplier: 1e-6
		},
		{
			name: "nano",
			symbol: "n",
			multiplier: 1e-9
		},
		{
			name: "pico",
			symbol: "p",
			multiplier: 1e-12
		},
		{
			name: "femto",
			symbol: "f",
			multiplier: 1e-15
		},
		{
			name: "atto",
			symbol: "a",
			multiplier: 1e-18
		},
		{
			name: "zepto",
			symbol: "z",
			multiplier: 1e-21
		},
		{
			name: "yocto",
			symbol: "y",
			multiplier: 1e-24
		},
		{
			name: "ronto",
			symbol: "r",
			multiplier: 1e-27
		},
		{
			name: "quecto",
			symbol: "q",
			multiplier: 1e-30
		}
	]
}