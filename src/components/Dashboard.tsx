/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Table } from '../types';
import { motion } from 'motion/react';

interface DashboardProps {
  tables: Table[];
  onSelectTable: (tableId: string) => void;
}

export function Dashboard({ tables, onSelectTable }: DashboardProps) {
  const zones = {
    'OUTDOOR_A': 'Sân Khu A',
    'OUTDOOR_B': 'Sân Khu B',
    'INDOOR': 'Trong nhà',
    'TAKEAWAY': 'Mang về'
  };

  const tablesByZone = (zone: Table['zone']) => tables.filter(t => t.zone === zone);

  return (
    <div className="space-y-8 pb-4">
      {(Object.keys(zones) as Array<Table['zone']>).map((zone) => (
        <section key={zone} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">{zones[zone]}</h2>
            <div className="h-px bg-gray-200 flex-1 ml-4" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {tablesByZone(zone).map((table) => (
              <motion.button
                key={table.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelectTable(table.id)}
                className={`
                  aspect-square rounded-3xl p-4 flex flex-col items-center justify-center gap-1 border-2 transition-all shadow-sm
                  ${table.status === 'OCCUPIED' 
                    ? table.isPaid 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-green-50 border-green-200 text-green-600'}
                `}
              >
                <span className="text-xl font-black">{table.label}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 h-[1.2em] flex items-center justify-center text-center">
                  {table.status === 'OCCUPIED' ? (table.isPaid ? 'Đã thu tiền' : 'Có khách') : 'Bàn trống'}
                </span>
                {table.currentOrder.length > 0 && (
                  <div className="mt-1 px-2 py-0.5 bg-red-600 text-white text-[9px] font-black rounded-full uppercase tracking-tighter">
                    {table.currentOrder.reduce((sum, i) => sum + i.quantity, 0)} món
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
