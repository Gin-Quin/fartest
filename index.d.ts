type TestFunctionArguments = {
	stage?: (name: string) => void,
	test?: (condition: boolean, description?: string) => void,
	same?: (a: any, b: any, description?: string) => void,
	different?: (a: any, b: any, description?: string) => void,
}
export default function start(testFunction: (arg: TestFunctionArguments) => void): void;
export default function start(name: string, testFunction: (arg: TestFunctionArguments) => void): void;
