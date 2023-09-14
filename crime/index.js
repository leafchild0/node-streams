import { createReadStream } from 'fs'
import { parse } from 'csv-parse'
import { TopYearCrimes } from './TopYearCrimes.js'
import {TopCrimeAreas} from "./TopCrimeAreas.js";
import {PassThrough} from "stream";
import {TopCrimePerArea} from "./TopCrimePerArea.js";
import {LessCommonCrime} from "./LessCommonCrime.js";
import {TransformAllStream} from "./TransformAllStream.js";

const filename = process.argv[2]
const csvParser = parse({ columns: true })

/**
 * This is a small utility tool to check power of Streams.
 * There is a data as input file about crimes in London
 * Need to parse it and answer the following questions:
 *
 *  - Did the number of crimes go up or down over the years?
 *  - What are the most dangerous areas of London?
 *  - What is the most common crime per area?
 *  - What is the least common crime?
 */
const monitorDataStream = (message) => {
    const monitor = new PassThrough()

    monitor.on('data', (chunk) => {
        if (message) console.log(`${message}: ${chunk.toString()}`)
        else console.log(chunk.toString())
    })
    return monitor
}

const inputStream = createReadStream(filename).pipe(csvParser)

//By years
inputStream
    .pipe(new TopYearCrimes())
    .pipe(monitorDataStream('Did the number of crimes go up or down over the years?'))
    .on('error', (e) => console.error(e))

// Most dangerous area
inputStream
    .pipe(new TopCrimeAreas(3))
    .pipe(monitorDataStream('What are the most dangerous areas of London?'))
    .on('error', (e) => console.error(e))

// Most crime per area
inputStream
    .pipe(new TopCrimePerArea())
    .pipe(monitorDataStream('What is the most common crime per area?'))
    .on('error', (e) => console.error(e))

// Most crime per area
inputStream
    .pipe(new LessCommonCrime())
    .pipe(monitorDataStream('What is the least common crime?'))
    .on('error', (e) => console.error(e))

console.time()

// All in one Transform
inputStream
    .pipe(new TransformAllStream())
    .pipe(monitorDataStream())
    .on('error', (e) => console.error(e))
.on('finish', () => console.timeEnd())