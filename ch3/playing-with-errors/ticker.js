import {EventEmitter} from 'events';

class Ticker extends EventEmitter {
    static #timeout = 50;

    #totalTicks;
    #number;
    #callback;

    constructor(number, callback) {
        super();
        this.#number = number;
        this.#callback = callback;
    }

    static #isTimestampCorrect(timestamp = Date.now()) {
        return timestamp % 5 === 0;
    }

    #fireTimestampError(timestamp) {
        const validationError = new Error(`The timestamp is divisible by 5: ${timestamp}`);

        this.emit('error', validationError);
        this.#callback(validationError);
    }

    #executeTimer() {
        setTimeout(() => {
            const timestamp = Date.now();

            if (Ticker.#isTimestampCorrect(timestamp)) {
                return this.#fireTimestampError(timestamp);
            }

            const totalMs = this.#totalTicks * Ticker.#timeout;

            this.#totalTicks++;
            this.emit('tick', totalMs);

            if (totalMs >= this.#number) {
                return this.#callback(null, this.#totalTicks);
            }

            this.#executeTimer();
        }, Ticker.#timeout);
    }

    start() {
        setImmediate(() => {
            const timestamp = Date.now();

            if (Ticker.#isTimestampCorrect(timestamp)) {
                return this.#fireTimestampError(timestamp);
            }

            this.#totalTicks = 1;
            this.emit('tick', 0);
            this.#executeTimer();
        });
        return this;
    }

}

export default (number, callback) => new Ticker(number, callback);
