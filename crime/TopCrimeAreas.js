import {Transform} from 'stream'

export class TopCrimeAreas extends Transform {

    constructor(top, options = {}) {
        options.objectMode = true
        super({...options})
        this.topCrimesInArea = new Map()
        this.top = top
    }

    _transform(chunk, encoding, callback) {

        const value = parseInt(chunk.value);
        if (value > 0) {

            const amount = this.topCrimesInArea.get(chunk.borough) || 0;
            this.topCrimesInArea.set(chunk.borough, amount + 1)
        }
        callback()
    }

    _flush(callback) {
        // Let's return top areas only and skip others
        this.topCrimesInArea = new Map([...this.topCrimesInArea.entries()].sort().slice(0, this.top));
        this.push(JSON.stringify(Object.keys(Object.fromEntries(this.topCrimesInArea))), 'utf8')
        callback()
    }
}