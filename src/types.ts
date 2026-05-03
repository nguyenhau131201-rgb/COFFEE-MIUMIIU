/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MenuItem {
  id: string;
  nameVi: string;
  nameEn: string;
  price: number;
  category: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  nameVi: string;
  price: number;
  quantity: number;
}

export type PaymentType = 'CASH' | 'TRANSFER';

export interface Transaction {
  id: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  paymentType: PaymentType;
  timestamp: number;
}

export interface Table {
  id: string;
  zone: 'OUTDOOR_A' | 'OUTDOOR_B' | 'INDOOR' | 'TAKEAWAY';
  label: string;
  currentOrder: OrderItem[];
  status: 'VACANT' | 'OCCUPIED';
  isPaid?: boolean;
}

export type InventoryStatus = 'IN_STOCK' | 'OUT_OF_STOCK';

export interface InventoryItem {
  menuItemId: string;
  status: InventoryStatus;
  quantity?: number; // Chỉ dùng cho nước đóng chai/ăn vặt
  isCountable: boolean; // true nếu là nước ngọt/nước suối/ăn vặt
}

export interface DailyReport {
  totalRevenue: number;
  totalCash: number;
  totalTransfer: number;
  transactions: Transaction[];
}
