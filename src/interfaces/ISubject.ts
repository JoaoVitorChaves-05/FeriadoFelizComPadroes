import { IPriceObserver } from './IViewPrices';

interface ISubject {
    attach(observer: IPriceObserver): void;
    detach(observer: IPriceObserver): void;
    notify(): void;
}

export type { ISubject };
