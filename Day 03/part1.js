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
    .split('\n')
    .map((row) => row.split('').map((val) => +val));

let sum = 0;
for (let row of input) {
    console.log(row);
    let leftNum = Math.max(...row.slice(0, -1));
    console.log(leftNum);
    let leftIdx = row.indexOf(leftNum);
    let rightNum = Math.max(...row.slice(leftIdx + 1));
    console.log(rightNum);
    let num = leftNum * 10 + rightNum;
    sum += num;
}

console.log(sum);

timer.stop();
