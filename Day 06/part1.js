import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const colors = require('colors');
const G = require('generatorics');
const Heap = require('heap');
const memoize = require('memoizee');
import * as setUtilities from '../Utilities/setUtilities.js';
import Grid from '../Utilities/Grid.js';
import Timer from '../Utilities/Timer.js';
import { getInput } from '../Utilities/inputUtils.js';
import { constants } from 'buffer';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const testInputFile = 'testinput.txt';
await getInput(__dirname, testInputFile);

const timer = new Timer(__filename);

const testMode = false;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n');

let operators = input[input.length - 1].split(/\s+/);
let numbers = input.slice(0, -1).map((row) =>
    row
        .trim()
        .split(/\s+/)
        .map((num) => +num)
);
console.log(operators);
console.log(numbers);

const problems = numbers[0].length;

let total = 0;
for (let i = 0; i < problems; i++) {
    let operator = operators[i];
    let start = operator === '+' ? 0 : 1;
    for (let o = 0; o < numbers.length; o++) {
        if (operator === '+') {
            start += numbers[o][i];
        } else {
            start *= numbers[o][i];
        }
    }
    console.log(start);
    total += start;
}
console.log(total);

timer.stop();
