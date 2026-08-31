/**
 * Format so tien thanh chuoi tien te VND chuan (vi du: 75.000 d)
 * @param {number|string} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '0 đ';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

/**
 * Format chuoi ngay thang thanh dinh dang DD/MM/YYYY
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Format gio tu chuoi datetime (vi du: 19:30)
 * @param {string|Date} date
 * @returns {string}
 */
export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

/**
 * Format thoi luong phut thanh chuoi (vi du: 115 phut)
 * @param {number|string} minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '0 phút';
  return `${minutes} phút`;
};
