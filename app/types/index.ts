export type UserRole = 'consignor' | 'recycler' | 'auditor';

export type WasteCategory =
  | 'server_blade'
  | 'laptops_pc'
  | 'networking'
  | 'telecom_pcb'
  | 'lithium_batteries'
  | 'mixed_scrap';

export type SanitizationMethod =
  | 'nist_purge' // NIST SP 800-88 Purge (Cryptographic Erase)
  | 'nist_clear' // NIST SP 800-88 Clear (Multi-pass Overwrite)
  | 'physical_shred' // 3mm Physical Particle Destruction
  | 'degauss'; // High-Gauss Magnetic Field Degaussing

export type TriageDestination =
  | 'pending'
  | 'refurbish' // Secondary Market / B2B Refurbishing
  | 'harvest' // Board-Level Component Harvesting
  | 'smelt_mining'; // Hydrometallurgical Urban Mining (Metal Smelting)

export type LotStatus =
  | 'SCHEDULED' // Jadwal Penjemputan Terkonfirmasi
  | 'IN_TRANSIT' // Pengangkutan HazMat Berjalan
  | 'AT_FACILITY' // Tiba di Fasilitas Pemilahan B3
  | 'TRIAGE_QC' // Pemeriksaan Spektrometri & Triage
  | 'COMPLETED'; // Sertifikat CoD Terbit & Dana Rekber Cair

export interface BatchLot {
  id: string; // e.g. LOT-CORP-2026-091
  companyName: string;
  picName: string;
  picContact: string;
  category: WasteCategory;
  itemDescription: string;
  quantityUnits: number;
  estimatedWeightKg: number;
  declaredValue: number;
  sanitization: SanitizationMethod;
  triage: TriageDestination;
  status: LotStatus;
  courier: string;
  manifestCode: string; // e.g. FES-B107D-8912
  hashProof: string; // SHA-256 Mock/Crypto Hash
  yieldProjection: {
    goldGrams: number;
    copperKg: number;
    silverGrams: number;
    co2eAvoidedTon: number;
  };
  payoutBank: string;
  payoutAccount: string;
  isSettled: boolean;
  createdAt: string;
  notes?: string;
}

export interface B2BLotTender {
  id: string;
  lotNumber: string;
  title: string;
  originCompany: string;
  weightKg: number;
  grade: 'Tier-1 High Yield' | 'Tier-2 Mid Grade' | 'Tier-3 Industrial Scrap';
  estimatedAuGrams: number;
  estimatedCuKg: number;
  currentHighBid: number;
  bidsCount: number;
  deadline: string;
  location: string;
  verifiedAssay: boolean;
}

export interface HarvestedComponent {
  id: string;
  sku: string;
  title: string;
  category: 'Server Memory' | 'Enterprise CPU' | 'Power Systems' | 'Network Mod' | 'Battery Cells';
  grade: 'Grade A (Refurbished)' | 'Grade B (Functional)' | 'Tested Core';
  unitPrice: number;
  availableStock: number;
  specNotes: string;
}

export interface CommodityPrice {
  name: string;
  symbol: string;
  price: number;
  unit: string;
  changePercent: number;
  currency: 'USD' | 'IDR';
}

export interface AuditManifest {
  id: string;
  lotId: string;
  festronikCode: string;
  wasteCodeB3: string;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  auditorName: string;
  timestamp: string;
  signedHash: string;
  status: 'VERIFIED' | 'FLAGGED';
}
