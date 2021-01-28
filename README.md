*FAst and smaRT TESTing*

.. for those who want to enjoy simple and emoji-augmented tests without having to learn the whole ecosystem of a rich test library.

FarTest is an obvious, colorful and enjoyable test library for small applications. It does not do cool stuff like code coverage, but you'll learn to use in no time.

![success](https://i.ibb.co/TLDkQj8/success.png)

## Installation

```
npm install --save-dev fartest
```

## Usage
FarTest simplest API export one main function :

```ts
async function start(testName?: string, async testFunction: ({
	test?: (condition: boolean, description?: string) => boolean,
	same?: (a: any, b: any, description?: string) => boolean,
	different?: (a: any, b: any, description?: string) => boolean,
	stage?: (name: string) => void,
}) => void): number
```

The return value is the number of errors encountered during the test.

The `testName` parameter is optional but strongly recommanded if you run multiple tests.

The `testFunction` parameter is a function that can take up to four arguments :

- `test(condition: boolean, description?: string)` - a general assertion checking. If `condition` is `true` then the assertion has succeeded, otherwise it failed. 
- `same(a: any, b: any, name?: string)` - check if two values are the same. When `a` and `b`are objects, execute a deep comparison. Values can be of any type : numbers, strings, arrays, maps, sets, ...
- `different(a: any, b: any, name?: string)` - opposite of `same` ; check if two values are strictly unequal.
- `stage(name: string)` - use it to group unit tests together.

And that's the whole API. 

### Basic example
Let's create a new test file (can be in Typescript or in pure JS) :
```ts
import start from 'fartest'
// the name of the function (MyAwesomeTest) is the name of the test
// and is optional
start('My test', async function({stage, test, same, different}) {
  stage('Basic tests')
    test(1 == "1", "String and integer loose comparison")

    // will fail
    test(1 === "1", "String and integer strict comparison")
    
    // will fail as well
    same(1, "1", "String and integer strict comparison (using same)")

  stage('Comparing objects')
    // deep comparison is done
    same({x: 1, y: 2}, {x: 1, y: 2}, "Deep object comparison")
    // the object type is also checked
    different(['foo'], {0: 'foo'}, "Array is not an object")
})
```

Then run it using `node` or a tool like [esrun](https://www.npmjs.com/package/@digitak/esrun) if your file is written in Typescript or in modern JS.

![fail](https://i.ibb.co/YRfmVS4/fail.png)

### Critical errors

Any invalid code will be caught and printed as a critical error.

```ts
start('Bold test', async function({stage, test}) {
  stage('It gotta works!!')
    undefined.x == 12
})
```

![critical-fail](https://i.ibb.co/PtGGMbq/critical-fail.png)


### Test asynchronous functions

Because your main test functions is declared as `async` you can just use `await` anywhere you need it.

## Running multiple tests
You can run multiple tests at once, in which case they all will be executed simultaneously - the fastest tests will display their results first.
```ts
// test 1
start('Slow test', async function({stage, test}) {
  stage('Basic tests')
  // let's wait 1 second
  await new Promise(resolve => setTimeout(resolve, 1000))
  test(1 == "1", "String and integer loose comparison")
})

// test 2
start('Instant test', async function({stage, test}) {
  stage('Basic tests')
  test(1 == "1", "String and integer loose comparison")
})
```

![asynchronous](https://i.ibb.co/XLs7wHk/asynchronous.png)

### Conclusion
Congratulations, you've learned a new test library in less that 5 minutes!

What are you waiting for?

Enjoy testing 😌
