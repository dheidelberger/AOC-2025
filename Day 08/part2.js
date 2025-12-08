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
import { print } from '../Utilities/miscUtils.js';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const testInputFile = 'testinput.txt';
await getInput(__dirname, testInputFile);

const timer = new Timer(__filename);

const testMode = false;

function calculateDistance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

let circuits = [];

let input = fs
    .readFileSync(testMode ? 'testinput.txt' : 'input.txt', 'utf-8')
    .split('\n')
    .slice(0, -1)
    .map((row) => {
        let numbers = row.split(',').map((nums) => +nums);
        return {
            x: +numbers[0],
            y: +numbers[1],
            z: +numbers[2],
            key: row,
            // circuit:null
        };
    });

// print(input);

for (const box of input) {
    circuits.push(new Set([box.key]));
}

// print(circuits);

const distances = [];
for (let i = 0; i < input.length; i++) {
    let a = input[i];
    for (let o = i + 1; o < input.length; o++) {
        let b = input[o];
        let dist = calculateDistance(a, b);
        distances.push({ key: `${a.key}-${b.key}`, distance: dist, a, b });
    }
}
distances.sort((a, b) => {
    return a.distance - b.distance;
});
// print(distances);

let connections = 0;
for (let i = 0; i < distances.length; i++) {
    let connection = distances[i];
    // print('Connection', connection);
    let a = connection.a;
    let b = connection.b;
    let aCircuit;
    let bCircuit;
    for (const circuit of circuits) {
        if (circuit.has(a.key)) {
            aCircuit = circuit;
        }

        if (circuit.has(b.key)) {
            bCircuit = circuit;
        }
    }

    // print('Found circuits?:');
    // print('A circuit:', aCircuit);
    // print('B circuit:', bCircuit);

    if (aCircuit && !bCircuit) {
        // print('Adding b to a circuit');
        aCircuit.add(b.key);
        // print(aCircuit);
        connections++;
    } else if (bCircuit && !aCircuit) {
        // print('Adding a to b circuit');
        bCircuit.add(a.key);
        // print(bCircuit);
        connections++;
    } else if (!aCircuit && !bCircuit) {
        // print('Creating new circuit');
        const newCircuit = new Set([a.key, b.key]);
        // print(newCircuit);
        circuits.push(newCircuit);
        connections++;
    } else if (aCircuit === bCircuit) {
        // print('Circuits are the same');
    } else if (aCircuit && bCircuit) {
        // print('Merging circuits');
        // print('Circuit count:', circuits.length);
        let circuit = setUtilities.union(aCircuit, bCircuit);
        // print('Indexes:', aIndex, bIndex);
        circuits.splice(circuits.indexOf(aCircuit), 1);
        circuits.splice(circuits.indexOf(bCircuit), 1);
        // print(circuit);
        circuits.push(circuit);
        // print('Circuits:');
        // print(circuits);
        // print('Updated circuit count:', circuits.length);
        connections++;
    }
    if (circuits.length === 1) {
        print(a.x * b.x);
        break;
    }
    // print();
}

timer.stop();
