import tickerFun from './ticker.js';

const number = process.argv[2] ?? 200;
const cb = (err, count) => {
    if (err) {
        console.error(err);
    }

    console.log(`The total number of ticks is: ${count}`);
};

tickerFun(number, cb)
    .start()
    .on('tick', data => {
        console.log(`Tick: ${data}`)
    })
    .on('error', console.error);
