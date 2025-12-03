import util from 'util';

/**
 * Custom function to parse cells of grid
 * @name CustomParserFunction
 * @function
 * @param {string} rawCellValue - Raw value of the cell
 * @return {any} - Custom parsed value of cell
 */

function key(row, column) {
    return `${row}_${column}`;
}

function rowColFromKey(key) {
    return key.split('_').map((val) => +val);
}

// function matchStringOrArray() {}

class Cell {
    constructor(value, row, column, grid, isOutOfBounds = false) {
        this.value = value;
        this.row = row;
        this.column = column;
        this.grid = grid;
        this.outOfBounds = isOutOfBounds;
        this.key = key(row, column);
    }

    getCellsInDirections(directions, n = -1, includeSelf = false) {
        return this.grid.getCellsFromCoordsInDirections(
            this.row,
            this.column,
            directions,
            n,
            includeSelf
        );
    }

    getCellsInDirection(direction, n = -1, includeSelf = false) {
        return this.grid.getCellsFromCoordsInDirection(
            this.row,
            this.column,
            direction,
            n,
            includeSelf
        );
    }

    getCellInDirections(directions) {
        return this.getCellsInDirections(directions, 1, false).map(
            (cells) => cells[0]
        );
    }

    getCellInDirection(direction) {
        return this.getCellsInDirection(direction, 1, false)[0];
    }

    [util.inspect.custom](depth, inspectOptions, inspect) {
        let outString = `Cell ${this.row},${this.column}: ${this.value}`;
        outString += this.outOfBounds ? ' (out of bounds)' : '';
        return outString;
    }
    setColor(aColor) {
        this.color = aColor;
    }

    toString() {
        if (this.color) {
            return this.color(`${this.value}`);
        }
        return `${this.value}`;
    }
}

export default class Grid {
    static directions = {
        UP: [-1, 0],
        DIAGONAL_RIGHT_UP: [-1, 1],
        RIGHT: [0, 1],
        DIAGONAL_RIGHT_DOWN: [1, 1],
        DOWN: [1, 0],
        DIAGONAL_LEFT_DOWN: [1, -1],
        LEFT: [0, -1],
        DIAGONAL_LEFT_UP: [-1, -1],
    };

    static cardinalDirections = [
        this.directions.UP,
        this.directions.RIGHT,
        this.directions.DOWN,
        this.directions.LEFT,
    ];

    static diagonals = [
        this.directions.DIAGONAL_RIGHT_UP,
        this.directions.DIAGONAL_RIGHT_DOWN,
        this.directions.DIAGONAL_LEFT_DOWN,
        this.directions.DIAGONAL_LEFT_UP,
    ];

    static allDirections = [
        this.directions.UP,
        this.directions.DIAGONAL_RIGHT_UP,
        this.directions.RIGHT,
        this.directions.DIAGONAL_RIGHT_DOWN,
        this.directions.DOWN,
        this.directions.DIAGONAL_LEFT_DOWN,
        this.directions.LEFT,
        this.directions.DIAGONAL_LEFT_UP,
    ];

