import {
    IPackageTravel,
    IExtraService,
    IExtraServiceItem,
} from '../interfaces/IPackage';

class ExtraServicesDecorator implements IExtraService {
    protected packageTravel: IPackageTravel;
    public services: IExtraServiceItem[];

    constructor(packageTravel: IPackageTravel) {
        this.packageTravel = packageTravel;
        this.services = [];
    }

    getServices(): IExtraServiceItem[] {
        return this.services;
    }

    getTotalPrice(): number {
        const basePrice = this.packageTravel.getInitialPrice();
        const servicesPrice = this.services.reduce((total, service) => total + service.getServicePrice(), 0);
        return basePrice + servicesPrice;
    }

    getPackageTravel(): IPackageTravel {
        return this.packageTravel;
    }
}

/* 
3. O cliente pode adicionar extras ao pacote:
	 - Seguro viagem
	 - Passeio turistico
	 - Transfer aeroporto
	 - Quarto com vista
*/

class SafeTravelService extends ExtraServicesDecorator implements IExtraServiceItem {
    private serviceName: string = 'Seguro Viagem';
    private servicePrice: number = 100; // Exemplo de preço para o serviço de seguro viagem

    constructor(packageTravel: IPackageTravel | ExtraServicesDecorator) {
        const basePackage = packageTravel instanceof ExtraServicesDecorator
            ? packageTravel.getPackageTravel()
            : packageTravel;

        super(basePackage);

        if (packageTravel instanceof ExtraServicesDecorator) {
            this.services = [...packageTravel.getServices(), this];
        } else {
            this.services = [this];
        }
    }

    getServiceName(): string {
        return this.serviceName;
    }

    getServicePrice(): number {
        return this.servicePrice;
    }

    setServicePrice(price: number): void {
        this.servicePrice = price;
    }

}

class TouristTourService extends ExtraServicesDecorator implements IExtraServiceItem {
    private serviceName: string = 'Passeio Turístico';
    private servicePrice: number = 150; // Exemplo de preço para o serviço de passeio turístico

    constructor(packageTravel: IPackageTravel | ExtraServicesDecorator) {
        const basePackage = packageTravel instanceof ExtraServicesDecorator
            ? packageTravel.getPackageTravel()
            : packageTravel;

        super(basePackage);

        if (packageTravel instanceof ExtraServicesDecorator) {
            this.services = [...packageTravel.getServices(), this];
        } else {
            this.services = [this];
        }
    }

    getServiceName(): string {
        return this.serviceName;
    }

    getServicePrice(): number {
        return this.servicePrice;
    }

    setServicePrice(price: number): void {
        this.servicePrice = price;
    }
}

class AirportTransferService extends ExtraServicesDecorator implements IExtraServiceItem {
    private serviceName: string = 'Transfer Aeroporto';
    private servicePrice: number = 200; // Exemplo de preço para o serviço de transfer aeroporto

    constructor(packageTravel: IPackageTravel | ExtraServicesDecorator) {
        const basePackage = packageTravel instanceof ExtraServicesDecorator
            ? packageTravel.getPackageTravel()
            : packageTravel;

        super(basePackage);

        if (packageTravel instanceof ExtraServicesDecorator) {
            this.services = [...packageTravel.getServices(), this];
        } else {
            this.services = [this];
        }
    }

    getServiceName(): string {
        return this.serviceName;
    }

    getServicePrice(): number {
        return this.servicePrice;
    }

    setServicePrice(price: number): void {
        this.servicePrice = price;
    }
}

class RoomWithViewService extends ExtraServicesDecorator implements IExtraServiceItem {
    private serviceName: string = 'Quarto com Vista';
    private servicePrice: number = 250; // Exemplo de preço para o serviço de quarto com vista

    constructor(packageTravel: IPackageTravel | ExtraServicesDecorator) {
        const basePackage = packageTravel instanceof ExtraServicesDecorator
            ? packageTravel.getPackageTravel()
            : packageTravel;

        super(basePackage);

        if (packageTravel instanceof ExtraServicesDecorator) {
            this.services = [...packageTravel.getServices(), this];
        } else {
            this.services = [this];
        }
    }

    getServiceName(): string {
        return this.serviceName;
    }

    getServicePrice(): number {
        return this.servicePrice;
    }

    setServicePrice(price: number): void {
        this.servicePrice = price;
    }
}

export { SafeTravelService, TouristTourService, AirportTransferService, RoomWithViewService };