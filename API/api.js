import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
require('colors');
import { diffString } from '../Utilities/dateUtils.js';

let userToHighlight = 'dheidelberger';
const topXToTimeTrack = 10;

const players = Object.values(
    JSON.parse(fs.readFileSync('api.json', 'utf-8')).members
);

const playerCount = players.length;

console.log(`There are ${playerCount} players`);

const playerScore = {};

let maxNameLength = 0;
players.forEach((player) => {
    if (player.name === null) {
        player.name = `anonymous user #${player.id}`;
    }
    if (player.name.length > maxNameLength) maxNameLength = player.name.length;
    playerScore[player.name] = { points: 0, name: player.name, stars: 0 };
});

const startDate = new Date('December 1, 2025 00:00');
const currentDate = new Date();

const diff = currentDate - startDate;
let days = Math.floor(diff / 86400000) + 1;

if (process.argv[2]) days = +process.argv[2];

console.log('Days:', days);
console.log();
for (let i = 1; i <= days; i++) {
    for (let part = 1; part <= 2; part++) {
        const playerList = players.filter((player) => {
            return (
                player.completion_day_level[i] &&
                player.completion_day_level[i][part]
            );
        });

        console.log(
            `===========Day ${i} - Part ${part} (${playerList.length} completed)===========`
                .yellow
        );
        let timeDiffTotal = 0;
        let timeDiffCount = 0;
        playerList
            .sort((a, b) => {
                const aDay = a.completion_day_level[i][part];
                const bDay = b.completion_day_level[i][part];
                if (aDay.get_star_ts === bDay.get_star_ts) {
                    aDay.tiebreak = true;
                    bDay.tiebreak = true;
                    return aDay.star_index - bDay.star_index;
                }
                return aDay.get_star_ts - bDay.get_star_ts;
            })
            .map((x, idx) => {
                let points = playerCount - idx;
                playerScore[x.name].points += points;
                playerScore[x.name].stars++;
                points = `${points}`.padStart(3, '0');
                const position = `${idx + 1}`.padStart(2, '0');
                const pad = ' '.repeat(maxNameLength - x.name.length);
                const time = new Date(
                    1000 * x.completion_day_level[i][part].get_star_ts
                );
                const tiebreak = x.completion_day_level[i][part].tiebreak
                    ? ' TB'
                    : '';
                let outString = `${position} ${points}: ${
                    x.name
                }${pad} - ${time.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })}`;
                if (part == 2) {
                    const timeDiff =
                        x.completion_day_level[i][2].get_star_ts -
                        x.completion_day_level[i][1].get_star_ts;
                    outString += ' ' + diffString(timeDiff);
                    x.timeDiff = timeDiff;
                    if (timeDiffCount < topXToTimeTrack) {
                        timeDiffTotal += timeDiff;
                        timeDiffCount++;
                    }
                }
                outString += tiebreak;
                if (userToHighlight && x.name === userToHighlight)
                    outString = outString.green;
                return outString;
            })
            .forEach((x) => {
                console.log(x);
            });

        console.log();
        if (part === 2) {
            const timeDiffOutputString = `Average Part 1 -> Part 2 Time (among top ${topXToTimeTrack} finishers): ${diffString(
                Math.round(timeDiffTotal / timeDiffCount)
            )}`;
            console.log(timeDiffOutputString.magenta);
            console.log();
            console.log();
        }
    }
}

console.log('\n\n\n\n');
console.log(`===========Totals:===========`);
Object.values(playerScore)
    .sort((a, b) => {
        return b.points - a.points;
    })
    .forEach((player) => {
        let points = `${player.points}`.padStart(4, ' ');
        let stars = '*'.repeat(player.stars);
        let pad = ' '.repeat(maxNameLength - player.name.length);
        console.log(`${points}: ${player.name}${pad} - ${stars}`);
    });
