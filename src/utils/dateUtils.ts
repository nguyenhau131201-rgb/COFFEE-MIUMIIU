/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const getVietnamDateString = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

export const getVietnamTimeString = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
};

export const formatVietnamTime = (timestamp: number) => {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
};

export const formatVietnamDate = (timestamp: number) => {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(timestamp));
};

export const getSessionName = (timestamp: number) => {
  const hourStr = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: 'numeric',
    hour12: false
  }).format(new Date(timestamp));
  const hour = parseInt(hourStr, 10);
  // Session border: 12:00
  // Morning: 00:00 - 11:59
  // Evening: 12:00 - 23:59
  return hour < 12 ? 'Sáng' : 'Tối';
};
