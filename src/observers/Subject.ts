import { ISubject } from '../interfaces/ISubject';
import { IPriceObserver } from '../interfaces/IPricesObserver';

class Subject implements ISubject {
    private observers: IPriceObserver[] = [];

    attach(observer: IPriceObserver): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    detach(observer: IPriceObserver): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notify(price: number = 0, extraServices?: any): void {
        for (const observer of this.observers) {
            observer.update(price, extraServices);
        }
    }

    getObserversCount(): number {
        return this.observers.length;
    }
}

export { Subject };
