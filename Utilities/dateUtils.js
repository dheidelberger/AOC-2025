export function diffString(timeDiff) {
    let hDiff = Math.floor(timeDiff / 60 / 60);
    timeDiff -= hDiff * 60 * 60;
    let mDiff = Math.floor(timeDiff / 60);
    timeDiff -= mDiff * 60;
    hDiff = hDiff.toString().padStart(2, '0');
    mDiff = mDiff.toString().padStart(2, '0');
    timeDiff = timeDiff.toString().padStart(2, '0');

    return `(+${hDiff}:${mDiff}:${timeDiff})`;
}
