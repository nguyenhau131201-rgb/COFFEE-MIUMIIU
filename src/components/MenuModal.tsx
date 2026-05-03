/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuItem, InventoryItem } from '../types';
import { X, Search, CheckCircle2, ChevronDown, PackageX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCoffeeStore } from '../hooks/useCoffeeStore';

interface MenuModalProps {
  onClose: () => void;
  onSelect: (item: MenuItem) => void;
}

export function MenuModal({ onClose, onSelect }: MenuModalProps) {
  const { inventory } = useCoffeeStore();
  const [search, setSearch] = useState('');
  const [showOnlyOutOfStock, setShowOnlyOutOfStock] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getInventoryStatus = (itemId: string) => {
    const inv = inventory.find(i => i.menuItemId === itemId);
    if (!inv) return 'IN_STOCK';
    if (inv.status === 'OUT_OF_STOCK') return 'OUT_OF_STOCK';
    if (inv.isCountable && (inv.quantity === undefined || inv.quantity <= 0)) return 'OUT_OF_STOCK';
    return 'IN_STOCK';
  };

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd');
  };

  const filteredItems = MENU_ITEMS.filter(item => {
    const term = normalizeString(search);
    const matchesSearch = normalizeString(item.nameVi).includes(term) ||
      normalizeString(item.nameEn).includes(term) ||
      normalizeString(item.category).includes(term);
    
    if (showOnlyOutOfStock) {
      return matchesSearch && getInventoryStatus(item.id) === 'OUT_OF_STOCK';
    }
    
    return matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categories = Object.keys(groupedItems);
  const isSearching = search.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-md"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
        className="bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-3xl flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh] shadow-2xl overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h3 className="text-xl font-black">Chọn Món</h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowOnlyOutOfStock(!showOnlyOutOfStock)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm active:scale-95 ${
                showOnlyOutOfStock 
                ? 'bg-red-500 text-white border-red-500 shadow-red-200' 
                : 'bg-white text-red-500 border-red-200 hover:bg-red-50'
              }`}
            >
              Đang hết
            </button>
            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 bg-gray-100 rounded-full">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-8 pt-5 pb-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm kiếm món uống, trà, coffee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100 rounded-[22px] py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-32 scroll-smooth scrollbar-hide">
          {showOnlyOutOfStock ? (
            <div className="divide-y divide-gray-50">
              {filteredItems.map((item) => (
                <MenuItemRow 
                  key={item.id} 
                  item={item} 
                  onSelect={onSelect} 
                  isOutOfStock={true}
                />
              ))}
            </div>
          ) : (
            categories.map((category) => {
              const isExpanded = isSearching || expandedCategories[category];
              const items = groupedItems[category];

              return (
                <div key={category} className="mb-3 border border-gray-100 rounded-[24px] overflow-hidden transition-all shadow-sm">
                  <button
                    onClick={() => !isSearching && toggleCategory(category)}
                    disabled={isSearching}
                    className={`w-full flex items-center justify-between px-6 py-5 transition-all ${
                      isExpanded ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/50 active:bg-gray-100'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none">
                        {category.split(' / ')[1] || 'Category'}
                      </div>
                      <div className="text-[15px] font-black text-gray-900 uppercase tracking-widest leading-none">
                        {category.split(' / ')[0]}
                      </div>
                    </div>
                    {!isSearching && (
                      <motion.div 
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className={`text-gray-300 ${isExpanded ? 'text-black' : ''}`}
                      >
                        <ChevronDown size={22} strokeWidth={3} />
                      </motion.div>
                    )}
                    {isSearching && (
                      <span className="text-[10px] font-black text-gray-400 bg-white border border-gray-100 px-2 py-1 rounded-lg">
                        {items.length} món
                      </span>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-6 pb-6 divide-y divide-gray-50 bg-white">
                          {items.map((item) => (
                            <MenuItemRow 
                              key={item.id} 
                              item={item} 
                              onSelect={onSelect} 
                              isOutOfStock={getInventoryStatus(item.id) === 'OUT_OF_STOCK'}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
          
          {categories.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                {showOnlyOutOfStock ? <PackageX size={32} /> : <Search size={32} />}
              </div>
              <p className="text-gray-300 italic font-medium">
                {showOnlyOutOfStock ? 'Hiện không có món nào hết hàng' : 'Không tìm thấy món nào'}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface MenuItemRowProps {
  key?: string | number;
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  isOutOfStock: boolean;
}

function MenuItemRow({ item, onSelect, isOutOfStock }: MenuItemRowProps) {
  const [success, setSuccess] = useState(false);

  const handleClick = () => {
    if (success || isOutOfStock) return; 
    onSelect(item);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1200);
  };

  return (
    <motion.button
      whileTap={isOutOfStock ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={isOutOfStock}
      className={`
        w-full py-5 text-left flex items-center justify-between group transition-all border-b last:border-0 rounded-2xl px-3 -mx-3
        ${success ? 'bg-green-50' : 'hover:bg-gray-50 active:bg-gray-100'}
        ${isOutOfStock ? 'opacity-40 grayscale pointer-events-none' : ''}
      `}
    >
      <div className="flex-1 pr-6">
        <div className="font-black text-gray-900 flex items-center gap-2">
          <span className="group-active:translate-x-1 transition-transform">{item.nameVi}</span>
          <AnimatePresence>
            {success && (
              <motion.span
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
                className="inline-flex items-center gap-1 bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter shadow-md"
              >
                <CheckCircle2 size={12} strokeWidth={3} /> Đã thêm
              </motion.span>
            )}
            {isOutOfStock && (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-red-200">
                <PackageX size={10} strokeWidth={3} /> Tạm hết
              </span>
            )}
          </AnimatePresence>
        </div>
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{item.nameEn}</div>
      </div>
      <motion.div 
        animate={success ? { scale: [1, 1.1, 1], color: ['#111827', '#16a34a', '#111827'] } : {}}
        className="text-sm font-black text-gray-900 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm"
      >
        {item.price.toLocaleString('vi-VN')}đ
      </motion.div>
    </motion.button>
  );
}