    /**
     * Create a Grid object
     * @param {(string|any[][])} [data] - Grid data. Can be either a raw string and we'll parse it, or 2D array.
     * @param {Object} [options] - Optional "options" object.
     * @param {boolean} [options.pad=false] - Whether to add a 1 row/column padding around the input. If true, options.oneBased is ignored and actual input starts at index 1.
     * @param {string} [options.separator=''] - The separator string for input parsing. Defaults to empty string.
     * @param {string} [options.displaySeparator=''] - The separator string used in toString. Defaults to empty string.
     * @param {any} [options.defaultChar='.'] - Default value for padding or undefined cells. Note that this value is not passed through a custom parser.
     * @param {boolean} [options.parseAsNumbers=false] - If input is a string, should we parse the values as numbers? Default false.
     * @param {CustomParserFunction} [options.customParser=null] - Custom function to parse input
     * @param {boolean} [options.returnUndefinedCells=true] - If you attempt to access a cell that's out of bounds, return a cell with the default value. If false, will return undefined.
     * @param {boolean} [options.oneBased=false] - First row/column is at index 1.
     */
    constructor(data, options = {}) {
        const defaultOptions = {
            pad: false,
            separator: '',
            displaySeparator: '',
            defaultChar: '.',
            parseAsNumbers: false,
            customParser: null,
            returnUndefinedCells: true,
            oneBased: false,
        };
        const mergedOptions = { ...defaultOptions, ...options };

        this.returnUndefinedCells = mergedOptions.returnUndefinedCells;
        this.oneBased = mergedOptions.oneBased;
        this.defaultChar = mergedOptions.defaultChar;
        this.grid = new Map();
        this.width = 0;
        this.height = 0;
        this.maxInputLength = 0;
        this.separator = mergedOptions.separator;
        this.displaySeparator = mergedOptions.displaySeparator;

        let rows;
        if (typeof data === 'string') {
            rows = data.split('\n');
        } else {
            rows = data;
        }

        this.height = rows.length + (mergedOptions.pad ? 2 : 0);
        for (let r = 0; r < rows.length; r++) {
            let row;
            if (typeof data === 'string') {
                row = rows[r].split(mergedOptions.separator);
            } else {
                row = rows[r];
            }
            this.width = row.length + (mergedOptions.pad ? 2 : 0);
            if (mergedOptions.parseAsNumbers) {
                row = row.map((cell) => +cell);
            } else if (mergedOptions.customParser) {
                row = row.map(mergedOptions.customParser);
            }
            for (let c = 0; c < row.length; c++) {
                let rIndex = r;
                let cIndex = c;
                if (this.oneBased || mergedOptions.pad) {
                    cIndex = c + 1;
                    rIndex = r + 1;
                }
                const currentCellValue = row[c];
                if (`${currentCellValue}`.length > this.maxInputLength) {
                    this.maxInputLength = `${currentCellValue}`.length;
                }
                const cell = new Cell(currentCellValue, rIndex, cIndex, this);
                this.grid.set(key(rIndex, cIndex), cell);
            }
        }
        if (mergedOptions.pad) {
            for (let r = 0; r < this.height; r++) {
                let cArr = [];
                if (r === 0 || r === this.height - 1) {
                    for (let c = 0; c < this.width; c++) {
                        cArr.push(c);
                    }
                } else {
                    cArr.push(0, this.width - 1);
                }
                for (let c of cArr) {
                    const val = this.defaultChar;
                    const cell = new Cell(val, r, c, this);
                    this.grid.set(key(r, c), cell);
                }
            }
        }
    }

    /**
     * Get cell at specific coordinates. If returnUndefinedCells is true, will return a default cell for an out of bounds location. Otherwise return undefined
     * @param {number} r - Row
     * @param {number} c - Column
     * @return {Cell} Cell at desired location
     */
    getCell(r, c) {
        const thisKey = key(r, c);
        if (this.grid.has(thisKey)) {
            return this.grid.get(thisKey);
        }
        if (this.returnUndefinedCells) {
            return new Cell(this.defaultChar, r, c, this, true);
        }
        return undefined;
    }

    getCellWithKey(key) {
        if (this.grid.has(key)) {
            return this.grid.get(key);
        }
        if (this.returnUndefinedCells) {
            let [row, col] = rowColFromKey(key);
            return new Cell(this.defaultChar, row, col, this, true);
        }
    }

    #arrayOfEmptyCells(arraySize, row, col, direction) {
        let output = [];
        let start = [row, col];

        for (let i = 0; i < arraySize; i++) {
            let r = start[0] + i * direction[0];
            let c = start[1] + i * direction[1];

            let outOfBounds = r >= this.height || c >= this.width;

            let cell = new Cell(this.defaultChar, r, c, this, outOfBounds);
            output.push(cell);
        }

