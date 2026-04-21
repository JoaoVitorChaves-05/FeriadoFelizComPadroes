import { IPackageFactory, IPackageTravel, PackageType } from '../interfaces/IPackage';
import { PACKAGE_BASE_PRICES } from '../domain/packageBasePrices';

class Economico implements IPackageTravel {
    private packageType: PackageType = 'economico'
    private description: string = 'Pacote econômico com serviços básicos';
    private initialPrice: number = PACKAGE_BASE_PRICES.economico;
    

    getPackageType(): PackageType {
        return this.packageType;
    }
    getDescription(): string {
        return this.description;
    }
    getInitialPrice(): number {
        return this.initialPrice;
    }
    setDescription(description: string): void {
        this.description = description;
    }
    setPrice(price: number): void {
        this.initialPrice = price;
    }
    calculateTotalPrice(): number {
        return this.initialPrice;
    }
    
}

class Premium implements IPackageTravel {
    private packageType: PackageType = 'premium'
    private description: string = 'Pacote premium com serviços adicionais'
    private initialPrice: number = PACKAGE_BASE_PRICES.premium;
    

    getPackageType(): PackageType {
        return this.packageType;
    }
    getDescription(): string {
        return this.description;
    }
    getInitialPrice(): number {
        return this.initialPrice;
    }
    setDescription(description: string): void {
        this.description = description;
    }
    setPrice(price: number): void {
        this.initialPrice = price;
    }
    calculateTotalPrice(): number {
        return this.initialPrice;
    }
    
}

class Luxo implements IPackageTravel {
    private packageType: PackageType = 'luxo'
    private description: string = 'Pacote de luxo com serviços exclusivos'
    private initialPrice: number = PACKAGE_BASE_PRICES.luxo;
    

    getPackageType(): PackageType {
        return this.packageType;
    }
    getDescription(): string {
        return this.description;
    }
    getInitialPrice(): number {
        return this.initialPrice;
    }
    setDescription(description: string): void {
        this.description = description;
    }
    setPrice(price: number): void {
        this.initialPrice = price;
    }
    calculateTotalPrice(): number {
        return this.initialPrice;
    }
    
}

class PackageFactory implements IPackageFactory {
    createPackageTravel(type: PackageType): IPackageTravel {
        switch (type) {
            case 'economico':
                return new Economico();
            case 'premium':
                return new Premium();
            case 'luxo':
                return new Luxo();
            default:
                throw new Error('Package type not found');
        }
    }
}

export default PackageFactory;