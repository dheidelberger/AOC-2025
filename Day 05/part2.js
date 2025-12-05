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
import { merge } from 'cheerio';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const testInputFile = 'testinput.txt';
await getInput(__dirname, testInputFile);

const timer = new Timer(__filename);

const testMode = false;

function intersects(a, b) {
    return (
        (a.lower >= b.lower && a.lower <= b.upper) ||
        (a.upper >= b.lower && a.upper <= b.upper) ||
        (a.lower <= b.lower && a.upper >= b.upper)
    );
}

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n\n');

const inputRanges = input[0].split('\n').map((row) => {
    const [lower, upper] = row.split('-').map((v) => +v);
    return { lower, upper };
});

//     ===
// +++

// ===
//     +++

// ======
//   ++++

// ======
//   ++++++

//    ====
//  ++++

//      ===
//   +++++++
console.log(inputRanges);
let testRanges = inputRanges;
let ranges;
let merges = 1;
let iterations = 0;
while (merges > 0) {
    iterations++;
    console.log(`===== Iteration: ${iterations} =====`);
    ranges = [testRanges[0]];
    merges = 0;

    for (let i = 1; i < testRanges.length; i++) {
        let range = testRanges[i];
        console.log(range);

        let intersected = false;

        for (let o = 0; o < ranges.length; o++) {
            let testRange = ranges[o];
            if (intersects(range, testRange)) {
                console.log(
                    `${testRange.lower}-${testRange.upper} intersects ${range.lower}-${range.upper}`
                );
                testRange.lower = Math.min(range.lower, testRange.lower);
                testRange.upper = Math.max(range.upper, testRange.upper);

                intersected = true;
                merges++;
            }
        }
        if (!intersected) {
            console.log('No intersections');
            ranges.push(range);
        }
    }
    console.log('Merges:', merges);
    console.log(ranges);
    testRanges = ranges;
}

console.log(ranges);

let totalIngredients = 0;
for (const range of ranges) {
    totalIngredients += range.upper - range.lower + 1;
}
console.log(totalIngredients);

timer.stop();
