export type ThemeMode = 'light' | 'dark';

export type UserRole = 'user' | 'b2b' | 'admin';

export type OrderStatus =
  | 'Menunggu Pickup'
  | 'Tiba di Gudang'
  | 'Menunggu Persetujuan User'
  | 'Selesai & Cair'
  | 'Diretur';

export type TriageCategory = 'Belum Disortir' | 'Refurbish' | 'Kanibal' | 'Urban Mining';

export interface Order {
  id: string;
  resi: string;
  nama: string;
  telepon: string;
  alamat: string;
  device: string;
  isDead: boolean;
  lcdCondition: 'normal' | 'garis' | 'retak' | 'mati';
  bodyCondition: 'mulus' | 'lecet' | 'parah';
  photos: string[];
  estimasiAwal: number;
  hargaFinal: number;
  status: OrderStatus;
  triage: TriageCategory;
  courierType: string;
  payoutMethod: string;
  payoutAccount: string;
  createdAt: string;
  notes?: string;
}

export interface PhotoData {
  file: File;
  preview: string;
}

export interface B2BCatalogItem {
  id: string;
  name: string;
  category: 'LCD & Layar' | 'Mesin & IC' | 'Kamera Copotan' | 'Baterai & Fleksibel';
  stock: string;
  stockQty: number;
  price: number;
  desc: string;
  grade: 'Grade A Servis' | 'Grade B Minus' | 'Cabutan Kanibal IC';
}

export interface B2BRequest {
  id: string;
  reqId: string;
  tipe: string;
  volume: string;
  status: string;
  price?: number;
  buyerName?: string;
  createdAt?: string;
  notes?: string;
}
