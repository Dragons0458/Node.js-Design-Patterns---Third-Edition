import fs from 'fs';
import path from 'path';

const startDir = './d1';
const nesting = 4;

function readdir(dir, nesting, isLastIndex, finalContent, cb) {
    readFilesPaths(dir, nesting - 1, (err, data = []) => {
        if (err) return cb(err);

        finalContent.push(...data);

        if (isLastIndex) {
            cb(null, finalContent);
        }
    });
}

function readFilesPaths(dir, nesting, cb) {
    if (nesting === 0) return setImmediate(cb);

    const finalContent = [];

    fs.readdir(dir, {
        withFileTypes: true
    }, (err, files) => {
        if (err) return cb(err);

        const lastIndex = files.length - 1;

        for (const [index, file] of files.entries()) {
            const filePath = path.join(dir, file.name);

            if (file.isDirectory()) {
                readdir(filePath, nesting, index === lastIndex, finalContent, cb);
            } else if (file.isFile()) {
                finalContent.push(filePath);

                if (index === lastIndex) {
                    setImmediate(() => cb(null, finalContent));
                }
            }
        }
    });
}

readFilesPaths(startDir, nesting, (err, data) => {
    if (err) return err;

    console.log(data);
});
