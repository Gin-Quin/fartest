import inspect from './inspect.js'
import chalk from 'chalk'

export const deepEqualResults = new class {
	keys = []
	error = ""

	pop() {
		this.keys.pop()
	}
	push(key) {
		this.keys.push(key)
	}
	reset() {
		this.keys = []
		this.error = ""
	}
	get key() {
		return this.keys
			.filter(i => i)
			.map((key, index) => {
				if (isNaN(key)) return index ? `.${key}` : key
				else return `[${key}]`
			})
			.join('')
	}
}

const done = (error = '') => {
	if (error) {
		deepEqualResults.error = error
		return false
	}
	else {
		deepEqualResults.pop()
		return true
	}
}
	
function deepEqual(a, b, doneObjectComparisons = [], key = '') {
	deepEqualResults.push(key)
	if (Object.is(a, b)) return done()
	if (typeof a != typeof b) return done("Types are not the same")
	if (typeof a != 'object') return done("Values mismatch")

	// protection against circular references
	if (doneObjectComparisons.some(([_a, _b]) => a == _a && b == _b)) {
		return done()
	}
	doneObjectComparisons.push([a, b])

	if (a instanceof Array && !(b instanceof Array) || b instanceof Array && !(a instanceof Array))
		return done("One value is an array but not the other")

	if (a instanceof Set || b instanceof Set) {
		if (!(b instanceof Set) || !(a instanceof Set)) return done("One value is a set but not the other")
		
		nextFirstSetValue:
		for (const aValue of a) {
			for (const bValue of b) {
				if (deepEqual(aValue, bValue, doneObjectComparisons)) {
					deepEqualResults.pop()
					deepEqualResults.error = ""
					continue nextFirstSetValue
				}
			}
			return done(`Missing value ${inspect(aValue, false)} in the second set`)
		}

		nextSecondSetValue:
		for (const bValue of b) {
			for (const aValue of a) {
				if (deepEqual(aValue, bValue, doneObjectComparisons)) {
					deepEqualResults.pop()
					deepEqualResults.error = ""
					continue nextSecondSetValue
				}
			}
			return done(`Missing value ${inspect(bValue, false)} in the first set`)
		}
	}
	else if (a instanceof Map || b instanceof Map) {
		if (!(a instanceof Map) || !(b instanceof Map)) return done("One value is a map but not the other")

		nextFirstMapValue:
		for (const [keyA, valueA] of a.entries()) {
			for (const [keyB, valueB] of b.entries()) {
				if (deepEqual(keyA, keyB)) {
					deepEqualResults.pop()
					deepEqualResults.error = ""
					if (!deepEqual(valueA, valueB))
						return false
					continue nextFirstMapValue
				}
			}
			return done(`Key ${inspect(keyA, false)} is missing in the second map`)
		}

		nextSecondMapValue:
		for (const keyB of b.keys()) {
			for (const keyA of a.keys()) {
				if (deepEqual(keyA, keyB)) {
					deepEqualResults.pop()
					deepEqualResults.error = ""
					continue nextSecondMapValue
				}
			}
			return done(`Key ${inspect(keyB, false)} is missing in the first map`)
		}
	}

	// we now compare the properties
	for (const key in a) {
		if (!(key in b) && a[key] !== undefined)
			return done(`Key '${key}' is missing in the first object`)
		if (!deepEqual(a[key], b[key], doneObjectComparisons, key))
			return false
	}
	for (const key in b) {
		if (!(key in a) && b[key] !== undefined) return done(`Key '${key}' is missing in the second object`)
	}

	return done()
}

export default deepEqual
