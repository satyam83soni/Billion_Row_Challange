import fs from 'fs';
import JSONStream from 'JSONStream';
import { Transform } from 'stream';

const manipulate = (keysToRemove, keysToCheck) => {
    console.time('start')
    const readStream = fs.createReadStream("../write/dest.json", { encoding: 'utf8' });
    const writeStream = fs.createWriteStream("dest.json");
    
    writeStream.write('[');

    let count = 0;
    let removedCount = 0;
    let first = true; 

    const filterStream = new Transform({
        objectMode: true,
        transform(chunk, encoding, callback) {
            const toCheck = chunk[keysToCheck];
            let removed = false;

            if (typeof toCheck === 'string') {
                const values = toCheck.split(' ');

                removed = keysToRemove.some(toRemove => {
                    if (toRemove.includes(' ')) {
                        return toRemove === toCheck;
                    } else {
                        return values.includes(toRemove);
                    }
                });
            } else if (keysToRemove.includes(toCheck)) {
                removed = true;
            }

            if (!removed) {
                if (!first) {
                    this.push(',');
                }
                this.push(JSON.stringify(chunk));
                count++;
                first = false;
            } else {
                removedCount++;
            }

            callback();
        }
    });

    filterStream.on('end', () => {
        writeStream.write(']');
        writeStream.end();
        console.log(`Data removed. ${count} rows written to dest.json. ${removedCount} rows removed.`);
    });

    readStream
        .pipe(JSONStream.parse('*'))
        .pipe(filterStream)
        .pipe(writeStream);
        console.timeEnd('start')
};

export { manipulate };

