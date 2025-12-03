import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import { YEAR, downloadFromAOC } from './inputUtils.js';
import { diffString } from './dateUtils.js';

const leaderboardURL = `https://adventofcode.com/${YEAR}/leaderboard/self`;

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
const leaderboardPath = path.join(dayPath, `leaderboard.txt`);
if (!fs.existsSync(leaderboardPath)) {
    console.log('Downloading leaderboard');
    const leaderboardBody = await downloadFromAOC(
        leaderboardURL,
        process.env.cookie
    );
    fs.writeFileSync(leaderboardPath, leaderboardBody);
} else {
    console.log('Leaderboard already downloaded');
}

const leaderboardText = fs.readFileSync(leaderboardPath, 'utf-8');
const $ = cheerio.load(leaderboardText);
const table = $('article').text();
let scoreData = [
    ...`${table}`.matchAll(
        /\s*(?<day>\d+)\s*(?<part1Time>\d{2}:\d{2}:\d{2}|>24h)\s*(?<part1Rank>\d+)\s*(?<part1Score>\d+)\s*(?<part2Time>\d{2}:\d{2}:\d{2}|>24h)\s*(?<part2Rank>\d+)\s*(?<part2Score>\d+)/g
    ),
];

let todayData = scoreData.filter((match) => match.groups.day === day);

if (todayData.length === 0) {
    console.log(`Could not find data for day ${day}`);
    process.exit(1);
}

todayData = todayData[0];

const inputFilePath = path.join('..', `Day ${paddedDay}`, 'input.txt');
const inputFileDownloaded = getFileCreationDate(inputFilePath);

let part1SolveTime = '>24h';
let part1SolveDiff = 'n/a';
if (!todayData.groups.part1Time.includes('>')) {
    part1SolveTime = getSubmissionTime(day, todayData.groups.part1Time);
    console.log(
        part1SolveTime.toLocaleString('en-US', { timeZone: 'America/New_York' })
    );
    part1SolveDiff = diffString(
        Math.floor((part1SolveTime - inputFileDownloaded) / 1000)
    );
}

let part2SolveTime = '>24h';
let part2SolveDiff = 'n/a';
if (!todayData.groups.part2Time.includes('>')) {
    part2SolveTime = getSubmissionTime(day, todayData.groups.part2Time);
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
})}\\\n`;
outputText += `Part 1 submitted: ${part1SolveTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
})} ${part1SolveDiff}\\\n`;
outputText += `Part 2 submitted: ${part2SolveTime.toLocaleString('en-US', {
    timeZone: 'America/New_York',
})} ${part2SolveDiff}\n\n`;

outputText += `Part 1 Rank: ${todayData.groups.part1Rank} (${todayData.groups.part1Score} points)\\\n`;
outputText += `Part 2 Rank: ${todayData.groups.part2Rank} (${todayData.groups.part2Score} points)\n\n`;

outputText += `*Note that as of 2024 Day 8, input download happens automatically when I first run the part 1 template file. I do this immediately after opening the puzzle for the first time.*\n\n`;

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

outputText += `Part 1 Run Time: ${part1Time}\\
Part 2 Run Time: ${part2Time} 

*Code is run on a 2020 M1 Macbook Pro with 16GB of RAM*`;

console.log(outputText);
fs.writeFileSync(path.join('..', `Day ${paddedDay}`, 'README.md'), outputText);
