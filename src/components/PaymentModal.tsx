/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PaymentType } from '../types';
import { BANK_DETAILS } from '../constants';
import { X, CheckCircle2, Banknote, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (paymentType: PaymentType) => void;
}

export function PaymentModal({ total, onClose, onConfirm }: PaymentModalProps) {
  const [step, setStep] = useState<'SELECT' | 'TRANSFER_CONFIRM'>('SELECT');

  const handleSelectCash = () => {
    onConfirm('CASH');
  };

  const handleSelectTransfer = () => {
    setStep('TRANSFER_CONFIRM');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden flex flex-col items-center p-10 text-center shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {step === 'SELECT' ? (
            <motion.div 
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full space-y-10"
            >
              <div>
                <h3 className="text-2xl font-black mb-1">Thanh Toán</h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Chọn phương thức cho đơn</p>
                <div className="text-3xl font-black mt-4 text-gray-900 py-4 font-mono tracking-tighter">
                  {total.toLocaleString('vi-VN')}đ
                </div>
              </div>

              <div className="grid gap-4">
                <button 
                  onClick={handleSelectCash}
                  className="flex items-center justify-center gap-4 bg-green-50 text-green-700 font-black p-6 rounded-3xl border-2 border-green-100/50 hover:bg-green-100 transition-all active:scale-95 shadow-sm"
                >
                  <Banknote size={28} />
                  <div className="text-left">
                    <div className="leading-none text-lg">TIỀN MẶT</div>
                    <div className="text-[9px] font-bold uppercase mt-1 opacity-50 tracking-widest italic">CASH PAYMENT</div>
                  </div>
                </button>

                <button 
                  onClick={handleSelectTransfer}
                  className="flex items-center justify-center gap-4 bg-blue-50 text-blue-700 font-black p-6 rounded-3xl border-2 border-blue-100/50 hover:bg-blue-100 transition-all active:scale-95 shadow-sm"
                >
                  <CreditCard size={28} />
                  <div className="text-left">
                    <div className="leading-none text-lg">CHUYỂN KHOẢN</div>
                    <div className="text-[9px] font-bold uppercase mt-1 opacity-50 tracking-widest italic">TRANSFER PAYMENT</div>
                  </div>
                </button>
              </div>

              <button 
                onClick={onClose}
                className="text-gray-300 font-black uppercase text-[10px] tracking-[0.2em] border-b-2 border-transparent hover:border-gray-200 transition-all pt-2"
              >
                HỦY GIAO DỊCH
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="transfer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-10"
            >
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shadow-inner border border-blue-100">
                  <CreditCard size={36} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black">Thông Tin Chuyển</h3>
                <div className="mt-6 p-6 bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-2">Số tài khoản / Ngân hàng</span>
                  <span className="text-xl font-black font-mono text-blue-700 break-all">{BANK_DETAILS}</span>
                </div>
              </div>

              <button 
                onClick={() => onConfirm('TRANSFER')}
                className="w-full bg-black text-white font-black uppercase text-xs tracking-[0.1em] py-6 rounded-[24px] shadow-xl shadow-gray-200 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <CheckCircle2 size={20} />
                Xác Nhận Đã Nhận Tiền
              </button>

              <button 
                onClick={() => setStep('SELECT')}
                className="text-gray-400 font-bold uppercase text-[10px] tracking-widest pt-2"
              >
                Quay lại
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
