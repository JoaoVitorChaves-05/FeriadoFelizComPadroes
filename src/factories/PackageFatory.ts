import { IPackageFactory, IPackageTravel, PackageType } from '../interfaces/IPackage';

class Economico implements IPackageTravel {
    private packageType: PackageType = 'economico'
    private description: string = 'Pacote econômico com serviços básicos';
    private initialPrice: number = 1000;

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
    calculateTotalPrice(): number {
        return this.initialPrice;
    }
}

class Premium implements IPackageTravel {
    private packageType: PackageType = 'premium'
    private description: string = 'Pacote premium com serviços adicionais'
    private initialPrice: number = 2000;

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
    calculateTotalPrice(): number {
        return this.initialPrice;
    }
}

class Luxo implements IPackageTravel {
    private packageType: PackageType = 'luxo'
    private description: string = 'Pacote de luxo com serviços exclusivos'
    private initialPrice: number = 5000;    

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