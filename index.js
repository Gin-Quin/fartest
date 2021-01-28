/*-------------------------------------
       FAst and smaRT TESTing
	~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	Very small handmade library for
	easy and fast testing.
--------------------------------------*/

import chalk from 'chalk'
import deepEqual, { deepEqualResults } from './deepEqual.js'
import util from 'util'

const inspect = value => chalk.white(util.inspect(value, {
	depth: 2,
	maxStringLength: 20,
	maxArrayLength: 3,
	colors: true,
	compact: true,
	breakLength: Infinity,
}))

class Stage {
	constructor(name) {
		this.errorCount = 0
		this.name = name
		this.fails = []
	}

	printResult() {
		if (this.fails.length) {
			console.log(chalk.bold.red("✗ "+this.name))
			for (const fail of this.fails)
				console.log(chalk.gray("  Error at : " + chalk.reset.bold.red(fail)))
		}
		else
			console.log(chalk.green("✓ "+this.name))
	}
}

class Test {
	constructor(name, testFunction) {
		this.name = name && (' ' + chalk.underline(name))
		this.testFunction = testFunction
		this.results = []
		this.currentStage = null
	}

	fails() {
		let fails = 0
		for (const result of this.results) {
			if (result instanceof Stage)
				fails += result.fails.length
			else fails++
		}
		return fails
	}

	async start() {
		try {
			await this.testFunction({
				stage: this.stage.bind(this),
				test: this.test.bind(this),
				same: this.same.bind(this),
				different: this.different.bind(this),
			})
			this.printResult()
			return this.errorCount
		}
		catch (error) {
			this.printFatalError(error)
			return 1
		}
	}

	printName() {
		if (this.name)
			console.log(chalk.bold.blue(`[${this.name} ]`))
	}

	printResult() {
		this.errorCount = 0
		this.printName()
		for (const result of this.results) {
			if (result instanceof Stage) {
				result.printResult()
				this.errorCount += result.fails.length
			}
			else {
				console.log(chalk.gray("  Error at : " + chalk.reset.bold.red(result)))
				this.errorCount++
			}
		}

		if (this.errorCount == 1)
			console.log(chalk.bold.yellow(`One error occured during the test${this.name} ${sad()}\n`))
		else if (this.errorCount > 1)
			console.log(chalk.bold.yellow(`${this.errorCount} errors occured during the test${this.name} ${sad()}\n`))
		else
			console.log(chalk.bold.green(`The test${this.name} has successfully passed ${happy()}\n`))
	}

	printFatalError(error) {
		this.printName()
		if (this.currentStage) console.log(chalk.bold.red(`✗ ${this.currentStage.name}`))
		console.log(chalk.red(`  A critical error occured ${sad()}`))
		if (error instanceof Error) {
			console.log(chalk.bold.red(error.message))
			if (error.code)
				console.log("Code error "+ error.code)
			if (error.stdout)
				console.log(error.stdout)
			if (error.stderr)
				console.log(error.stderr)
		}
		else console.log(chalk.bold.red(error))
		console.log()  // newline
	}

	stage(name='') {
		this.currentStage = new Stage(name)
		this.results.push(this.currentStage)
	}

	test(condition, description = '') {
		if (condition) return true
		if (this.currentStage) this.currentStage.fails.push(description)
		else this.results.push(description)
		return false
	}

	same(a, b, description) {
		deepEqual(a, b)
		const { error, key } = deepEqualResults
		if (error) {
			description += '\n    ' + chalk.underline(`${error}`) + (key ? ` at key '${key}'` : '')
			            +  `:\n    • ${inspect(a)}\n    • ${inspect(b)}`
			this.test(false, description)
			return false
		}
		return true
	}

	different(a, b, description) {
		return this.test(!deepEqual(a, b), description)
	}
}

function happy() {
	const emojis = ['😏', '😄', '😃', '😉', '😊', '😋', '😌']
	return emojis[Math.floor(Math.random() * emojis.length)]
}

function sad() {
	const emojis = ['😓', '😢', '😞', '😩', '😫']
	return emojis[Math.floor(Math.random() * emojis.length)]
}

function start(testName, testFunction) {
	if (typeof testName == 'function') {
		testFunction = testName
		testName = ''
	}
	new Test(testName, testFunction).start()
}

export default start