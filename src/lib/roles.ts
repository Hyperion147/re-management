export type Role = 'USER' | 'ADMIN' | 'SUPERADMIN';

export function normalizeRole(rawRole?: string | null): Role | null {
  const role = typeof rawRole === 'string' ? rawRole.trim().toUpperCase() : '';
  return role === 'USER' || role === 'ADMIN' || role === 'SUPERADMIN' ? (role as Role) : null;
}

export function isAdminRole(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === 'ADMIN' || normalized === 'SUPERADMIN';
}

export function isSuperAdminRole(role?: string | null): boolean {
  return normalizeRole(role) === 'SUPERADMIN';
}
