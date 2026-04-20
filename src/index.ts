import PackageFactory from "./factories/PackageFatory";
import { SafeTravelService, TouristTourService, AirportTransferService, RoomWithViewService } from "./decorators/ExtraServices";

const packageFactory = new PackageFactory();

const economicPackage = packageFactory.createPackageTravel('economico');
console.log(economicPackage.getPackageType());

const premiumPackage = packageFactory.createPackageTravel('premium');
console.log(premiumPackage.getPackageType());

const luxuryPackage = packageFactory.createPackageTravel('luxo');
console.log(luxuryPackage.getPackageType());

const packageTravel = (
    new AirportTransferService(
        new TouristTourService(
            new SafeTravelService(
                packageFactory.createPackageTravel('premium')
            )
        )
    )
);
console.log(packageTravel.getTotalPrice());