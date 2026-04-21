import { TravelOrder } from '../domain/travel';
import { OrderValueObserver } from './OrderValueObserver';

export class OrderValueSubject {
  private observers: OrderValueObserver[] = [];

  attach(observer: OrderValueObserver): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  detach(observer: OrderValueObserver): void {
    this.observers = this.observers.filter((item) => item !== observer);
  }

  notify(order: TravelOrder): void {
    for (const observer of this.observers) {
      observer.onOrderValueChanged(order);
    }
  }
}
