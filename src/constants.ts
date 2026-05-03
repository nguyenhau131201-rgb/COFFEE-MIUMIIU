/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, Table } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // CÀ PHÊ / COFFEE
  { id: 'c1', category: 'CÀ PHÊ / COFFEE', nameVi: 'Cà phê truyền thống', nameEn: 'Traditional Coffee', price: 15000 },
  { id: 'c2', category: 'CÀ PHÊ / COFFEE', nameVi: 'Cà phê sữa truyền thống', nameEn: 'Traditional Milk Coffee', price: 25000 },
  { id: 'c3', category: 'CÀ PHÊ / COFFEE', nameVi: 'Cà phê máy', nameEn: 'Espresso Coffee', price: 20000 },
  { id: 'c4', category: 'CÀ PHÊ / COFFEE', nameVi: 'Cà phê sữa máy', nameEn: 'Espresso Milk Coffee', price: 25000 },
  { id: 'c5', category: 'CÀ PHÊ / COFFEE', nameVi: 'Bạc xỉu', nameEn: 'White Coffee', price: 25000 },
  { id: 'c6', category: 'CÀ PHÊ / COFFEE', nameVi: 'Cà phê sữa tươi', nameEn: 'Fresh Milk Coffee', price: 25000 },
  { id: 'c7', category: 'CÀ PHÊ / COFFEE', nameVi: 'Cà phê muối', nameEn: 'Salt Coffee', price: 30000 },
  { id: 'c8', category: 'CÀ PHÊ / COFFEE', nameVi: 'Cà phê muối matcha', nameEn: 'Salt Matcha Coffee', price: 30000 },

  // MATCHA LATTE
  { id: 'm1', category: 'MATCHA LATTE', nameVi: 'Matcha', nameEn: 'Traditional Matcha', price: 25000 },
  { id: 'm2', category: 'MATCHA LATTE', nameVi: 'Matcha Latte', nameEn: 'Matcha with Milk', price: 25000 },
  { id: 'm3', category: 'MATCHA LATTE', nameVi: 'Latte Dâu', nameEn: 'Strawberry Latte', price: 25000 },
  { id: 'm4', category: 'MATCHA LATTE', nameVi: 'Latte Khoai Môn', nameEn: 'Taro Latte', price: 25000 },
  { id: 'm5', category: 'MATCHA LATTE', nameVi: 'Latte Việt Quất', nameEn: 'Blueberry Latte', price: 25000 },

  // SỮA CHUA / YOGURT DRINKS
  { id: 'y1', category: 'SỮA CHUA / YOGURT DRINKS', nameVi: 'Sữa chua dâu', nameEn: 'Strawberry Yogurt', price: 25000 },
  { id: 'y2', category: 'SỮA CHUA / YOGURT DRINKS', nameVi: 'Sữa chua đá', nameEn: 'Iced Yogurt', price: 25000 },
  { id: 'y3', category: 'SỮA CHUA / YOGURT DRINKS', nameVi: 'Sữa chua dâu tằm', nameEn: 'Mulberry Yogurt', price: 25000 },
  { id: 'y4', category: 'SỮA CHUA / YOGURT DRINKS', nameVi: 'Sữa chua trái cây', nameEn: 'Mixed Fruit Yogurt', price: 30000 },
  { id: 'y5', category: 'SỮA CHUA / YOGURT DRINKS', nameVi: 'Sữa chua việt quất', nameEn: 'Blueberry Yogurt', price: 25000 },
  { id: 'y6', category: 'SỮA CHUA / YOGURT DRINKS', nameVi: 'Sữa chua matcha', nameEn: 'Matcha Yogurt', price: 25000 },

  // SINH TỐ / SMOOTHIES
  { id: 's1', category: 'SINH TỐ / SMOOTHIES', nameVi: 'Sinh tố bơ', nameEn: 'Avocado Smoothie', price: 30000 },
  { id: 's2', category: 'SINH TỐ / SMOOTHIES', nameVi: 'Bơ dằm', nameEn: 'Smashed Avocado', price: 30000 },
  { id: 's3', category: 'SINH TỐ / SMOOTHIES', nameVi: 'Sinh tố xoài', nameEn: 'Mango Smoothie', price: 30000 },
  { id: 's4', category: 'SINH TỐ / SMOOTHIES', nameVi: 'Sinh tố bơ xoài', nameEn: 'Avocado Mango Smoothie', price: 30000 },

  // NƯỚC ÉP / FRESH JUICES
  { id: 'j1', category: 'NƯỚC ÉP / FRESH JUICES', nameVi: 'Nước ép táo', nameEn: 'Apple Juice', price: 25000 },
  { id: 'j2', category: 'NƯỚC ÉP / FRESH JUICES', nameVi: 'Nước ép ổi', nameEn: 'Guava Juice', price: 25000 },
  { id: 'j3', category: 'NƯỚC ÉP / FRESH JUICES', nameVi: 'Nước ép táo mix ổi', nameEn: 'Apple & Guava Juice', price: 25000 },
  { id: 'j4', category: 'NƯỚC ÉP / FRESH JUICES', nameVi: 'Nước cam', nameEn: 'Orange Juice', price: 20000 },
  { id: 'j5', category: 'NƯỚC ÉP / FRESH JUICES', nameVi: 'Nước chanh', nameEn: 'Lemonade', price: 15000 },
  { id: 'j6', category: 'NƯỚC ÉP / FRESH JUICES', nameVi: 'Dừa', nameEn: 'Coconut', price: 25000 },
  { id: 'j7', category: 'NƯỚC ÉP / FRESH JUICES', nameVi: 'Chanh đá', nameEn: 'Iced Lemonade', price: 15000 },

  // SODA
  { id: 'sd1', category: 'SODA', nameVi: 'Soda việt quất', nameEn: 'Blueberry Soda', price: 20000 },
  { id: 'sd2', category: 'SODA', nameVi: 'Soda cam', nameEn: 'Orange Soda', price: 20000 },
  { id: 'sd3', category: 'SODA', nameVi: 'Soda thơm', nameEn: 'Pineapple Soda', price: 20000 },

  // MÓN KHÁC / OTHERS
  { id: 'o1', category: 'MÓN KHÁC / OTHERS', nameVi: 'Trà đào cam sả', nameEn: 'Peach Tea with Orange & Lemongrass', price: 25000 },
  { id: 'o7', category: 'MÓN KHÁC / OTHERS', nameVi: 'Trà đào', nameEn: 'Peach Tea', price: 15000 },
  { id: 'o8', category: 'MÓN KHÁC / OTHERS', nameVi: 'Trà tắc', nameEn: 'Kumquat Tea', price: 15000 },
  { id: 'o2', category: 'MÓN KHÁC / OTHERS', nameVi: 'Đá me', nameEn: 'Tamarind Ice Drink', price: 25000 },
  { id: 'o3', category: 'MÓN KHÁC / OTHERS', nameVi: 'Trà Lipton', nameEn: 'Lipton Tea', price: 20000 },
  { id: 'o4', category: 'MÓN KHÁC / OTHERS', nameVi: 'Trà đường', nameEn: 'Sugar Tea', price: 15000 },
  { id: 'o5', category: 'MÓN KHÁC / OTHERS', nameVi: 'Ca cao', nameEn: 'Cocoa', price: 20000 },
  { id: 'o6', category: 'MÓN KHÁC / OTHERS', nameVi: 'Trà gừng', nameEn: 'Ginger Tea', price: 20000 },

  // NƯỚC NGỌT / SOFT DRINKS
  { id: 'sd_p', category: 'NƯỚC NGỌT / SOFT DRINKS', nameVi: 'Pepsi', nameEn: 'Pepsi', price: 15000 },
  { id: 'sd_c', category: 'NƯỚC NGỌT / SOFT DRINKS', nameVi: 'Coca', nameEn: 'Coca Cola', price: 15000 },
  { id: 'sd_247', category: 'NƯỚT NGỌT / SOFT DRINKS', nameVi: '247', nameEn: '247 Energy Drink', price: 15000 },
  { id: 'sd_7up', category: 'NƯỚC NGỌT / SOFT DRINKS', nameVi: '7UP', nameEn: '7UP', price: 15000 },
  { id: 'sd_st', category: 'NƯỚC NGỌT / SOFT DRINKS', nameVi: 'Sting', nameEn: 'Sting Energy Drink', price: 15000 },
  { id: 'sd_ol', category: 'NƯỚC NGỌT / SOFT DRINKS', nameVi: 'Olong', nameEn: 'Oolong Tea', price: 15000 },
  { id: 'sd_wa', category: 'NƯỚC NGỌT / SOFT DRINKS', nameVi: 'Nước suối', nameEn: 'Bottled Water', price: 10000 },
  { id: 'sd_bh', category: 'NƯỚC NGỌT / SOFT DRINKS', nameVi: 'Bò húc', nameEn: 'Red Bull', price: 20000 },

  // ĐỒ ĂN VẶT / SNACK
  { id: 'sn1', category: 'ĐỒ ĂN VẶT / SNACK', nameVi: 'Hướng dương / túi', nameEn: 'Sunflower Seeds', price: 20000 },
  { id: 'sn2', category: 'ĐỒ ĂN VẶT / SNACK', nameVi: 'Trái cây / đĩa', nameEn: 'Mixed Fruits Plate', price: 50000 },

  // THUỐC LÁ / CIGARETTES
  { id: 'cig1', category: 'THUỐC LÁ / CIGARETTES', nameVi: 'YET VIỆT', nameEn: 'YET VIET Cigarettes', price: 15000 },
  { id: 'cig2', category: 'THUỐC LÁ / CIGARETTES', nameVi: 'YET THÁI', nameEn: 'YET THAI Cigarettes', price: 28000 },
  { id: 'cig3', category: 'THUỐC LÁ / CIGARETTES', nameVi: 'SÀI GÒN BẠC', nameEn: 'Sai Gon Silver', price: 20000 },
];

