import {EventEmitter} from 'events';

class Ticker extends EventEmitter {
    static #timeout = 50;
    static #validationError = new Error(`The number has be higher than ${Ticker.#timeout}ms`);

    #totalMs = 0;
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
        if (this.#number >= Ticker.#timeout) {
            this.#executeTimer();
        } else {
            this.#callback(Ticker.#validationError);
            this.emit('error', Ticker.#validationError);
        }

        return this;
    }

}

export default function (number, callback) {
    return new Ticker(number, callback);
}
