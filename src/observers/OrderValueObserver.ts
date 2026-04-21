import { TravelOrder } from '../domain/travel';

export interface OrderValueObserver {
  onOrderValueChanged(order: TravelOrder): void;
}
