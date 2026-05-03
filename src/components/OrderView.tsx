/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Table, MenuItem, OrderItem, PaymentType } from '../types';
import { ChevronLeft, Plus, X, Trash2, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuModal } from './MenuModal';
import { PaymentModal } from './PaymentModal';

interface OrderViewProps {
  table: Table;
  onBack: () => void;
  onAddItem: (item: MenuItem) => void;
  onRemoveItem: (item: MenuItem | OrderItem) => void;
  onCheckout: (paymentType: PaymentType) => void;
  onPayButStay?: (paymentType: PaymentType) => void;
  onClearTable?: (tableId: string) => void;
  onSave: () => void;
}

export function OrderView({ table, onBack, onAddItem, onRemoveItem, onCheckout, onPayButStay, onClearTable, onSave }: OrderViewProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentFlow, setPaymentFlow] = useState<'CHECKOUT' | 'PAY_STAY'>('CHECKOUT');

  const total = table.currentOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-black">Bàn {table.label}</h2>
          <div className="flex items-center gap-1">
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              table.status === 'OCCUPIED' 
              ? table.isPaid ? 'text-blue-500' : 'text-red-500' 
              : 'text-green-500'
            }`}>
              {table.status === 'OCCUPIED' ? (table.isPaid ? 'Đã thanh toán (Khách còn ngồi)' : 'Đang có khách') : 'Bàn trống'}
            </span>
            {table.isPaid && <CheckCircle2 size={12} className="text-blue-500" strokeWidth={3} />}
          </div>
        </div>
        <div className="w-10" />
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Danh sách món</h3>
          <button 
            disabled={table.isPaid}
            onClick={() => setIsMenuOpen(true)}
            className={`flex items-center gap-1.5 font-black text-[11px] py-2 px-4 border rounded-full shadow-sm active:scale-95 transition-all ${
              table.isPaid ? 'bg-gray-50 text-gray-300 border-gray-100' : 'bg-white text-black border-gray-200'
            }`}
          >
            <Plus size={14} /> THÊM MÓN
          </button>
        </div>

        <div className="divide-y divide-gray-50 max-h-[45vh] overflow-y-auto overflow-x-hidden">
          {table.currentOrder.length === 0 ? (
            <div className="px-6 py-16 text-center text-gray-300 italic text-sm">
              Chưa có món nào được gọi
            </div>
          ) : (
            table.currentOrder.map((item) => (
              <div key={item.id} className="px-6 py-5 flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <div className="font-bold text-sm text-gray-900 leading-tight">{item.nameVi}</div>
                  <div className="text-[10px] text-gray-400 font-bold mt-0.5 tracking-tight uppercase">
                    {item.price.toLocaleString('vi-VN')}đ x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-black text-gray-900">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                  {!table.isPaid && (
                    <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                      <button 
                        onClick={() => onRemoveItem(item)}
                        className="p-1.5 bg-white text-gray-400 rounded-lg shadow-sm active:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => onAddItem({ id: item.menuItemId, nameVi: item.nameVi, price: item.price, nameEn: '', category: '' })}
                        className="p-1.5 bg-white text-gray-900 rounded-lg shadow-sm active:bg-gray-50 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-6 bg-gray-50 flex items-center justify-between border-t border-gray-100">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Tổng cộng</span>
          <span className="text-2xl font-black text-gray-900">{total.toLocaleString('vi-VN')}đ</span>
        </div>
      </div>

      <div className="space-y-4 pb-8">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={table.isPaid ? () => onClearTable?.(table.id) : onSave}
            className={`font-black uppercase text-xs tracking-widest py-5 rounded-2xl transition-all active:scale-95 border-2 ${
              table.isPaid 
              ? 'bg-red-50 border-red-200 text-red-600' 
              : 'bg-white border-gray-100 text-gray-600'
            }`}
          >
            {table.isPaid ? 'Trả trống bàn' : 'Lưu Trạng Thái'}
          </button>
          <button 
            disabled={table.currentOrder.length === 0 || table.isPaid}
            onClick={() => {
              setPaymentFlow('CHECKOUT');
              setIsPaymentOpen(true);
            }}
            className={`
              bg-black text-white font-black uppercase text-xs tracking-widest py-5 rounded-2xl shadow-lg transition-all active:scale-95
              disabled:opacity-20 disabled:pointer-events-none
            `}
          >
            Thu Tiền
          </button>
        </div>

        {table.status === 'OCCUPIED' && !table.isPaid && (
          <button
            onClick={() => {
              setPaymentFlow('PAY_STAY');
              setIsPaymentOpen(true);
            }}
            className="w-full bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.2em] py-4 rounded-2xl shadow-md active:scale-95 transition-all"
          >
            Thu Tiền Trước (Khách Stay)
          </button>
        )}
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <MenuModal 
            onClose={() => setIsMenuOpen(false)} 
            onSelect={(item) => {
              onAddItem(item);
            }} 
          />
        )}
        {isPaymentOpen && (
          <PaymentModal 
            total={total}
            onClose={() => setIsPaymentOpen(false)}
            onConfirm={(type) => {
              if (paymentFlow === 'CHECKOUT') {
                onCheckout(type);
              } else {
                onPayButStay?.(type);
              }
              setIsPaymentOpen(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
