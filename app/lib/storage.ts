import { BatchLot, B2BLotTender, HarvestedComponent } from '../types';
import { INITIAL_BATCH_LOTS, INITIAL_TENDERS, INITIAL_COMPONENTS } from './constants';

const LOTS_STORAGE_KEY = 'zypher_b2b_lots_v1';
const TENDERS_STORAGE_KEY = 'zypher_b2b_tenders_v1';
const COMPONENTS_STORAGE_KEY = 'zypher_b2b_components_v1';

export class ZypherDataService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- LOTS (DECOMMISSIONING BATCHES) ---
  public static getLots(): BatchLot[] {
    if (!this.isBrowser()) return INITIAL_BATCH_LOTS;
    try {
      const data = localStorage.getItem(LOTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(INITIAL_BATCH_LOTS));
        return INITIAL_BATCH_LOTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BATCH_LOTS;
    }
  }

  public static saveLot(lot: BatchLot): BatchLot[] {
    const existing = this.getLots();
    const updated = [lot, ...existing.filter((item) => item.id !== lot.id)];
    if (this.isBrowser()) {
      localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  public static updateLotStatus(
    id: string,
    status: BatchLot['status'],
    triage?: BatchLot['triage'],
    isSettled?: boolean
  ): BatchLot[] {
    const existing = this.getLots();
    const updated = existing.map((lot) => {
      if (lot.id === id) {
        return {
          ...lot,
          status,
          ...(triage ? { triage } : {}),
          ...(typeof isSettled === 'boolean' ? { isSettled } : {}),
        };
      }
      return lot;
    });
    if (this.isBrowser()) {
      localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  // --- TENDERS (B2B SMELTER AUCTION) ---
  public static getTenders(): B2BLotTender[] {
    if (!this.isBrowser()) return INITIAL_TENDERS;
    try {
      const data = localStorage.getItem(TENDERS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(TENDERS_STORAGE_KEY, JSON.stringify(INITIAL_TENDERS));
        return INITIAL_TENDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TENDERS;
    }
  }

  public static placeBid(tenderId: string, bidAmount: number): B2BLotTender[] {
    const existing = this.getTenders();
    const updated = existing.map((tender) => {
      if (tender.id === tenderId && bidAmount > tender.currentHighBid) {
        return {
          ...tender,
          currentHighBid: bidAmount,
          bidsCount: tender.bidsCount + 1,
        };
      }
      return tender;
    });
    if (this.isBrowser()) {
      localStorage.setItem(TENDERS_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  // --- HARVESTED COMPONENTS ---
  public static getComponents(): HarvestedComponent[] {
    if (!this.isBrowser()) return INITIAL_COMPONENTS;
    try {
      const data = localStorage.getItem(COMPONENTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(COMPONENTS_STORAGE_KEY, JSON.stringify(INITIAL_COMPONENTS));
        return INITIAL_COMPONENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_COMPONENTS;
    }
  }

  public static orderComponent(id: string, quantity: number): HarvestedComponent[] {
    const existing = this.getComponents();
    const updated = existing.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          availableStock: Math.max(0, c.availableStock - quantity),
        };
      }
      return c;
    });
    if (this.isBrowser()) {
      localStorage.setItem(COMPONENTS_STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  public static resetDefaults(): void {
    if (this.isBrowser()) {
      localStorage.setItem(LOTS_STORAGE_KEY, JSON.stringify(INITIAL_BATCH_LOTS));
      localStorage.setItem(TENDERS_STORAGE_KEY, JSON.stringify(INITIAL_TENDERS));
      localStorage.setItem(COMPONENTS_STORAGE_KEY, JSON.stringify(INITIAL_COMPONENTS));
    }
  }
}
