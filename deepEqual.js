function deepEqual(a, b) {
	if (a === b) return true
	if (typeof a != typeof b) return false
	if (typeof a == 'function' || typeof b == 'function') return true
	if (typeof a != 'object') return false

	for (const key in a) {
		if (!deepEqual(a[key], b[key])) return false
	}
	for (const key in b) {
		if (!(key in a) && b[key] !== undefined) return false
	}

	if (a instanceof Array && !(b instanceof Array)) return false

	if (a instanceof Set) {
		if (!(b instanceof Set)) return false
		
		nextFirstSetValue:
		for (const aValue of a) {
			for (const bValue of b) {
				if (deepEqual(aValue, bValue)) continue nextFirstSetValue
			}
			return false
		}

		nextSecondSetValue:
		for (const aValue of b) {
			for (const bValue of a) {
				if (deepEqual(aValue, bValue)) continue nextSecondSetValue
			}
			return false
		}
	}
	else if (a instanceof Map ) {
		if (!(b instanceof Map)) return false

		for (const [key, value] of a.entries()) {
			if (!deepEqual(b.get(key), value)) return false
		}

		for (const key of b.keys()) {
			if (!a.has(key)) return false
		}
	}

	return true
}

export default deepEqual
