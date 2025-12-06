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
    // .trim()
    .split('\n')
    .map((row) => row.split(''));

let g = new Grid(input);
console.log(input);
console.log(g);
let sum = 0;
let start = 0;
let storedOperator;
for (let i = 0; i < g.width; i++) {
    let column = g.getColumn(i);
    // console.log(column);
    let operator = column[column.length - 1].value;

    // console.log(operator);
    // console.log(`${column}`);
    if (operator !== ' ') {
        // console.log('New');
        console.log(start);
        sum += start;
        start = operator === '+' ? 0 : 1;
        console.log(operator);
        storedOperator = operator;
    }
    if (`${column}` !== ' '.repeat(column.length).split('').join(',')) {
        let number = +column
            .slice(0, -1)
            .map((col) => col.value)
            .join('')
            .trim();
        console.log('Num:', number);
        if (storedOperator === '+') {
            start += number;
        } else {
            start *= number;
        }
    }
}
sum += start;
console.log(sum);

timer.stop();
