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

    #executeTimer() {
        setTimeout(() => {
            const totalMs = this.#totalTicks * Ticker.#timeout;

            this.#totalTicks++;
            this.emit('tick', totalMs);

            if (totalMs >= this.#number) {
                this.#callback(null, this.#totalTicks);
            } else {
                this.#executeTimer();
            }
        }, Ticker.#timeout);
    }

    start() {
        setImmediate(() => {
            this.#totalTicks = 1;
            this.emit('tick', 0);
            this.#executeTimer();
        });

        return this;
    }

}

export default (number, callback) => new Ticker(number, callback);
