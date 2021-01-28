import start from './index'


start('Even test libraries should have tests', async function({stage, same, different}) {
	stage('Numbers and strings')
	same(5, 5)
	different(5, "5")
	same("5", "5")

	stage('Objects')
	const o = {x: 1, y: 2, z: 3}
	same(o, {x: 1, y: 2, z: 3}, "Same simple objects")
	same(o, {x: 1, z: 3, y: 2}, "Order does not matter")
	different(o, {x: 1, y: 2}, "Missing key")
	different(o, {x: 1, y: 2, z: 4}, "Different key value")
	;(o as any).self = o
	same(o, {x: 1, y: 2, z: 3, self: o}, "Same circular objects")

	stage('Array')
	same([1, 2, 3], [1, 2, 3], "Simple array equality")
	different([1, 2, 3], [1, 3, 2], "Order in array is important")

	stage('Set')
	const set = new Set<any>([1, 2, 3])
	same(set, new Set(set), "Simple set equality")
	same(set, new Set([3, 2, 1]), "Reverse set equality")
	different(set, new Set([2, 1]), "Should say '3' is missing in second set")
	different(set, new Set([1, 2, 3, 4, 8]), "Should say '8' is missing in first set")
	same(new Set([[1, 2, 3]]), new Set([[1, 2, 3]]), "Same deep equal values in set (array)")
	different(new Set([[1, 2, 3]]), new Set([[1, 2]]), "Different deep equal values in set (array)")
	same(new Set([{x: 1}, {y: 2, z: 3}]), new Set([{x: 1}, {y: 2, z: 3}]), "Same deep equal values in set (object)")
	different(new Set([{x: 1}, {y: 2, z: 3}]), new Set([{x: 1}, {y: 2, z: 4}]), "Different deep equal values in set (object)")


	stage('Map')
	const mapA = new Map([
		["foo", "foo"],
		["bar", "bar"],
	])
	const mapB = new Map<Set<any>, string>()
	mapB.set(set, "set")
	same(mapA, new Map(mapA), "Simple map equality")
	different(mapA, new Map([["foo", "foo"], ["bar", "bar!!!"]]), "Simple map difference")
	same(mapB, new Map(mapB), "Same maps with objects as key")
	different(mapB, new Map(), "Different maps with objects as key")
	same(mapB, new Map([[new Set(set), 'set']]), "Same maps with deep same objects as keys")
	different(mapB, new Map([[new Set(set), 'zut']]), "Different maps with deep same objects as keys but different values")
})
