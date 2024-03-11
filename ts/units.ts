type DerivedUnit = {
	name: string,
	symbol: string,
	multiplier: number,
	definition: SiDefinition,
	alternative?: {
		name: string,
		symbol: string
	}

}

type Units = {
	SI: {
		name: string,
		symbol: string,
	}[],
	derived: DerivedUnit[],
	prefixes: {
		name: string,
		symbol: string,
		multiplier: number
	}[]
};

let UNITS: Units = {
	SI: [
		{
			name: "kilogram",
			symbol: "kg",
		},
		{
			name: "meter",
			symbol: "m",
		},
		{
			name: "second",
			symbol: "s",
		},
		{
			name: "ampere",
			symbol: "A",
		},
		{
			name: "kelvin",
			symbol: "K",
		},
		{
			name: "mole",
			symbol: "mol",
		},
		{
			name: "candela",
			symbol: "cd",
		},
		{
			name: "radian",
			symbol: "rd",
		},
		{
			name: "steradian",
			symbol: "sr",
		}
	],
	derived: [
		{
			name: "gram",
			symbol: "g",
			multiplier: 0.001,
			definition: {
				kg: 1,
				m: 0,
				s: 0,
				A: 0,
				K: 0,
				mol: 0,
				cd: 0,
				rad: 0,
				sr: 0
			}
		},
		{
			name: "hertz",
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
				name: "becquerel",
				symbol: "Bq"
			}
		},
		{
			name: "newton",
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
			name: "pascal",
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
			name: "joule",
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
			name: "watt",
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
			name: "coulomb",
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
			name: "volt",
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
			name: "farad",
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
			name: "ohm",
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
			name: "siemens",
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
			name: "weber",
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
			name: "tesla",
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
			name: "henry",
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
			name: "lumen",
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
			name: "lux",
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
			name: "gray",
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
				name: "sievert",
				symbol: "Sv"
			}
		},
		{
			name: "katal",
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