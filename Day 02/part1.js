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

const timer = new Timer(__filename);

const testMode = false;
let totalDiff = 0;
let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split(',')
    .map((range) => {
        const [low, high] = range.split('-').map((i) => +i);
        const diff = high - low;
        totalDiff += diff;
        return {
            low,
            high,
            diff: diff,
        };
    });

console.log(input);
console.log(totalDiff);
let invalidSum = 0;
for (const range of input) {
    console.log(range);
    let invalids = 0;
    for (let i = range.low; i <= range.high; i++) {
        let numString = `${i}`;
        const numLength = numString.length;
        if (numLength % 2 === 1) continue;
        let leftNum = numString.slice(0, Math.floor(numLength / 2));
        let rightNum = numString.slice(Math.floor(numLength / 2));
        // console.log(' ', leftNum, rightNum);
        if (leftNum === rightNum) {
            invalidSum += i;
            invalids++;
            // console.log('  Invalid');
        }
    }
}
console.log(invalidSum);

timer.stop();
