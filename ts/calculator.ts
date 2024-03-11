type Unit = {
	multiplier: number,
	kg: number,
	m: number,
	s: number,
	A: number,
	K: number,
	mol: number,
	cd: number,
	rad: number,
	sr: number,
	compounds: {
		name: string, 
		power: number
	}[]
}

function fract_to_si_unit(fract: Fraction): Unit {
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
		if(found) {
			found.p += u.p;
		}
		else {
			merged.push(u);
		}
	}

	// change combined units to SI units
	let si_units: Unit = {
		multiplier: mult,
		kg: 0,
		m: 0,
		s: 0,
		A: 0,
		K: 0,
		mol: 0,
		cd: 0,
		rad: 0,
		sr: 0,
		compounds: [],
	};
	
	for(let u of merged) {
		let found = UNITS.SI.find((s) => s.symbol == u.v);
		if(found) {
			// @ts-ignore
			si_units[found.symbol]! += u.p;
		}
		else {
			let derived = UNITS.derived.find((d) => d.symbol == u.v);
			if(derived) {
				for(let k in derived.definition) {
					// @ts-ignore
					si_units[k] += derived.definition[k] * u.p;
				}
			}
		}
	}

	return si_units;
}