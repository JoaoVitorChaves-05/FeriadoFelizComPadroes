import PackageFactory from './factories/PackageFatory';
import { SafeTravelService, TouristTourService, AirportTransferService, RoomWithViewService } from './decorators/ExtraServices';
import { PricesObserver } from './observers/ViewPrices';

console.log('=== Demonstração do Padrão Observer em Ação ===\n');

// Criar factory
const packageFactory = new PackageFactory();

// Criar pacote base
const basePackage = packageFactory.createPackageTravel('premium');
console.log(`Pacote criado: ${basePackage.getPackageType()}`);
console.log(`Preço base: R$ ${basePackage.getInitialPrice()}\n`);

// Decorar com serviços extras
const packageWithServices = new RoomWithViewService(
    new AirportTransferService(
        new TouristTourService(
            new SafeTravelService(basePackage)
        )
    )
);

console.log(`Preço total com extras: R$ ${packageWithServices.getTotalPrice()}\n`);

// Criar observer
const observer = new PricesObserver();

// Registrar observer no subject do decorator
packageWithServices.getSubject().attach(observer);

console.log('--- Observer registrado no Subject ---\n');

// Alterar preço de um serviço (dispara notificação)
console.log('Alterando preço do "Transfer Aeroporto" para R$ 300...');
const services = packageWithServices.getServices();
if (services.length > 0) {
    services[0].setServicePrice(300);
    console.log('\nObserver foi notificado!');
    observer.displayPackagePrice();
    observer.displayExtraServicesPrice();
    observer.displayTotalPrice();
}

console.log('\n--- Alterando preço do pacote base ---');
console.log('Alterando preço do pacote para R$ 2500...');
basePackage.setPrice(2500);
console.log('Novo preço total: R$ ' + packageWithServices.getTotalPrice());
