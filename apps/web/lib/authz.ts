import { ApiError } from './server/api-utils';

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  HEAD_TEACHER: 'HEAD_TEACHER',
  DEPUTY_HEAD_TEACHER: 'DEPUTY_HEAD_TEACHER',
  TEACHER: 'TEACHER',
  CLASS_TEACHER: 'CLASS_TEACHER',
  ACCOUNTANT: 'ACCOUNTANT',
  LIBRARIAN: 'LIBRARIAN',
  NURSE: 'NURSE',
  MATRON: 'MATRON',
  SECURITY: 'SECURITY',
  DRIVER: 'DRIVER',
  SUBORDINATE: 'SUBORDINATE',
  PARENT: 'PARENT',
  STUDENT: 'STUDENT',
} as const;

export type RoleType = keyof typeof ROLES;

export const ROLE_GROUPS = {
  ADMIN: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
  LEADERSHIP: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER],
  ACADEMIC_STAFF: [ROLES.TEACHER, ROLES.CLASS_TEACHER, ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER],
  FINANCE: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT],
  HR: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER],
  STAFF: [
    ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER,
    ROLES.TEACHER, ROLES.CLASS_TEACHER, ROLES.ACCOUNTANT, ROLES.LIBRARIAN,
    ROLES.NURSE, ROLES.MATRON, ROLES.SECURITY, ROLES.DRIVER, ROLES.SUBORDINATE
  ],
};

export const ROUTE_ACCESS: Record<string, string[]> = {
  '/dashboard/super-admin': [ROLES.SUPER_ADMIN],
  '/dashboard/students': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER, ROLES.TEACHER, ROLES.CLASS_TEACHER],
  '/dashboard/parents': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER, ROLES.TEACHER, ROLES.CLASS_TEACHER],
  '/dashboard/grade-levels': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER],
  '/dashboard/classes': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER, ROLES.TEACHER, ROLES.CLASS_TEACHER],
  '/dashboard/admissions': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER],
  '/dashboard/attendance': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER, ROLES.TEACHER, ROLES.CLASS_TEACHER],
  '/dashboard/exams': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER, ROLES.TEACHER, ROLES.CLASS_TEACHER],
  '/dashboard/finance': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.ACCOUNTANT, ROLES.PARENT],
  '/dashboard/lms': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER, ROLES.TEACHER, ROLES.CLASS_TEACHER, ROLES.STUDENT],
  '/dashboard/staff': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER],
  '/dashboard/staff/payroll': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.ACCOUNTANT],
  '/dashboard/staff/leaves': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER, ROLES.TEACHER, ROLES.CLASS_TEACHER, ROLES.LIBRARIAN, ROLES.NURSE, ROLES.MATRON, ROLES.SECURITY, ROLES.DRIVER, ROLES.SUBORDINATE, ROLES.ACCOUNTANT],
  '/dashboard/transport': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DRIVER],
  '/dashboard/hostels': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.MATRON],
  '/dashboard/library': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.LIBRARIAN],
  '/dashboard/health': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.NURSE],
  '/dashboard/security': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.SECURITY],
  '/dashboard/messaging': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER, ROLES.TEACHER, ROLES.CLASS_TEACHER],
  '/dashboard/settings': [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER],
};

export function canAccessRoute(userRole: string, pathname: string): boolean {
  // exact match check first
  const allowedExact = ROUTE_ACCESS[pathname];
  if (allowedExact) return allowedExact.includes(userRole);

  // prefix match check (e.g. /dashboard/finance/invoices matches /dashboard/finance)
  for (const [route, allowed] of Object.entries(ROUTE_ACCESS)) {
    if (pathname.startsWith(route) && !allowed.includes(userRole)) {
      return false;
    }
  }

  return true; // base /dashboard or undefined routes
}

export function hasRole(userRole: string | undefined | null, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function enforceRole(session: any, allowedRoles: string[]) {
  if (!session || !session.role) {
    throw new ApiError('Unauthorized', 401);
  }
  if (!allowedRoles.includes(session.role)) {
    throw new ApiError('Forbidden: Insufficient permissions', 403);
  }
}

export function enforceTenant(session: any): string | undefined {
  if (!session) {
    throw new ApiError('Unauthorized', 401);
  }
  
  // For non-super-admins, a school_id is strictly required.
  if (session.role !== ROLES.SUPER_ADMIN && !session.schoolId) {
    throw new ApiError('Forbidden: Tenant isolation violation', 403);
  }

  // Returning undefined for SUPER_ADMIN allows Prisma to ignore the filter
  // while still allowing the variable to be used in 'where' clauses.
  return session.schoolId || undefined;
}

export function getSafeTenantId(session: any, requestedSchoolId?: string | null): string | null {
  if (session.role === ROLES.SUPER_ADMIN) {
    return requestedSchoolId || null;
  }
  return session.schoolId || null;
}
