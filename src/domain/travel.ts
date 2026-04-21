import { PACKAGE_BASE_PRICES } from './packageBasePrices';
import PackageFactory from '../factories/PackageFatory';
import {
  AirportTransferService,
  RoomWithViewService,
  SafeTravelService,
  TouristTourService,
} from '../decorators/ExtraServices';
import { IPackageTravel } from '../interfaces/IPackage';

export type PackageType = 'economico' | 'premium' | 'luxo';

export type PaymentStatus = 'pendente' | 'aprovado' | 'falhou';

export interface TravelPackageOption {
  type: PackageType;
  title: string;
  description: string;
  basePrice: number;
}

export interface ExtraServiceOption {
  id: string;
  title: string;
  price: number;
}

export interface OrderPaymentInfo {
  transactionId: string;
  providerStatus: string;
  source: 'live' | 'cache';
  elapsedMs: number;
  message: string;
}

export interface TravelOrder {
  id: string;
  createdAt: string;
  packageType: PackageType;
  extraServiceIds: string[];
  subtotal: number;
  discount: number;
  total: number;
  paymentStatus: PaymentStatus;
  paymentInfo?: OrderPaymentInfo;
}

export const packageCatalog: TravelPackageOption[] = [
  {
    type: 'economico',
    title: 'Econômico',
    description: 'Boa escolha para economizar e viajar com conforto essencial.',
    basePrice: PACKAGE_BASE_PRICES.economico,
  },
  {
    type: 'premium',
    title: 'Premium',
    description: 'Mais comodidade, roteiros completos e assistência dedicada.',
    basePrice: PACKAGE_BASE_PRICES.premium,
  },
  {
    type: 'luxo',
    title: 'Luxo',
    description: 'Experiência exclusiva com hospedagem e serviços de alto padrão.',
    basePrice: PACKAGE_BASE_PRICES.luxo,
  },
];

export const extraServicesCatalog: ExtraServiceOption[] = [
  { id: 'seguro', title: 'Seguro viagem', price: 100 },
  { id: 'passeio', title: 'Passeio turístico', price: 150 },
  { id: 'transfer', title: 'Transfer aeroporto', price: 200 },
  { id: 'vista', title: 'Quarto com vista', price: 250 },
];

function buildPackageWithPatterns(
  packageType: PackageType,
  extraServiceIds: string[]
):
  | IPackageTravel
  | SafeTravelService
  | TouristTourService
  | AirportTransferService
  | RoomWithViewService {
  const packageFactory = new PackageFactory();
  let composedPackage:
    | IPackageTravel
    | SafeTravelService
    | TouristTourService
    | AirportTransferService
    | RoomWithViewService = packageFactory.createPackageTravel(packageType);

  for (const extraId of extraServiceIds) {
    switch (extraId) {
      case 'seguro':
        composedPackage = new SafeTravelService(composedPackage);
        break;
      case 'passeio':
        composedPackage = new TouristTourService(composedPackage);
        break;
      case 'transfer':
        composedPackage = new AirportTransferService(composedPackage);
        break;
      case 'vista':
        composedPackage = new RoomWithViewService(composedPackage);
        break;
      default:
        throw new Error(`Serviço extra inválido: ${extraId}`);
    }
  }

  return composedPackage;
}

export function getPackageByType(type: PackageType): TravelPackageOption {
  const found = packageCatalog.find((item) => item.type === type);
  if (!found) {
    throw new Error('Tipo de pacote inválido.');
  }
  return found;
}

export function calculateSubtotal(packageType: PackageType, extraServiceIds: string[]): number {
  const composedPackage = buildPackageWithPatterns(packageType, extraServiceIds);

  if ('getTotalPrice' in composedPackage) {
    return composedPackage.getTotalPrice();
  }

  return composedPackage.getInitialPrice();
}

export function createOrder(packageType: PackageType, extraServiceIds: string[]): TravelOrder {
  const subtotal = calculateSubtotal(packageType, extraServiceIds);

  return {
    id: `PED-${Date.now()}`,
    createdAt: new Date().toISOString(),
    packageType,
    extraServiceIds,
    subtotal,
    discount: 0,
    total: subtotal,
    paymentStatus: 'pendente',
  };
}

export function applyManagerDiscount(order: TravelOrder, discountValue: number): TravelOrder {
  const normalizedDiscount = Number.isFinite(discountValue) ? Math.max(0, discountValue) : 0;
  const effectiveDiscount = Math.min(normalizedDiscount, order.subtotal);

  if (order.paymentStatus === 'aprovado') {
    return {
      id: order.id,
      createdAt: order.createdAt,
      packageType: order.packageType,
      extraServiceIds: order.extraServiceIds,
      subtotal: order.subtotal,
      discount: effectiveDiscount,
      total: order.subtotal - effectiveDiscount,
      paymentStatus: 'pendente',
    };
  }

  return {
    ...order,
    discount: effectiveDiscount,
    total: order.subtotal - effectiveDiscount,
    paymentStatus: order.paymentStatus,
  };
}
