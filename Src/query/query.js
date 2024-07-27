import fs from 'fs';
import { User} from '../model/User.js';
import mongoose from 'mongoose';
import JSONStream from 'JSONStream';


const collectionName = 'User'; 


const BATCH_SIZE = 1000; 

const loadJsonToMongo = async () => {
    console.time("start")
    let buffer = [];
    let count = 0;
    const filePath= "./dest.json"
    try {
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

        const parser = JSONStream.parse('*');

        const insertBatch = async () => {
            if (buffer.length > 0) {
                try {
                    await User.insertMany(buffer);
                    count += buffer.length;
                    buffer = [];
                } catch (err) {
                    console.error('Error inserting batch:', err);
                }
            }
        };

        readStream.pipe(parser)
            .on('data', (doc) => {
                buffer.push(doc);
                if (buffer.length >= BATCH_SIZE) {
                    insertBatch();
                }
            })
            .on('end', async () => {
                await insertBatch(); 
                console.log(`Finished inserting ${count} documents`);
                return count;
                console.timeEnd("start")
            })
            .on('error', (err) => {
                console.error('Error processing the stream:', err);
            });

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    
    }
};

const loadJsonToMongos = async () => {
    console.time("start")
    let buffer = [];
    let count = 0;
    const filePath= "./dest.json"
    try {
        const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

        const parser = JSONStream.parse('*');

        const insertBatch = async () => {
            if (buffer.length > 0) {
                try {
                    await User.insertMany(buffer);
                    count += buffer.length;
                    buffer = [];
                } catch (err) {
                    console.error('Error inserting batch:', err);
                }
            }
        };

        readStream.pipe(parser)
            .on('data', (doc) => {
                buffer.push(doc);
                if (buffer.length >= BATCH_SIZE) {
                    insertBatch();
                }
            })
            .on('end', async () => {
                await insertBatch(); 
                console.log(`Finished inserting ${count} documents`);
                return count;
                console.timeEnd("start")
            })
            .on('error', (err) => {
                console.error('Error processing the stream:', err);
            });

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    
    }
};

const streamUsers = async (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Encoding', 'chunked');

        const cursor = User.find(req.query).cursor();

        let first = true;

        cursor.on('data', (doc) => {
            if (!first) {
                res.write(',');
            } else {
                first = false;
            }
            res.write(JSON.stringify(doc));
        });

        cursor.on('end', () => {
            res.end(']');
            console.log("Completed send")
        });

        cursor.on('error', (err) => {
            console.error('Error streaming data:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        });

        res.write('[');

    } catch (err) {
        console.error('Error setting up stream:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteUsers = async (req, res) => {
    try {
        const deleteCriteria = req.query;

        const result = await User.deleteMany(deleteCriteria).exec();
        
        res.status(200).json({
            message: 'Users deleted successfully',
            deletedCount: result.deletedCount
        });

    } catch (err) {
        console.error('Error deleting users:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



export { streamUsers , loadJsonToMongos , deleteUsers  ,loadJsonToMongo };
