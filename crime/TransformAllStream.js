import {Transform} from 'stream'

export class TransformAllStream extends Transform {

    constructor(options = {}) {
        options.objectMode = true
        super({...options})
        this.crimesPerCategory = new Map()
        this.crimesPerArea = new Map()
        this.crimesPerYear = new Map()
        this.topCrimesInArea = new Map()
    }

    _transform(chunk, encoding, callback) {

        const value = parseInt(chunk.value);
        if (value > 0) {

            // Year crimes
            this.topYearCrimes(chunk.year);
            //Crimes in area
            this.topCrimesInArea(chunk.borough);
            // Crimes per area
            this.topCrimesPerArea(chunk.borough, chunk.major_category);
            // Less common crimes
            this.lessCommonCrimes(chunk.major_category);
        }
        callback()
    }

    topYearCrimes(year) {
        const intYear = parseInt(year)
        let amount = this.crimesPerYear.get(intYear) || 0
        this.crimesPerYear.set(intYear, amount + 1)
    }

    topCrimesInArea(area) {
        const amount = this.topCrimesInArea.get(area) || 0
        this.topCrimesInArea.set(area, amount + 1)
    }

    topCrimesPerArea(area, category) {
        const data = this.crimesPerArea.get(area) || {}

        if (data[category]) {
            data[category] += 1
        } else {
            data[category] = 1
        }
        this.crimesPerArea.set(area, data)
    }

    lessCommonCrimes(category) {
        const data = this.crimesPerCategory.get(category) || 0
        this.crimesPerCategory.set(category, data + 1)
    }

    _flush(callback) {

        // Top year crimes
        let result = this.calculateYearCrimes();
        this.push('Did the number of crimes go up or down over the years?', 'utf8')
        this.push(result, 'utf8')

        // Top crime areas
        const topCrimesInArea = this.calculateTopCrimes();
        this.push('What are the most dangerous areas of London?', 'utf8')
        this.push(topCrimesInArea, 'utf8')

        // Top crimes per area
        const areaAndTopCrime = JSON.stringify(this.calculateTopCrimesPerArea());
        this.push('What is the most common crime per area?', 'utf8')
        this.push(areaAndTopCrime, 'utf8')

        // Let's return top areas only and skip others
        const leastCommon = [...this.crimesPerCategory.entries()].sort((v1, v2) => v1[1] - v2[1]).slice(0, 1).flat()[0]
        this.push('What is the least common crime?', 'utf8')
        this.push(leastCommon, 'utf8')

        callback()
    }

    calculateTopCrimes() {
        const sorted = new Map([...this.topCrimesInArea.entries()].sort().slice(0, this.top));
        return JSON.stringify(Object.keys(Object.fromEntries(sorted)))
    }

    calculateTopCrimesPerArea() {
        const areaAndTopCrime = new Map();
        this.crimesPerArea.forEach((v, k) => {
            const topCrime = Object.entries(this.crimesPerArea.get(k))
                .sort((v1, v2) => v1[1] - v2[1])
                .pop()[0]

            areaAndTopCrime.set(k, topCrime)
        })
        return Object.fromEntries(areaAndTopCrime);
    }

    calculateYearCrimes() {
        const sorted = new Map([...this.crimesPerYear.entries()].sort((v1, v2) => v1[1] - v2[1]))
        let result = 'same';
        let keys = Array.from(sorted.keys());

        if (sorted.get(keys[0]) > sorted.get(keys[keys.length - 1])) result = 'up'
        else if (sorted.get(keys[0]) < sorted.get(keys[keys.length - 1])) result = 'down'
        return result;
    }
}