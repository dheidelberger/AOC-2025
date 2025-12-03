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
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const testInputFile = 'testinput.txt';
await getInput(__dirname, testInputFile);

function bestDigitWithNRemaining(arr, start, n) {
    let subArr = arr.slice(start, -n);
    let bestNum = -1;
    let bestIdx = -1;
    for (let i = start; i < arr.length - n; i++) {
        let digit = arr[i];
        if (digit > bestNum) {
            bestNum = digit;
            bestIdx = i;
        }
    }

    return { num: bestNum, idx: bestIdx };
}

const timer = new Timer(__filename);

const testMode = false;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n')
    .map((row) => row.split('').map((val) => +val));

let sum = 0;
let numLength = 12;
for (let row of input) {
    let constructedNumber = '';
    let startIndex = 0;
    console.log(row);
    for (let i = 1; i <= numLength; i++) {
        let bests = bestDigitWithNRemaining(row, startIndex, numLength - i);
        console.log(bests);
        constructedNumber += `${bests.num}`;
        startIndex = bests.idx + 1;
    }
    console.log(constructedNumber);
    sum += +constructedNumber;
}

console.log(sum);

timer.stop();
