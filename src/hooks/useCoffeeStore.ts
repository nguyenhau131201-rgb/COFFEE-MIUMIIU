/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ref, onValue, set, update, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { Table, Transaction, OrderItem, PaymentType, MenuItem, InventoryItem, InventoryStatus } from '../types';
import { INITIAL_TABLES, MENU_ITEMS } from '../constants';
import { getVietnamDateString } from '../utils/dateUtils';

const TABLES_PATH = 'tables';
const TRANSACTIONS_PATH = 'transactions';
const INVENTORY_PATH = 'inventory';

export function useCoffeeStore() {
  const [tables, setTables] = useState<Table[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Listen for tables updates
    const tablesRef = ref(database, TABLES_PATH);
    const unsubscribeTables = onValue(tablesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Data in RTDB might be an object if keyed by ID, 
        // but here we expect an array or converted list
        const parsedTables: Table[] = Array.isArray(data) ? data : Object.values(data);
        
        // Sync labels and zones from INITIAL_TABLES just in case constants changed
        const syncedTables = INITIAL_TABLES.map(initialTable => {
          const existing = parsedTables.find(t => t.id === initialTable.id);
          if (existing) {
            return {
              ...existing,
              label: initialTable.label,
              zone: initialTable.zone,
              currentOrder: existing.currentOrder || []
            };
          }
          return initialTable;
        });
        setTables(syncedTables);
      } else {
        // Initialize if empty
        set(tablesRef, INITIAL_TABLES);
      }
    });

    // Listen for transactions updates
    const transactionsRef = ref(database, TRANSACTIONS_PATH);
    const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedTransactions: Transaction[] = Array.isArray(data) ? data : Object.values(data);
        setTransactions(parsedTransactions);
      } else {
        setTransactions([]);
      }
    });

    // Listen for inventory updates
    const inventoryRef = ref(database, INVENTORY_PATH);
    const unsubscribeInventory = onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsedInventory: InventoryItem[] = Array.isArray(data) ? data : Object.values(data);
        // Sync with MENU_ITEMS to add new items
        const syncedInventory = MENU_ITEMS.map(item => {
          const existing = parsedInventory.find(i => i.menuItemId === item.id);
          if (existing) return { ...existing, quantity: existing.quantity ?? (existing.isCountable ? 0 : null) } as InventoryItem;
          
          const isCountable = (item.category.includes('SOFT DRINKS') || item.category.includes('SNACK') || item.category.includes('CIGARETTES'));
          const newItem: InventoryItem = {
            menuItemId: item.id,
            status: 'IN_STOCK' as InventoryStatus,
            isCountable: isCountable
          };
          
          if (isCountable) {
            newItem.quantity = 10;
          }
          
          return newItem;
        });
        setInventory(syncedInventory);
      } else {
        // Initialize inventory from MENU_ITEMS
        const initialInventory: InventoryItem[] = MENU_ITEMS.map(item => {
          const isCountable = (item.category.includes('SOFT DRINKS') || item.category.includes('SNACK') || item.category.includes('CIGARETTES'));
          const newItem: InventoryItem = {
            menuItemId: item.id,
            status: 'IN_STOCK',
            isCountable: isCountable
          };
          
          if (isCountable) {
            newItem.quantity = 10;
          }
          
          return newItem;
        });
        set(inventoryRef, initialInventory);
      }
    });

    setIsLoaded(true);

    return () => {
      unsubscribeTables();
      unsubscribeTransactions();
      unsubscribeInventory();
    };
  }, []);

  const updateTableOrder = async (tableId: string, item: { id?: string; menuItemId?: string; nameVi: string; price: number }, quantityChange: number) => {
    const id = item.menuItemId || item.id;
    if (!id) return;

    // Check inventory if it's countable
    const invItem = inventory.find(i => i.menuItemId === id);
    if (invItem && invItem.status === 'OUT_OF_STOCK') return;
    if (invItem && invItem.isCountable && invItem.quantity !== undefined) {
      if (quantityChange > 0 && invItem.quantity <= 0) return;
    }

    const updatedTables = tables.map((table) => {
      if (table.id !== tableId) return table;

      const currentOrder = table.currentOrder || [];
      const existingItemIndex = currentOrder.findIndex(
        (oi) => oi.menuItemId === id
      );

      let newOrder = [...currentOrder];

      if (existingItemIndex > -1) {
        const newQuantity = newOrder[existingItemIndex].quantity + quantityChange;
        if (newQuantity <= 0) {
          newOrder.splice(existingItemIndex, 1);
        } else {
          newOrder[existingItemIndex] = {
            ...newOrder[existingItemIndex],
            quantity: newQuantity,
          };
        }
      } else if (quantityChange > 0) {
        newOrder.push({
          id: crypto.randomUUID(),
          menuItemId: id,
          nameVi: item.nameVi,
          price: item.price,
          quantity: quantityChange,
        });
      }

      return {
        ...table,
        currentOrder: newOrder,
        status: newOrder.length > 0 ? 'OCCUPIED' : 'VACANT',
        isPaid: false,
      };
    });

    await set(ref(database, TABLES_PATH), updatedTables);
  };

  const clearTable = async (tableId: string) => {
    const updatedTables = tables.map((table) =>
      table.id === tableId
        ? { ...table, currentOrder: [], status: 'VACANT', isPaid: false }
        : table
    );
    await set(ref(database, TABLES_PATH), updatedTables);
  };

  const payButStay = async (tableId: string, paymentType: PaymentType) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.currentOrder || table.currentOrder.length === 0) return;

    const total = table.currentOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      tableId: table.id,
      items: table.currentOrder,
      total,
      paymentType,
      timestamp: Date.now(),
    };

    // Update transactions
    await set(ref(database, `${TRANSACTIONS_PATH}/${newTransaction.id}`), newTransaction);
    
    // Decrease inventory for countable items
    const updatedInventory = inventory.map(invItem => {
      const orderItem = table.currentOrder.find(oi => oi.menuItemId === invItem.menuItemId);
      if (orderItem && invItem.isCountable && invItem.quantity !== undefined) {
        const newQty = Math.max(0, invItem.quantity - orderItem.quantity);
        return {
          ...invItem,
          quantity: newQty,
          status: newQty === 0 ? 'OUT_OF_STOCK' : invItem.status
        };
      }
      return invItem;
    });
    await set(ref(database, INVENTORY_PATH), updatedInventory);

    // Update table status
    const updatedTables = tables.map((t) =>
      t.id === tableId ? { ...t, isPaid: true } : t
    );
    await set(ref(database, TABLES_PATH), updatedTables);
  };

  const checkout = async (tableId: string, paymentType: PaymentType) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table || !table.currentOrder || table.currentOrder.length === 0) return;

    const total = table.currentOrder.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      tableId: table.id,
      items: table.currentOrder,
      total,
      paymentType,
      timestamp: Date.now(),
    };

    // Update transactions
    await set(ref(database, `${TRANSACTIONS_PATH}/${newTransaction.id}`), newTransaction);

    // Decrease inventory for countable items if not already paid
    if (!table.isPaid) {
      const updatedInventory = inventory.map(invItem => {
        const orderItem = table.currentOrder.find(oi => oi.menuItemId === invItem.menuItemId);
        if (orderItem && invItem.isCountable && invItem.quantity !== undefined) {
          const newQty = Math.max(0, invItem.quantity - orderItem.quantity);
          return {
            ...invItem,
            quantity: newQty,
            status: newQty === 0 ? 'OUT_OF_STOCK' : invItem.status
          };
        }
        return invItem;
      });
      await set(ref(database, INVENTORY_PATH), updatedInventory);
    }

    // Clear table in Firebase
    const updatedTables = tables.map((t) =>
      t.id === tableId
        ? { ...t, currentOrder: [], status: 'VACANT', isPaid: false }
        : t
    );
    await set(ref(database, TABLES_PATH), updatedTables);
  };

  const updateInventoryItem = async (menuItemId: string, updates: Partial<InventoryItem>) => {
    const updatedInventory = inventory.map(item => 
      item.menuItemId === menuItemId ? { ...item, ...updates } : item
    );
    await set(ref(database, INVENTORY_PATH), updatedInventory);
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    await set(ref(database, `${TRANSACTIONS_PATH}/${updatedTransaction.id}`), updatedTransaction);
  };

  const deleteTransaction = async (transactionId: string) => {
    await set(ref(database, `${TRANSACTIONS_PATH}/${transactionId}`), null);
  };

  const deleteTransactionsByDate = async (dateStr: string) => {
    const remainingTransactions = transactions.filter(t => getVietnamDateString(new Date(t.timestamp)) !== dateStr);
    
    // Since Firebase update or set expects an object for multiple keys
    const updates: Record<string, Transaction | null> = {};
    transactions.forEach(t => {
        if (getVietnamDateString(new Date(t.timestamp)) === dateStr) {
            updates[t.id] = null;
        }
    });

    if (Object.keys(updates).length > 0) {
      await update(ref(database, TRANSACTIONS_PATH), updates);
    }
  };

  return {
    tables,
    transactions,
    isLoaded,
    inventory,
    updateTableOrder,
    clearTable,
    payButStay,
    checkout,
    updateInventoryItem,
    updateTransaction,
    deleteTransaction,
    deleteTransactionsByDate,
  };
}

