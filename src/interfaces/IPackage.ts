type PackageType = 'economico' | 'premium' | 'luxo';

interface IPackageTravel {
    getPackageType(): PackageType;
    getDescription(): string;
    getInitialPrice(): number;

    setDescription(description: string): void;
    setPrice(price: number): void;
}

interface IPackageFactory {
    createPackageTravel(type: PackageType): IPackageTravel;
}

interface IExtraServiceItem {
    getServiceName(): string;
    getServicePrice(): number;
    setServicePrice(price: number): void;
}

interface IExtraService {
    getServices(): IExtraServiceItem[];
    getTotalPrice(): number;
    getPackageTravel(): IPackageTravel;
}

export type {
    IPackageFactory,
    IPackageTravel,
    PackageType,
    IExtraService,
    IExtraServiceItem,
};
