/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCoffeeStore } from '../hooks/useCoffeeStore';
import { MENU_ITEMS } from '../constants';
import { InventoryItem, InventoryStatus } from '../types';
import { Search, Package, PackageCheck, PackageX, ChevronDown, Plus, Minus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InventoryView() {
  const { inventory, updateInventoryItem } = useCoffeeStore();
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'OUT_OF_STOCK' | 'LOW_STOCK'>('ALL');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd');
  };

  const getIsOutOfStock = (itemId: string) => {
    const inv = inventory.find(i => i.menuItemId === itemId);
    if (!inv) return false;
    return inv.status === 'OUT_OF_STOCK' || (inv.isCountable && (inv.quantity === undefined || inv.quantity <= 0));
  };

  const getIsLowStock = (itemId: string) => {
    const inv = inventory.find(i => i.menuItemId === itemId);
    if (!inv || !inv.isCountable || inv.quantity === undefined) return false;
    return inv.quantity > 0 && inv.quantity <= 5;
  };

  const filteredItems = MENU_ITEMS.filter(item => {
    const term = normalizeString(search);
    const matchesSearch = normalizeString(item.nameVi).includes(term) ||
      normalizeString(item.category).includes(term);
    
    if (filterMode === 'OUT_OF_STOCK') {
      return matchesSearch && getIsOutOfStock(item.id);
    }

    if (filterMode === 'LOW_STOCK') {
      return matchesSearch && getIsLowStock(item.id);
    }
    
    return matchesSearch;
  });

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof MENU_ITEMS>);

  const categories = Object.keys(groupedItems);

  // Statistics
  const totalTypes = MENU_ITEMS.length;
  const outOfStockCount = inventory.filter(i => 
    i.status === 'OUT_OF_STOCK' || (i.isCountable && (i.quantity === undefined || i.quantity <= 0))
  ).length;
  const lowStockCount = inventory.filter(i => 
    i.isCountable && i.quantity !== undefined && i.quantity > 0 && i.quantity <= 5
  ).length;

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] overflow-y-auto pb-24">
      {/* Header Stats */}
      <div className="px-6 pt-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <StatCard 
            label="Tổng loại" 
            value={totalTypes} 
            icon={<Package size={16} />} 
            color={filterMode === 'ALL' ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" : "bg-white text-blue-600 border-blue-100"}
            onClick={() => setFilterMode('ALL')}
            isActive={filterMode === 'ALL'}
          />
          <StatCard 
            label="Sắp hết" 
            value={lowStockCount} 
            icon={<AlertCircle size={16} />} 
            color={filterMode === 'LOW_STOCK' ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-100" : "bg-white text-amber-600 border-amber-100"}
            onClick={() => setFilterMode('LOW_STOCK')}
            isActive={filterMode === 'LOW_STOCK'}
          />
          <StatCard 
            label="Hết hàng" 
            value={outOfStockCount} 
            icon={<PackageX size={16} />} 
            color={filterMode === 'OUT_OF_STOCK' ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100" : "bg-white text-rose-600 border-rose-100"}
            onClick={() => setFilterMode('OUT_OF_STOCK')}
            isActive={filterMode === 'OUT_OF_STOCK'}
          />
        </div>
      </div>

      {/* Search */}
      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm món để quản lý kho..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-[22px] py-4 pl-12 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5 transition-all text-gray-900 shadow-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-3">
        {(filterMode === 'OUT_OF_STOCK' || filterMode === 'LOW_STOCK') ? (
          <div className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-sm p-6 divide-y divide-gray-50">
            <div className="pb-4 mb-2">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                {filterMode === 'OUT_OF_STOCK' ? <PackageX size={16} className="text-red-500" /> : <AlertCircle size={16} className="text-amber-500" />}
                {filterMode === 'OUT_OF_STOCK' ? 'Danh sách đang hết hàng' : 'Danh sách sắp hết hàng'}
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Bổ sung số lượng để cập nhật kho hàng
              </p>
            </div>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <InventoryItemRow 
                  key={item.id} 
                  item={item} 
                  invItem={inventory.find(i => i.menuItemId === item.id)}
                  onUpdate={(updates) => updateInventoryItem(item.id, updates)}
                />
              ))
            ) : (
              <div className="py-12 text-center flex flex-col items-center gap-3">
                <PackageCheck size={32} className="text-green-500 opacity-20" />
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                  {filterMode === 'OUT_OF_STOCK' ? 'Tuyệt vời! Không có món nào hết hàng' : 'Hiện chưa có món nào sắp hết'}
                </p>
              </div>
            )}
          </div>
        ) : (
          categories.map((category) => {
            const isExpanded = search.length > 0 || expandedCategories[category];
            const items = groupedItems[category];

            return (
              <div key={category} className="bg-white border border-gray-100 rounded-[28px] overflow-hidden shadow-sm transition-all group">
                <button
                  onClick={() => search.length === 0 && toggleCategory(category)}
                  className={`w-full flex items-center justify-between px-6 py-5 transition-all ${
                    isExpanded ? 'bg-gray-50/80' : 'bg-white hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                      category.includes('COFFEE') ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      category.includes('JUICES') ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      category.includes('SODA') ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      category.includes('SMOOTHIES') ? 'bg-green-50 text-green-700 border-green-100' :
                      'bg-purple-50 text-purple-700 border-purple-100'
                    }`}>
                       <Package size={18} />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">
                        {category.split(' / ')[1] || 'Category'}
                      </div>
                      <div className="text-[15px] font-black text-gray-900 uppercase tracking-widest">
                        {category.split(' / ')[0]}
                      </div>
                    </div>
                  </div>
                  {search.length === 0 && (
                    <motion.div 
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-gray-400"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  )}
                  {search.length > 0 && (
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
                      <div className="px-6 pb-6 divide-y divide-gray-50 border-t border-gray-50">
                        {items.map((item) => {
                          const invItem = inventory.find(i => i.menuItemId === item.id);
                          return (
                            <InventoryItemRow 
                              key={item.id} 
                              item={item} 
                              invItem={invItem}
                              onUpdate={(updates) => updateInventoryItem(item.id, updates)}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  icon, 
  color, 
  onClick, 
  isActive 
}: { 
  label: string, 
  value: number, 
  icon: React.ReactNode, 
  color: string,
  onClick?: () => void,
  isActive?: boolean
}) {
  return (
    <motion.button 
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center p-4 rounded-3xl border transition-all ${color} ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`mb-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}>{icon}</div>
      <div className="text-xl font-black">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest opacity-60 text-center leading-tight">{label}</div>
      {isActive && (
        <motion.div 
          layoutId="active-dot"
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
        />
      )}
    </motion.button>
  );
}

interface InventoryItemRowProps {
  key?: string | number;
  item: typeof MENU_ITEMS[0];
  invItem?: InventoryItem;
  onUpdate: (updates: Partial<InventoryItem>) => void;
}

function InventoryItemRow({ item, invItem, onUpdate }: InventoryItemRowProps) {
  if (!invItem) return null;

  const isActuallyOutOfStock = invItem.status === 'OUT_OF_STOCK' || (invItem.isCountable && (invItem.quantity === undefined || invItem.quantity <= 0));

  return (
    <div className="py-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-4">
          <div className="font-black text-gray-900 truncate">{item.nameVi}</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{item.nameEn}</div>
        </div>
        
        {/* Toggle Status for non-countable or all */}
          <button
            onClick={() => onUpdate({ status: invItem.status === 'IN_STOCK' ? 'OUT_OF_STOCK' : 'IN_STOCK' })}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
              !isActuallyOutOfStock 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 shadow-sm shadow-emerald-50' 
              : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100 shadow-sm shadow-rose-50'
            }`}
          >
          {!isActuallyOutOfStock ? (
            <> <PackageCheck size={14} /> CÒN HÀNG </>
          ) : (
            <> <PackageX size={14} /> HẾT HÀNG </>
          )}
        </button>
      </div>

      {/* Quantity Manager for Countable items */}
      {invItem.isCountable && (
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-[20px] border border-gray-100 gap-4">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">SỐ LƯỢNG:</span>
            <div className="h-5 flex items-center">
              {invItem.quantity !== undefined && invItem.quantity > 0 && invItem.quantity <= 5 && (
                <span className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase border border-amber-100 whitespace-nowrap">
                  <AlertCircle size={10} /> Sắp hết
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate({ quantity: Math.max(0, (invItem.quantity || 0) - 1) })}
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 shadow-sm active:text-red-500 shrink-0"
            >
              <Minus size={18} strokeWidth={3} />
            </motion.button>
            
            <div className="w-16 h-10 shrink-0">
              <input 
                type="number"
                value={invItem.quantity ?? 0}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  onUpdate({ quantity: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                className="w-full h-full text-center text-lg font-black text-gray-900 bg-white border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
              />
            </div>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdate({ quantity: (invItem.quantity || 0) + 1 })}
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-900 shadow-sm active:text-green-500 shrink-0"
            >
              <Plus size={18} strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
