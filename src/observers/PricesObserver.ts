import { IPriceObserver } from '../interfaces/IPricesObserver';
import { IExtraService } from '../interfaces/IPackage';

class PricesObserver implements IPriceObserver {
    private packagePrice: number = 0;
    private extraServicesPrice: number = 0;
    private totalPrice: number = 0;

    displayPackagePrice(): void {
        console.log(`Preço do pacote: R$ ${this.packagePrice}`);
    }

    displayExtraServicesPrice(): void {
        console.log(`Preço dos extras: R$ ${this.extraServicesPrice}`);
    }

    displayTotalPrice(): void {
        console.log(`Preço total: R$ ${this.totalPrice}`);
    }

    update(price: number, extraServices: IExtraService): void {
        this.packagePrice = price;
        this.extraServicesPrice = extraServices
            .getServices()
            .reduce((total, service) => total + service.getServicePrice(), 0);
        this.totalPrice = this.packagePrice + this.extraServicesPrice;
    }
}

export default PricesObserver;