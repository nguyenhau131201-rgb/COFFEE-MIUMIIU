/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, useState, useEffect } from 'react';
import { Home, BarChart2, Clock, Box } from 'lucide-react';
import { motion } from 'motion/react';
import { getVietnamTimeString, formatVietnamDate } from '../utils/dateUtils';

interface LayoutProps {
  children: ReactNode;
  currentView: 'DASHBOARD' | 'ORDER' | 'REPORT' | 'INVENTORY';
  onNavigateDashboard: () => void;
  onNavigateReport: () => void;
  onNavigateInventory: () => void;
}

export function Layout({ children, currentView, onNavigateDashboard, onNavigateReport, onNavigateInventory }: LayoutProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F5] font-sans selection:bg-gray-200 overflow-hidden">
      <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">Miu Miu Coffee</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock size={10} className="text-gray-400" />
              <div className="text-[9px] uppercase tracking-widest font-black text-gray-400">
                {formatVietnamDate(now.getTime())} • {getVietnamTimeString(now)}
              </div>
            </div>
          </div>
          <div className="px-3 py-1 bg-gray-50 rounded-lg text-[8px] uppercase tracking-widest font-black text-gray-400 border border-gray-100">
            VN (GMT+7)
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 touch-pan-y">
        <div className="max-w-lg mx-auto p-4">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      <nav className="bg-white border-t border-gray-100 px-6 py-3 fixed bottom-0 left-0 right-0 z-20 pb-safe">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          <button 
            onClick={onNavigateDashboard}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'DASHBOARD' ? 'text-black' : 'text-gray-400'}`}
          >
            <Home size={22} strokeWidth={currentView === 'DASHBOARD' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Sơ đồ bàn</span>
          </button>

          <button 
            onClick={onNavigateInventory}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'INVENTORY' ? 'text-black' : 'text-gray-400'}`}
          >
            <Box size={22} strokeWidth={currentView === 'INVENTORY' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Kho hàng</span>
          </button>
          
          <button 
            onClick={onNavigateReport}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'REPORT' ? 'text-black' : 'text-gray-400'}`}
          >
            <BarChart2 size={22} strokeWidth={currentView === 'REPORT' ? 2.5 : 2} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Báo cáo</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
