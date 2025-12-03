import prettyMilliseconds from 'pretty-ms';
import fs from 'fs';

export default class Timer {
    constructor(pathToFile) {
        this.startTime = performance.now();
        this.pathToFile = pathToFile;
    }

    stop() {
        this.endTime = performance.now();
        const elapsed = this.endTime - this.startTime;
        const elapsedString = `Elapsed time: ${prettyMilliseconds(elapsed)}`;
        console.log(elapsedString);
        fs.writeFileSync(
            this.pathToFile + '.elapsed.txt',
            prettyMilliseconds(elapsed)
        );
    }
}
