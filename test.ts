import start from './index'

start('Bold test', async function({stage, same}) {
	let a: any = { }
	a.self = a
	a.z = {x: 12}
	let b: any = { }
	b.self = b
	b.z = [11, 12, 11, 12, 11, 12, 11, 12, 11, 12]
	same(a, b, "Circular reference")
})
