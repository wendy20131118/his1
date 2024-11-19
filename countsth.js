const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '.');

function countOccurrences(json, searchString) {
    let count = 0;
    const jsonString = JSON.stringify(json);
    let pos = jsonString.indexOf(searchString);
    while (pos !== -1) {
        count++;
        pos = jsonString.indexOf(searchString, pos + 1);
    }
    return count;
}

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    let totalOccurrences = 0;
    files.forEach((file) => {
        if (path.extname(file) === '.json') {
            const filePath = path.join(directoryPath, file);
            const data = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(data);
            totalOccurrences += countOccurrences(json, '腦炎');
        }
    });
    console.log(`Total occurrences of "腦炎": ${totalOccurrences}`);
});