        return output;
    }

    #positionIsOutOfBounds(r, c) {
        return r < 0 || c < 0 || r >= this.height || c >= this.width;
    }

    /**
     * Get an array of all cells.
     * @return {Cell[]} Array of all cells
     */
    getAllCells() {
        return Array.from(this.grid.values());
    }

    getRow(r) {
        const rIsOutOfBounds = r >= this.height || r < 0;
        if (rIsOutOfBounds && this.returnUndefinedCells) {
            let emptyCells = this.#arrayOfEmptyCells(
                this.width,
                r,
                0,
                Grid.directions.RIGHT
            );
            return emptyCells;
        }
        if (rIsOutOfBounds) {
            return Array(this.width).fill(undefined);
        }
        let outputArray = [];
        for (let i = 0; i < this.width; i++) {
            outputArray.push(this.getCell(r, i));
        }
        return outputArray;
    }

    /**
     * Return n cells going off in each of the specified directions from a specified location
     * @param {number} r - Row
     * @param {number} c - Column
     * @param {number[][]} directions - Array of directions to go. See Grid.directions
     * @param {number} [n=-1] - Number of cells to return. Default to -1 which returns to the edge. If a number is specified and returnUndefinedCells is true, will return empty cells up to that number
     * @param {boolean} [includeSelf=false] - Should the starting cell be included? Default false.
     * @return {Cell[][]} Array of array cells
     */
    getCellsFromCoordsInDirections(
        r,
        c,
        directions,
        n = -1,
        includeSelf = false
    ) {
        let outputArr = [];
        for (const direction of directions) {
            outputArr.push(
                this.getCellsFromCoordsInDirection(
                    r,
                    c,
                    direction,
                    n,
                    includeSelf
                )
            );
        }
        return outputArr;
    }

    /**
     * Return n cells going off in the specified direction from a specified location
     * @param {number} r - Row
     * @param {number} c - Column
     * @param {number[]} direction - Direction to go. See Grid.directions
     * @param {number} [n=-1] - Number of cells to return. Default to -1 which returns to the edge. If a number is specified and returnUndefinedCells is true, will return empty cells up to that number
     * @param {boolean} [includeSelf=false] - Should the starting cell be included? Default false.
     * @return {Cell[]} Array of cells
     */
    getCellsFromCoordsInDirection(
        r,
        c,
        direction,
        n = -1,
        includeSelf = false
    ) {
        let finished = false;
        let outputArray = [];
        let row = r - (includeSelf ? direction[0] : 0);
        let col = c - (includeSelf ? direction[1] : 0);

        let count = 0;
        while (!finished) {
            row += direction[0];
            col += direction[1];
            if (
                this.#positionIsOutOfBounds(row, col) &&
                (n == -1 || !this.returnUndefinedCells)
            ) {
                finished = true;
                break;
            }
            outputArray.push(this.getCell(row, col));
            count++;
            if (count === n) finished = true;
        }
        return outputArray;
    }

    getColumn(c) {
        const cIsOutOfBounds = c >= this.width || c < 0;
        if (cIsOutOfBounds && this.returnUndefinedCells) {
            let emptyCells = this.#arrayOfEmptyCells(
                this.height,
                0,
                c,
                Grid.directions.DOWN
            );
            return emptyCells;
        }
        if (cIsOutOfBounds) {
            return Array(this.height).fill(undefined);
        }
        let outputArray = [];
        for (let i = 0; i < this.height; i++) {
            outputArray.push(this.getCell(i, c));
        }
        return outputArray;
    }

    [util.inspect.custom](depth, inspectOptions, inspect) {
        return this.toString();
    }

    /**
     * Run Dijkstra's algorithm on the grid
     * @param {Cell} startCell - The starting cell
     * @param {Cell} finishCell - The finishing cell
     * @param {string|any[]} invalidCellValues="#" - Either a string or an array containing cell values for walls. Defaults to "#". If validCellValues is defined, this param is ignored
     * @return {Cell[]} Array of cells
     */
    dijkstra(startCell, finishCell, invalidCellValues = '#') {
        const sptSet = new Set();
        let allValidCells = this.getAllCells()
            .filter((cell) => {
                if (Array.isArray(invalidCellValues)) {
                    let valid = invalidCellValues.indexOf(cell.value) === -1;
                    return valid;
                }
                return cell.value !== invalidCellValues;
            })
            .map((cell) => {
                cell.distance = Infinity;
                return cell;
            });

        startCell.distance = 0;
        allValidCells.sort((a, b) => b.distance - a.distance);
        const targetLength = allValidCells.length;

        while (allValidCells.length > 0) {
            const current = allValidCells.pop();
            sptSet.add(current.key);
            for (const successorCell of current.getCellInDirections(
                Grid.cardinalDirections
            )) {
                let validCell;
                if (Array.isArray(invalidCellValues)) {
                    validCell =
                        invalidCellValues.indexOf(successorCell.value) === -1;
                } else {
                    validCell = successorCell.value !== invalidCellValues;
                }
                if (!successorCell.outOfBounds && validCell) {
                    const newDistance = current.distance + 1;
                    if (newDistance < successorCell.distance) {
                        successorCell.distance = newDistance;
                        successorCell.prev = current;
                    }
                }
            }
            allValidCells.sort((a, b) => b.distance - a.distance);
        }

        let currentCell = finishCell;

        const cellPath = [];
        while (currentCell) {
            cellPath.push(currentCell);
            currentCell.value = '0';
            currentCell = currentCell.prev;
        }
        cellPath.reverse();
        return cellPath;
    }

    toString() {
        const addOne = this.oneBased ? 1 : 0;
        let startRow = addOne;
        let startCol = addOne;
        let endRow = this.height + addOne;
        let endCol = this.width + addOne;
        let outString = '';
        for (let r = startRow; r < endRow; r++) {
            let rowArray = [];
            for (let c = startCol; c < endCol; c++) {
                let thisKey = key(r, c);
                let cell = this.grid.get(thisKey);
                let val = `${cell.value}`;
                if (cell.color) {
                    val = cell.color(`${cell.value}`);
                }
                val = val.padStart(this.maxInputLength, ' ');
                rowArray.push(val);
            }

            outString += rowArray.join(this.displaySeparator) + '\n';
        }
        return outString;
    }
}
