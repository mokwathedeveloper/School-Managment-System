import { canAccessRoute, ROLES, ROLE_GROUPS } from './apps/web/lib/authz';
import assert from 'assert';

function runTests() {
  console.log('Running Access Control Tests...');
  let failed = 0;

  try {
    // Teacher cannot access HR/Accountant routes
    assert.strictEqual(canAccessRoute(ROLES.TEACHER, '/dashboard/staff'), false, 'Teacher should not access /dashboard/staff');
    assert.strictEqual(canAccessRoute(ROLES.TEACHER, '/dashboard/finance'), false, 'Teacher should not access /dashboard/finance');
    
    // Headteacher can view/edit staff as defined
    assert.strictEqual(canAccessRoute(ROLES.HEAD_TEACHER, '/dashboard/staff'), true, 'Head Teacher should access /dashboard/staff');
    
    // Base dashboard matches for all
    assert.strictEqual(canAccessRoute(ROLES.STUDENT, '/dashboard'), true, 'Student should access base /dashboard');
    assert.strictEqual(canAccessRoute(ROLES.STUDENT, '/dashboard/finance'), false, 'Student should not access /dashboard/finance');

    // Nested routing test (prefix match)
    assert.strictEqual(canAccessRoute(ROLES.HEAD_TEACHER, '/dashboard/staff/leaves'), true, 'Head Teacher should access nested HR routes');
    assert.strictEqual(canAccessRoute(ROLES.TEACHER, '/dashboard/finance/invoices'), false, 'Teacher should not access nested finance routes');

    console.log('✅ All access control logic tests passed!');
  } catch (err: any) {
    console.error('❌ Test failed:', err.message);
    failed++;
  }

  if (failed > 0) process.exit(1);
}

runTests();
