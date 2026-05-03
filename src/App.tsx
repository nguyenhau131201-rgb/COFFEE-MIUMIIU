/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useCoffeeStore } from './hooks/useCoffeeStore';
import { Dashboard } from './components/Dashboard';
import { OrderView } from './components/OrderView';
import { ReportView } from './components/ReportView';
import { InventoryView } from './components/InventoryView';
import { Layout } from './components/Layout';

type ViewState = 
  | { type: 'DASHBOARD' }
  | { type: 'ORDER'; tableId: string }
  | { type: 'REPORT' }
  | { type: 'INVENTORY' };

export default function App() {
  const store = useCoffeeStore();
  const [view, setView] = useState<ViewState>({ type: 'DASHBOARD' });

  if (!store.isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-400 font-black uppercase text-[10px] tracking-widest">Miu Miu Coffee đang tải...</div>
        </div>
      </div>
    );
  }

  const navigateToDashboard = () => setView({ type: 'DASHBOARD' });
  const navigateToOrder = (tableId: string) => setView({ type: 'ORDER', tableId });
  const navigateToReport = () => setView({ type: 'REPORT' });
  const navigateToInventory = () => setView({ type: 'INVENTORY' });

  return (
    <Layout 
      currentView={view.type} 
      onNavigateDashboard={navigateToDashboard} 
      onNavigateReport={navigateToReport}
      onNavigateInventory={navigateToInventory}
    >
      {view.type === 'DASHBOARD' && (
        <Dashboard tables={store.tables} onSelectTable={navigateToOrder} />
      )}
      
      {view.type === 'ORDER' && (
        <OrderView 
          table={store.tables.find(t => t.id === view.tableId)!}
          onBack={navigateToDashboard}
          onAddItem={(item) => store.updateTableOrder(view.tableId, item, 1)}
          onRemoveItem={(item) => store.updateTableOrder(view.tableId, item, -1)}
          onCheckout={(paymentType) => {
            store.checkout(view.tableId, paymentType);
            navigateToDashboard();
          }}
          onPayButStay={(paymentType) => {
            store.payButStay(view.tableId, paymentType);
            navigateToDashboard();
          }}
          onClearTable={(tableId) => {
            store.clearTable(tableId);
            navigateToDashboard();
          }}
          onSave={navigateToDashboard}
        />
      )}

      {view.type === 'REPORT' && (
        <ReportView 
          transactions={store.transactions} 
          onDeleteTransactionsByDate={store.deleteTransactionsByDate}
          onUpdateTransaction={store.updateTransaction}
          onDeleteTransaction={store.deleteTransaction}
        />
      )}

      {view.type === 'INVENTORY' && (
        <InventoryView />
      )}
    </Layout>
  );
}
