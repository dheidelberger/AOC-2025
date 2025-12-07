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

function processRow(beams, grid, index) {
    const row = grid.getRow(index);
    const outBeams = new Set(beams);
    const splitters = new Set(
        row.filter((cell) => cell.value === '^').map((cell) => cell.column)
    );
    let splits = 0;
    for (const beam of beams) {
        if (splitters.has(beam)) {
            splits++;
            if (beam - 1 >= 0) outBeams.add(beam - 1);
            if (beam + 1 < grid.width) outBeams.add(beam + 1);
            outBeams.delete(beam);
        }
    }

    let returnBeams = [...outBeams];
    return { beams: returnBeams, splits };
}

const timer = new Timer(__filename);

const testMode = false;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .split('\n')
    .slice(0, -1);

// console.log(input);

const grid = new Grid(input);

let startPoint = grid.getRow(0).filter((c) => c.value == 'S')[0].column;
// console.log(startPoint);
let beams = [startPoint];
let totalSplits = 0;
for (let i = 1; i < grid.height; i++) {
    let result = processRow(beams, grid, i);
    // console.log(result);
    totalSplits += result.splits;
    beams = result.beams;
}

console.log(totalSplits);
timer.stop();
