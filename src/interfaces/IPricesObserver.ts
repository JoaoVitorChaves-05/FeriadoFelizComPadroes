import { IExtraService } from './IPackage';

interface IPriceObserver {
    displayPackagePrice(): void;
    displayExtraServicesPrice(): void;
    displayTotalPrice(): void;

    update(price: number, extraServices: IExtraService): void;
}

export type { IPriceObserver };