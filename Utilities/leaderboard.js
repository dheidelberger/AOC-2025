import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import { YEAR, downloadFromAOC } from './inputUtils.js';
import { diffString } from './dateUtils.js';

const leaderboardURL = `https://adventofcode.com/${YEAR}/leaderboard/self`;
const user = 'dheidelberger';

function getSubmissionTime(day, submissionTime) {
    let releaseTime = new Date(Date.UTC(+YEAR, 11, +day, 5, 0, 0));
    let [hours, minutes, seconds] = submissionTime
        .split(':')
        .map((num) => +num);
    releaseTime.setSeconds(releaseTime.getSeconds() + seconds);
    releaseTime.setMinutes(releaseTime.getMinutes() + minutes);
    releaseTime.setHours(releaseTime.getHours() + hours);
    return releaseTime;
}

function getFileCreationDate(filePath) {
    const stats = fs.statSync(filePath);
    return new Date(stats.birthtime);
}

dotenv.config({ path: path.join('..', '.env') });
// console.log(process.env.cookie);
const day = process.argv[2];
if (!day) {
    console.log('Must have a day argument');
    process.exit(1);
}

const paddedDay = `${day}`.padStart(2, '0');
const dayPath = path.join('..', `Day ${paddedDay}`);

let apiData;
try {
    const apiPath = path.join('..', 'API', 'api.json');
    apiData = JSON.parse(fs.readFileSync(apiPath, 'utf-8'));
} catch (err) {
    console.log('Could not load API data');
    process.exit(1);
}

let me;
try {
    const members = apiData.members;
    me = Object.values(members).filter((member) => member.name === user)[0];
} catch (err) {
    console.log('Unable to find member data');
    process.exit(1);
}

let todayScore;
try {
    const memberDays = me.completion_day_level;
    todayScore = memberDays[day];
} catch (err) {
    console.log(`Unable to parse day ${day}`);
    process.exit(1);
}

const inputFilePath = path.join('..', `Day ${paddedDay}`, 'input.txt');
const inputFileDownloaded = getFileCreationDate(inputFilePath);

let part1SolveTime = 'n/a';
let part1SolveDiff = 'n/a';
if (todayScore['1']) {
    part1SolveTime = new Date(1000 * todayScore['1'].get_star_ts);
    console.log(
        part1SolveTime.toLocaleString('en-US', { timeZone: 'America/New_York' })
    );
    part1SolveDiff = diffString(
        Math.floor((part1SolveTime - inputFileDownloaded) / 1000)
    );
}

let part2SolveTime = 'n/a';
let part2SolveDiff = 'n/a';
if (todayScore['2']) {
    part2SolveTime = new Date(1000 * todayScore['2'].get_star_ts);
    console.log(
        part2SolveTime.toLocaleString('en-US', { timeZone: 'America/New_York' })
    );
    part2SolveDiff = diffString(
        Math.floor((part2SolveTime - part1SolveTime) / 1000)
    );
}

let outputText = `# Day ${day} statistics:\n\n`;
outputText += `Input Downloaded: ${inputFileDownloaded.toLocaleString('en-US', {
    timeZone: 'America/New_York',
})}  \n`;
outputText += `Part 1 submitted: ${part1SolveTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
})} ${part1SolveDiff}  \n`;
outputText += `Part 2 submitted: ${part2SolveTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
})} ${part2SolveDiff}\n\n`;

outputText += `*Input download happens automatically when I first run the part 1 template file. I do this immediately after opening the puzzle for the first time.*\n\n`;

const part1TimePath = path.join(dayPath, `part1.js.elapsed.txt`);
const part2TimePath = path.join(dayPath, `part2.js.elapsed.txt`);
let part1Time = '';
let part2Time = '';
if (fs.existsSync(part1TimePath)) {
    part1Time = fs.readFileSync(part1TimePath);
}
if (fs.existsSync(part2TimePath)) {
    part2Time = fs.readFileSync(part2TimePath);
}

outputText += `Part 1 Run Time: ${part1Time}  \n
Part 2 Run Time: ${part2Time} 

*Code is run on a 2020 M1 Macbook Pro with 16GB of RAM*`;

console.log(outputText);
fs.writeFileSync(path.join('..', `Day ${paddedDay}`, 'README.md'), outputText);
