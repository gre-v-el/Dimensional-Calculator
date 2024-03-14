function fract_to_unit(fract: Fraction): Unit {
	let mult = 1;
	let units: {v: string, p: number}[] = [];
	
	for(let u of fract.numerator) {
		if(!isNaN(Number(u.value))) {
			mult *= Number(u.value) ** Number(u.power);
		}
		units.push({v: u.value, p: Number(u.power)});
	}
	for(let u of fract.denumerator) {
		if(!isNaN(Number(u.value))) {
			mult /= Number(u.value) ** Number(u.power);
		}
		units.push({v: u.value, p: -Number(u.power)});
	}

	// merge like units
	let merged: {v: string, p: number}[] = [];
	for(let u of units) {
		let found = merged.find((m) => m.v == u.v);

		if(found) found.p += u.p;
		else merged.push(u);
	}

	// split prefixes
	for(let u of merged) {
		if(is_basic_unit(u.v)) continue;

		for(let p of UNITS.prefixes) {
			if(!u.v.startsWith(p.symbol)) continue;

			let candidate = u.v.substring(p.symbol.length);
			if(is_basic_unit(candidate)) {
				u.v = candidate;
				mult *= 10 ** (p.exponent * u.p);
			}
		}
	}

	// collect into a unit
	let u: Unit = {
		multiplier: mult,
		definition: {
			kg: 0,
			m: 0,
			s: 0,
			A: 0,
			K: 0,
			mol: 0,
			cd: 0,
			rad: 0,
			sr: 0,
		},
		compounds: [],
	};

	for(let m of merged) {
		let found = UNITS.SI.includes(m.v);
		// @ts-ignore
		if(found) u.definition[m.v]! += m.p;
		else u.compounds.push({name: m.v, power: m.p})
	}

	return u;
}

function expand_si(u: Unit) {
	for(let c of u.compounds) {
		let derived = UNITS.derived.find((d) => d.symbol == c.name);
		if(derived) {
			for(let k in derived.definition) {
				// @ts-ignore
				u.definition[k] += derived.definition[k] * c.power;
			}
		}
	}

	u.compounds = [];
}

function single_heuristic(n: number): number {
	n = Math.abs(n);
	return n >= 1 || n == 0 ? n : 1 / n;
}

function heuristic(unit: Unit): number {
	let sum = 0;
	for(let k in unit.definition) {
		// @ts-ignore 
		sum += single_heuristic(unit.definition[k]);
	}
	for(let c of unit.compounds) {
		sum += single_heuristic(c.power);
	}
	return sum;
}

function divide(u1: Unit, u2: DerivedUnit): Unit {
	let result: Unit = {
		multiplier: u1.multiplier / u2.multiplier,
		definition: {
			kg: 0,
			m: 0,
			s: 0,
			A: 0,
			K: 0,
			mol: 0,
			cd: 0,
			rad: 0,
			sr: 0,
		},
		compounds: u1.compounds.slice(),
	};

	for(let k in u1.definition) {
		// @ts-ignore
		result.definition[k] = u1.definition[k] - u2.definition[k];
	}

	return result;
}

function multiply(u1: Unit, u2: DerivedUnit): Unit {
	let result: Unit = {
		multiplier: u1.multiplier * u2.multiplier,
		definition: {
			kg: 0,
			m: 0,
			s: 0,
			A: 0,
			K: 0,
			mol: 0,
			cd: 0,
			rad: 0,
			sr: 0,
		},
		compounds: u1.compounds.slice(),
	};

	for(let k in u1.definition) {
		// @ts-ignore
		result.definition[k] = u1.definition[k] + u2.definition[k];
	}

	return result;
}

function reduce_unit(unit: Unit): Unit {
	while(true) {
		let best: DerivedUnit | undefined;
		let best_unit: Unit | undefined;
		let mult = true;
		let best_dist = heuristic(unit);

		for(let compound of UNITS.derived) {
			let d = divide(unit, compound);
			let m = multiply(unit, compound);
			let hd = heuristic(d);
			let hm = heuristic(m);
			if(hd < best_dist) {
				best = compound;
				best_unit = d;
				best_dist = hd;
				mult = false;
			}
			if(hm < best_dist) {
				best = compound;
				best_unit = m;
				best_dist = hm;
				mult = true;
			}
		}

		if(best) {
			unit = best_unit!;
			let found = unit.compounds.find((c) => c.name == best!.symbol);
			if(found) found.power += mult ? -1 : 1;
			else unit.compounds.push({name: best.symbol, power: mult ? -1 : 1});
		}
		else {
			break;
		}
	}

	return unit;
}

function si_to_cs(si: SiDefinition, multiplier: number): Unit {
	// change the multiplier according to the conversion factors between si and cs
	multiplier /= (Math.PI * (2 - Math.SQRT2)) ** si.sr;
	multiplier *= 6.02214076e-21 ** si.mol;
	multiplier /= (2*Math.PI) ** si.rad;

	let unit = {
		multiplier: multiplier,
		definition: {
			kg: 0,
			m: 0,
			s: 0,
			A: 0,
			K: 0,
			mol: 0,
			cd: 0,
			rad: 0,
			sr: 0,
		},
		compounds: [
			// the following four require solving a system of four equations
			{
				name: "c",
				power: si.m - si.kg
			},
			{
				name: "cal",
				power: si.kg / 2
			},
			{
				name: "C4",
				power: si.m - si.s - 2*si.kg - si.A
			},
			{
				name: "C",
				power: si.A
			},
			// these are trivial
			{
				name: "deg_C",
				power: si.K
			},
			{
				name: "cd",
				power: si.cd
			},
			{
				name: "con",
				power: si.sr
			},
			{
				name: "cent",
				power: si.mol
			},
			{
				name: "cir",
				power: si.rad
			}
		],
	};

	unit. compounds = unit.compounds.filter((c) => c.power != 0);

	return unit;
}


// kg*m H T ohm / s^2 C C F
// kg5 m7 s-15 A-9
// kg ohm / m A F^3