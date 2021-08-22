import {EventEmitter} from 'events';

class Ticker extends EventEmitter {
    static #timeout = 50;
    static #validationError = new Error(`The number has be higher than ${Ticker.#timeout}ms`);

    #totalTicks = 0;
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
        if (this.#number >= Ticker.#timeout) {
            setImmediate(() => {
                this.#totalTicks++;
                this.emit('tick', 0);
            });
            this.#executeTimer();
        } else {
            this.#callback(Ticker.#validationError);
            this.emit('error', Ticker.#validationError);
        }

        return this;
    }

}

export default (number, callback) => new Ticker(number, callback);
