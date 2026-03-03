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
  ACADEMIC_STAFF: [ROLES.TEACHER, ROLES.CLASS_TEACHER, ...[ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER]],
  FINANCE: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT],
  HR: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER],
  STAFF: [
    ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.HEAD_TEACHER, ROLES.DEPUTY_HEAD_TEACHER,
    ROLES.TEACHER, ROLES.CLASS_TEACHER, ROLES.ACCOUNTANT, ROLES.LIBRARIAN,
    ROLES.NURSE, ROLES.MATRON, ROLES.SECURITY, ROLES.DRIVER, ROLES.SUBORDINATE
  ],
};

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

export function enforceTenant(session: any) {
  if (!session) {
    throw new ApiError('Unauthorized', 401);
  }
  // SUPER_ADMIN might be able to operate without a specific schoolId, or they can pass it.
  // For other roles, a school_id is strictly required.
  if (session.role !== ROLES.SUPER_ADMIN && !session.schoolId) {
    throw new ApiError('Forbidden: Tenant isolation violation', 403);
  }
  return session.schoolId;
}

export function getSafeTenantId(session: any, requestedSchoolId?: string | null): string | null {
  if (session.role === ROLES.SUPER_ADMIN) {
    return requestedSchoolId || null;
  }
  return session.schoolId || null;
}
