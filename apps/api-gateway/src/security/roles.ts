export const ROLES = {
  ADMIN: 'ADMIN',
  COMPANY_OPERATOR: 'COMPANY_OPERATOR',
  DRIVER_INDEPENDENT: 'DRIVER_INDEPENDENT',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export function isRole(value: string): value is Role {
  return Object.values(ROLES).includes(value as Role);
}
