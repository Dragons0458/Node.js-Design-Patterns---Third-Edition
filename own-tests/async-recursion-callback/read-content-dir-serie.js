import fs from 'fs';
import path from 'path';

function iterate(dir, files, index, nesting, finalContent, cb) {
    if (index === files.length || nesting === 0) return setImmediate(() => cb(null, finalContent));

    const file = files[index];
    const filePath = path.join(dir, file.name);

    index++;

    if (file.isDirectory()) {
        nesting--;

        return readContentDir(filePath, nesting, (err, data = new Map()) => {
            if (err) return cb(err);

            for (const [key, value] of data.entries()) {
                finalContent.set(key, value);
            }

            iterate(dir, files, index, nesting, finalContent, cb);
        });
    }

    if (file.isFile()) {
        return fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
            if (err) return cb(err);

            finalContent.set(filePath, data);

            iterate(dir, files, index, nesting, finalContent, cb);
        });
    }

    setImmediate(() => iterate(dir, files, index, nesting, finalContent, cb));
}

function readContentDir(dir, nesting, cb) {
    if (nesting === 0) return setImmediate(cb);

    fs.readdir(dir, {
        withFileTypes: true
    }, (err, files) => {
        if (err) return cb(err);

        iterate(dir, files, 0, nesting, new Map(), cb);
    });
}

const startDir = './d1';
const nesting = 3;

readContentDir(startDir, nesting, (err, data) => {
    if (err) return err;

    console.log(data);
});
