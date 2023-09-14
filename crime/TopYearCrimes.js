import {Transform} from 'stream'

export class TopYearCrimes extends Transform {

    constructor(options = {}) {
        options.objectMode = true
        super({...options})
        this.crimesPerYear = new Map()
    }

    _transform(chunk, encoding, callback) {

        const value = parseInt(chunk.value);
        if (value > 0) {

            const year = parseInt(chunk.year)
            const amount = this.crimesPerYear.get(year) || 0;
            this.crimesPerYear.set(year, amount + 1)
        }
        callback()
    }

    _flush(callback) {
        // Sort it out, then check whether last year amount is <=> of the last, stream one word with result
        const sorted = new Map([...this.crimesPerYear.entries()].sort((v1, v2) => v1[1] - v2[1]))
        let result = 'same';
        let keys = Array.from(sorted.keys());

        if (sorted.get(keys[0]) > sorted.get(keys[keys.length - 1])) result = 'up'
        else if (sorted.get(keys[0]) < sorted.get(keys[keys.length - 1])) result = 'down'

        this.push(result, 'utf8')
        callback()
    }
}