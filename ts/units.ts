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
	symbol: string,
	definition: SiDefinition,
	alternative?: {
		symbol: string
	}
}

type Units = {
	SI: string[],
	derived: DerivedUnit[],
	prefixes: {
		symbol: string,
		exponent: number
	}[],
};



let UNITS: Units = {
	SI: ["kg", "m", "s", "A", "K", "mol", "cd", "rad", "sr"],
	derived: [
		{
			symbol: "Hz",
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
	prefixes: [
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
}