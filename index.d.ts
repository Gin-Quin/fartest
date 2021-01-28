type TestFunctionArguments = {
	stage?: (name: string) => void,
	test?: (condition: boolean, description?: string) => boolean,
	same?: (a: any, b: any, description?: string) => boolean,
	different?: (a: any, b: any, description?: string) => boolean,
}
export default function start(testFunction: (arg: TestFunctionArguments) => void): number;
export default function start(name: string, testFunction: (arg: TestFunctionArguments) => void): number;
