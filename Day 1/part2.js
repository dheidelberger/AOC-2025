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

let dialValue = 50;
let dialModulo = 100;
let zeros = 0;

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .trim()
    .split('\n')
    .map((row) => {
        let direction = row[0] === 'L' ? -1 : 1;
        let distance = +row.match(/\d+/);
        return { direction, distance };
    })
    .forEach((rotation) => {
        for (let i = 0; i < rotation.distance; i++) {
            dialValue += rotation.direction;
            if (dialValue === dialModulo) dialValue = 0;
            if (dialValue === -1) dialValue = dialModulo - 1;
            if (dialValue === 0) zeros++;
        }
    });

console.log();
console.log(zeros);

timer.stop();
