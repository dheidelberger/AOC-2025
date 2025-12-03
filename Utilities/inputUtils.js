import clipboard from 'clipboardy';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

export const YEAR = '2025';
export const USER_STRING = `https://github.com/dheidelberger/AOC-${YEAR} by david.heidelberger@gmail.com`;

//When you open the problem for the day, copy the sample data.
// Then on first run of the script, this function grabs the contents of
// clipboard and puts it in a testinput.txt file (if it doesn't already exist)
function writeTestData(dir, testInputFile) {
    const testInputFilePath = path.join(dir, testInputFile);
    if (!fs.existsSync(testInputFilePath)) {
        const fileText = clipboard.readSync();
        if (fileText !== '') {
            console.log('Make the test file');
            console.log(fileText);
            fs.writeFileSync(testInputFilePath, fileText);
            console.log('Done');
        }
    }
}

export async function downloadFromAOC(url, cookie) {
    const response = await fetch(url, {
        headers: { 'User-Agent': USER_STRING, cookie: cookie },
    });
    const body = await response.text();
    return body;
}

async function downloadInput(dir, day) {
    const inputPath = path.join(dir, 'input.txt');
    const inputURL = `https://adventofcode.com/${YEAR}/day/${day}/input`;
    if (!fs.existsSync(inputPath)) {
        console.log('Downloading input');
        const body = await downloadFromAOC(inputURL, process.env.cookie);
        console.log(body);
        fs.writeFileSync(inputPath, body);
    }
}

export async function getInput(dir, testInputFile) {
    try {
        const day = +path.basename(dir).replace('Day ', '');
        if (isNaN(day)) {
            console.log('Could not parse a day to download.');
            return;
        }
        dotenv.config({ path: path.join(dir, '..', '.env') });
        writeTestData(dir, testInputFile);
        await downloadInput(dir, day);
    } catch (err) {
        console.log('Error fetching input');
        console.log(err);
    }
}
