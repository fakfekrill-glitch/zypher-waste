import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  reload,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getDatabase, ref, set, push, onValue, update } from 'firebase/database';
import { FIREBASE_CONFIG, DISCORD_WEBHOOK_URL, INITIAL_ORDERS, INITIAL_B2B_REQUESTS } from './constants';
import { Order, B2BRequest } from '../types';

// SAFE FIREBASE INITIALIZATION
let app: any = null;
let auth: any = null;
let database: any = null;
const googleProvider = new GoogleAuthProvider();

try {
  app = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp();
  auth = getAuth(app);
  database = getDatabase(app);
} catch (e) {
  console.log('Firebase client init note:', e);
}

const ORDERS_KEY = 'zypher_orders_cache_v2';
const B2B_KEY = 'zypher_b2b_cache_v2';

export class ZypherBackendService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // --- DISCORD WEBHOOK ---
  public static async sendDiscordNotice(message: string): Promise<void> {
    try {
      if (!DISCORD_WEBHOOK_URL) return;
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
    } catch {}
  }

  // --- AUTH HELPERS ---
  public static getAuthInstance() {
    return auth;
  }

  public static async loginWithGoogle() {
    if (!auth) throw new Error('Firebase Auth belum terhubung');
    const result = await signInWithPopup(auth, googleProvider);
    await this.sendDiscordNotice(`[AUTH GOOGLE] User masuk: ${result.user.email}`);
    return result.user;
  }

  public static async registerWithEmail(email: string, pass: string) {
    if (!auth) throw new Error('Firebase Auth belum terhubung');
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await sendEmailVerification(cred.user);
    await this.sendDiscordNotice(`[AUTH REGISTER] Email terdaftar: ${email}`);
    return cred.user;
  }

  public static async loginWithEmail(email: string, pass: string) {
    if (!auth) throw new Error('Firebase Auth belum terhubung');
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await this.sendDiscordNotice(`[AUTH LOGIN] Sesi email aktif: ${email}`);
    return cred.user;
  }

  public static async logoutUser() {
    if (auth) {
      await signOut(auth);
    }
  }

  // --- ORDERS / PENGIRIMAN HP RUSAK ---
  public static getCachedOrders(): Order[] {
    if (!this.isBrowser()) return INITIAL_ORDERS;
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (!data) {
        localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  public static setCachedOrders(orders: Order[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }

  public static async createOrder(newOrder: Order): Promise<Order[]> {
    const current = this.getCachedOrders();
    const updated = [newOrder, ...current];
    this.setCachedOrders(updated);

    // Sync to Firebase if connected
    try {
      if (database) {
        const orderRef = ref(database, `orders/${newOrder.id}`);
        await set(orderRef, newOrder);
      }
    } catch (err) {
      console.log('Firebase sync note: local cache saved');
    }

    // Send Discord alert
    await this.sendDiscordNotice(
      `📦 [PESANAN BARU E-WASTE] Resi: ${newOrder.resi} | Device: ${newOrder.device} (${newOrder.isDead ? 'Matot' : 'Hidup'}) | Pengirim: ${newOrder.nama} | Rekber: Rp ${newOrder.estimasiAwal.toLocaleString('id-ID')} (${newOrder.payoutMethod})`
    );

    return updated;
  }

  public static async updateOrderStatus(
    orderId: string,
    status: Order['status'],
    triage?: Order['triage'],
    finalPrice?: number
  ): Promise<Order[]> {
    const current = this.getCachedOrders();
    const updated = current.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status,
          ...(triage ? { triage } : {}),
          ...(typeof finalPrice === 'number' ? { hargaFinal: finalPrice } : {}),
        };
      }
      return ord;
    });
    this.setCachedOrders(updated);

    // Sync to Firebase
    try {
      if (database) {
        const orderRef = ref(database, `orders/${orderId}`);
        await update(orderRef, {
          status,
          ...(triage ? { triage } : {}),
          ...(typeof finalPrice === 'number' ? { hargaFinal: finalPrice } : {}),
        });
      }
    } catch (e) {}

    await this.sendDiscordNotice(
      `🔄 [STATUS UPDATE] Order ${orderId} diubah status menjadi: *${status}* ${triage ? `(Triage: ${triage})` : ''}`
    );

    return updated;
  }

  // --- B2B REQUESTS ---
  public static getCachedB2BRequests(): B2BRequest[] {
    if (!this.isBrowser()) return INITIAL_B2B_REQUESTS;
    try {
      const data = localStorage.getItem(B2B_KEY);
      if (!data) {
        localStorage.setItem(B2B_KEY, JSON.stringify(INITIAL_B2B_REQUESTS));
        return INITIAL_B2B_REQUESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_B2B_REQUESTS;
    }
  }

  public static setCachedB2BRequests(reqs: B2BRequest[]): void {
    if (this.isBrowser()) {
      localStorage.setItem(B2B_KEY, JSON.stringify(reqs));
    }
  }

  public static async createB2BRequest(req: B2BRequest): Promise<B2BRequest[]> {
    const current = this.getCachedB2BRequests();
    const updated = [req, ...current];
    this.setCachedB2BRequests(updated);

    try {
      if (database) {
        const b2bRef = ref(database, `b2b_requests/${req.id}`);
        await set(b2bRef, req);
      }
    } catch (e) {}

    await this.sendDiscordNotice(
      `🏭 [B2B ORDER] ReqID: ${req.reqId} | Tipe: ${req.tipe} | Volume: ${req.volume} | Total: Rp ${(req.price || 0).toLocaleString('id-ID')}`
    );

    return updated;
  }

  public static resetToDefaults(): void {
    if (this.isBrowser()) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      localStorage.setItem(B2B_KEY, JSON.stringify(INITIAL_B2B_REQUESTS));
    }
  }
}
