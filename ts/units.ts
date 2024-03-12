type Factor = {
	value: string,
	power: string,
	error: boolean,
}

type Fraction = {
	numerator: Factor[],
	denumerator: Factor[],
	error: string,
	hard_error: boolean,
}


type SiDefinition = {
	kg: number,
	m: number,
	s: number,
	A: number,
	K: number,
	mol: number,
	cd: number,
	rad: number,
	sr: number,
}

type Unit = {
	multiplier: number,
	definition: SiDefinition,
	compounds: {
		name: string, 
		power: number
	}[]
}


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
		exponent: number
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
			exponent: 30
		},
		{
			name: "ronna",
			symbol: "R",
			exponent: 27
		},
		{
			name: "yotta",
			symbol: "Y",
			exponent: 24
		},
		{
			name: "zetta",
			symbol: "Z",
			exponent: 21
		},
		{
			name: "exa",
			symbol: "E",
			exponent: 18
		},
		{
			name: "peta",
			symbol: "P",
			exponent: 15
		},
		{
			name: "tera",
			symbol: "T",
			exponent: 12
		},
		{
			name: "giga",
			symbol: "G",
			exponent: 9
		},
		{
			name: "mega",
			symbol: "M",
			exponent: 6
		},
		{
			name: "kilo",
			symbol: "k",
			exponent: 3
		},
		{
			name: "hecto",
			symbol: "h",
			exponent: 2
		},
		{
			name: "deca",
			symbol: "da",
			exponent: 1
		},
		{
			name: "deci",
			symbol: "d",
			exponent: -1
		},
		{
			name: "centi",
			symbol: "c",
			exponent: -2
		},
		{
			name: "milli",
			symbol: "m",
			exponent: -3
		},
		{
			name: "micro",
			symbol: "µ",
			exponent: -6
		},
		{
			name: "nano",
			symbol: "n",
			exponent: -9
		},
		{
			name: "pico",
			symbol: "p",
			exponent: -12
		},
		{
			name: "femto",
			symbol: "f",
			exponent: -15
		},
		{
			name: "atto",
			symbol: "a",
			exponent: -18
		},
		{
			name: "zepto",
			symbol: "z",
			exponent: -21
		},
		{
			name: "yocto",
			symbol: "y",
			exponent: -24
		},
		{
			name: "ronto",
			symbol: "r",
			exponent: -27
		},
		{
			name: "quecto",
			symbol: "q",
			exponent: -30
		}
	]
}