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

const grid = new Grid(input);

let bottomRow = grid.getRow(grid.height - 1);
for (const cell of bottomRow) {
    cell.pathsDown = 1;
}

for (let i = grid.height - 2; i >= 0; i--) {
    let row = grid.getRow(i);
    for (const cell of row) {
        if (cell.value === '.') {
            cell.pathsDown = cell.getCellInDirection(
                Grid.directions.DOWN
            ).pathsDown;
        } else if (cell.value === '^') {
            let downLeft = cell.getCellInDirection(
                Grid.directions.DIAGONAL_LEFT_DOWN
            ).pathsDown;
            let downRight = cell.getCellInDirection(
                Grid.directions.DIAGONAL_RIGHT_DOWN
            ).pathsDown;

            cell.pathsDown = downLeft + downRight;
        } else if (cell.value === 'S') {
            cell.pathsDown = cell.getCellInDirection(
                Grid.directions.DOWN
            ).pathsDown;
            console.log('START:', cell.pathsDown);
        }
    }
}

timer.stop();