export const INITIAL_TABLES: Table[] = [
  // Zone A
  { id: 'A1', zone: 'OUTDOOR_A', label: 'A1', currentOrder: [], status: 'VACANT' },
  { id: 'A2', zone: 'OUTDOOR_A', label: 'A2', currentOrder: [], status: 'VACANT' },
  { id: 'A3', zone: 'OUTDOOR_A', label: 'A3', currentOrder: [], status: 'VACANT' },
  // Zone B
  { id: 'B1', zone: 'OUTDOOR_B', label: 'B1', currentOrder: [], status: 'VACANT' },
  { id: 'B2', zone: 'OUTDOOR_B', label: 'B2', currentOrder: [], status: 'VACANT' },
  { id: 'B3', zone: 'OUTDOOR_B', label: 'B3', currentOrder: [], status: 'VACANT' },
  // Indoor
  { id: 'C1', zone: 'INDOOR', label: 'C1', currentOrder: [], status: 'VACANT' },
  { id: 'C2', zone: 'INDOOR', label: 'C2', currentOrder: [], status: 'VACANT' },
  { id: 'C3', zone: 'INDOOR', label: 'C3', currentOrder: [], status: 'VACANT' },
  { id: 'D1', zone: 'INDOOR', label: 'D1', currentOrder: [], status: 'VACANT' },
  { id: 'D2', zone: 'INDOOR', label: 'D2', currentOrder: [], status: 'VACANT' },
  { id: 'D3', zone: 'INDOOR', label: 'D3', currentOrder: [], status: 'VACANT' },
  // Takeaway
  { id: 'E MANG ĐI', zone: 'TAKEAWAY', label: 'E MANG ĐI', currentOrder: [], status: 'VACANT' },
  { id: 'E KHÁC', zone: 'TAKEAWAY', label: 'E KHÁC', currentOrder: [], status: 'VACANT' },
];

export const BANK_DETAILS = 'MB BANK - NGUYEN HONG HAU';
