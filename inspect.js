import chalk from 'chalk'
import util from 'util'

export default (value, colors = false) => chalk.white(util.inspect(value, {
	depth: 2,
	maxStringLength: 20,
	maxArrayLength: 3,
	colors,
	compact: true,
	breakLength: Infinity,
}))
