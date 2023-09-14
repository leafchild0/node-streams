import {Transform} from 'stream'

export class TopCrimePerArea extends Transform {

    constructor(options = {}) {
        options.objectMode = true
        super({...options})
        this.crimesPerArea = new Map()
    }

    _transform(chunk, encoding, callback) {

        const value = parseInt(chunk.value);
        if (value > 0) {

            const data = this.crimesPerArea.get(chunk.borough) || {};
            const crime = chunk.major_category;

            if (data[crime]) {
                data[crime] += 1
            } else {
                data[crime] = 1
            }
            this.crimesPerArea.set(chunk.borough, data)
        }

        callback()
    }

    _flush(callback) {
        // Let's return top areas only and skip others
        const areaAndTopCrime = new Map();
        this.crimesPerArea.forEach((v, k) => {
            const topCrime = Object.entries(this.crimesPerArea.get(k))
                .sort((v1, v2) => v1[1] - v2[1])
                .pop()[0]

            areaAndTopCrime.set(k, topCrime)
        })
        this.push(JSON.stringify(Object.fromEntries(areaAndTopCrime)), 'utf8')
        callback()
    }
}