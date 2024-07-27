import fs from "fs"

import { faker } from '@faker-js/faker';


    

// const writeMany = async (numberOfWrites) => {
//     console.time("start");
//     const stream = fs.createWriteStream("dest.json");
//     let i = 0;
//     stream.write('[')
    
//     const generate = () => {
//         while (i < numberOfWrites) {
//             const obj = {
//                 name: faker.person.fullName(),
//                 username : faker.internet.userName(),               
//                 email: faker.internet.email(),
//                 phone: faker.phone.number(),
//             };
//             const jsonString = JSON.stringify(obj);
//             const buff = Buffer.from(jsonString , "utf-8"); 

//             if (i>0 && i < numberOfWrites ) {
//                 stream.write(',');
//             }
//             if (i === numberOfWrites-1) {
//                 return stream.end(buff+']');
//             }
//             if (i % 100000 === 0) {
//                 console.log(`Generated ${i} rows`);
//             }

//             if (!stream.write(buff)) {
//                 break;
//             }

//             i++;
//         }
//     };

//     generate();
//     stream.on("drain", () => {
//         generate();
//     });
    

//     stream.on("finish", () => {
//         console.timeEnd("start");
//     });
// };

const writeManys = async (numberOfWrites) => {
    console.time("start");
    
    const stream = fs.createWriteStream("./dest.json");
    const chunkSize = 100000; 
    
    stream.write('[');

    let i = 0;
    let first = true;

    const generate = () => {
        let buffer = '';
        while (i < numberOfWrites) {
            if (!first) {
                buffer += ','; 
            }
            
            const obj = {
                name: faker.person.fullName(),
                username: faker.internet.userName(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
            };
            buffer += JSON.stringify(obj);
            if(i%1000000 == 0){
                console.log(`genrated ${i}rows`);
            }

            if (++i % chunkSize === 0) {
                if (!stream.write(buffer)) {
                    buffer = ''; 
                    return; 
                }
                buffer = '';
                console.log(`Generated ${i} rows`);
            }

            first = false;
        }

        if (buffer) {
            if (!stream.write(buffer)) {
                return; 
            }
        }

        stream.end(']');
    };

    generate();

    stream.on("drain", () => {
        generate(); 
    });

    stream.on("finish", () => {
        console.timeEnd("start");
    });
};



export { writeManys};





