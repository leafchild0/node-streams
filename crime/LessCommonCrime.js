import {Transform} from 'stream'

export class LessCommonCrime extends Transform {

    constructor(options = {}) {
        options.objectMode = true
        super({...options})
        this.crimesPerCategory = new Map()
    }

    _transform(chunk, encoding, callback) {

        const value = parseInt(chunk.value);
        if (value > 0) {

            const category = chunk.major_category;
            const data = this.crimesPerCategory.get(category) || 0;
            this.crimesPerCategory.set(category, data + 1)
        }
        callback()
    }

    _flush(callback) {
        // Let's return top areas only and skip others
        const leastCommon = [...this.crimesPerCategory.entries()].sort((v1, v2) => v1[1] - v2[1]).slice(0, 1).flat()[0]
        this.push(leastCommon, 'utf8')
        callback()
    }
}