# machiatto

This module provides a Mocha-like interface with support for full async functions across the board. Hopefully it *just works*.

## Pending work

Module is in prelim state - YMMV.

- unit tests
- full integration tests
- full documentation

## Install

`import * as Machiatto from 'https://deno.land/x/machiatto'`

## Usage

It's mostly just like Mocha.

Run / name your tests just as you would with `deno test`, as this uses `Deno.test` under the hood.

The module provides the following exports:

- `describe` creates a new nested suite of tests
- `it` defines a new test in the current suite
- `before` runs once before any tests in the suite
- `beforeEach` runs before each test in the suite
- `after` runs once after all tests in the suite
- `afterEach` runs after each test in the suite
- `run` actually executes the tests

All functions passed can be async and will be executed in defined order, with the exception of tests - tests are run in parallel.

```ts
export { expect } from "https://deno.land/x/expect@v0.2.6/mod.ts";
import { beforeEach, describe, it, run } from "../test.ts";
import { clone } from './date.ts'

describe('date.ts', function() {
    
    beforeEach(function() {
        this.date = new Date('04/09/2021')
    })

    describe('#clone', function() {

        beforeEach(function() {
            this.cloned = clone(this.date)
        })

        it('returns a date from the exact same time', function() {
            expect(this.date.getTime()).toEqual(this.cloned.getTime())
        })

        it('returns a different date object', function() {
            expect(this.date).not.toBe(this.cloned)
        })
    })

})

await run()
```