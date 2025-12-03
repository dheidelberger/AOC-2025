# AOC-2025

Repo for Advent of Code, 2025

Work in progress

#### Notes regarding API queries

The scripts for downloading puzzle input/APIs are a work in progress. The download script is located in Utilities/inputUtils.js

inputUtils follows the automation guidelines on the /r/adventofcode [community wiki](https://www.reddit.com/r/adventofcode/wiki/faqs/automation)

Specifically:

-   Once inputs are downloaded, they are cached locally
-   While outbound calls are not throttled per se, they are manually triggered and should only happen the first time a day's code is run (after which, input will be cached).
-   User agent header is set by [userString](https://github.com/dheidelberger/AOC-2024/blob/302f62c05190e09b0bc12726a66fed1959ccde18/Utilities/inputUtils.js#L8) and refers to myself and to this Readme

Calls to the leaderboard API are, at least for now, manually triggered using the link on the website, with JSON data pasted into a local file. I have no plans to automate this part of the script at present.

#### Install notes:

For m1, need to install some libraries for text-to-image package:\
`brew install pkg-config cairo pango libpng jpeg giflib librsvg`
