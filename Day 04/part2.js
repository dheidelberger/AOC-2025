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

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n');

const g = new Grid(input);
// console.log(g);
let removed = 0;
let canRemove = true;

while (canRemove) {
    let removable = [];
    let removedThisIteration = 0;
    const paper = g.getAllCells().filter((cell) => cell.value == '@');
    for (const c of paper) {
        const neighbors = c.getCellsInDirections(Grid.allDirections, 1);
        const atCount = neighbors.filter((cell) => cell[0].value == '@');
        if (atCount.length < 4) {
            removable.push(c);
            removed++;
            removedThisIteration++;
        }
    }
    for (const c of removable) {
        c.value = '.';
    }
    console.log(removedThisIteration);
    // console.log(g);
    if (removedThisIteration == 0) {
        canRemove = false;
    }
}

console.log(removed);
timer.stop();
