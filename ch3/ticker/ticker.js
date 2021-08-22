import {EventEmitter} from 'events';

class Ticker extends EventEmitter {
    static #timeout = 50;

    #totalMs;
    #number;
    #callback;

    constructor(number, callback) {
        super();
        this.#number = number;
        this.#callback = callback;
    }

    #executeTimer() {
        setTimeout(() => {
            this.#totalMs += Ticker.#timeout;
            this.emit('tick', this.#totalMs);

            if (this.#totalMs >= this.#number) {
                this.#callback(null, this.#totalMs / Ticker.#timeout);
            } else {
                this.#executeTimer();
            }
        }, Ticker.#timeout);
    }

    start() {
        this.#totalMs = 0;
        this.#executeTimer();

        return this;
    }

}

export default (number, callback) => new Ticker(number, callback);
