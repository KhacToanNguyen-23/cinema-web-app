/**
 * Dinh nghia cac vai tro (Role) trong he thong
 */
export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
  CUSTOMER: 'CUSTOMER',
};

/**
 * Nhan hien thi tieng Viet cua tung vai tro
 */
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Super Admin',
  [ROLES.MANAGER]: 'Cinema Manager',
  [ROLES.STAFF]: 'Staff Member',
  [ROLES.CUSTOMER]: 'Khách hàng',
};
