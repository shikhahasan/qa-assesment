import type { APIRequestContext } from '@playwright/test';

interface Employee {
  empNumber: number;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
}
interface SystemUser {
  id: number;
  userName: string;
  status: boolean;
  userRole: { id: number; name: string };
  employee: Employee;
}
interface LeaveType {
  id: number;
  name: string;
  deleted: boolean;
}
interface LeavePeriod {
  startDate: string;
  endDate: string;
}

/**
 * Thin client over OrangeHRM's REST API (/api/v2). Used ONLY for test-data setup and cleanup,
 * so UI tests don't depend on data other demo users may have changed or deleted.
 */
export class OrangeHrmApi {
  constructor(private readonly request: APIRequestContext) {}

  /** Session login the same way the browser does: CSRF token from the login page, then POST the form. */
  async login(username: string, password: string) {
    const html = await (await this.request.get('auth/login')).text();
    const token = html.match(/:token="&quot;([^&]+)&quot;"/)?.[1];
    if (!token) throw new Error('CSRF token not found on the login page');
    await this.request.post('auth/validate', { form: { _token: token, username, password } });
    await this.call('GET', 'admin/users', { params: { limit: 1 } }); // throws if the session isn't valid
  }

  private async call<T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    opts: { data?: unknown; params?: Record<string, string | number> } = {},
  ): Promise<T> {
    const res = await this.request.fetch(`api/v2/${path}`, { method, ...opts });
    if (!res.ok()) throw new Error(`${method} api/v2/${path} → ${res.status()} ${await res.text()}`);
    return (await res.json()) as T;
  }

  // ---- PIM ----
  async createEmployee(e: { firstName: string; lastName: string; middleName?: string; employeeId?: string }) {
    return (await this.call<{ data: Employee }>('POST', 'pim/employees', { data: { middleName: '', ...e } })).data;
  }

  async deleteEmployees(empNumbers: number[]) {
    await this.call('DELETE', 'pim/employees', { data: { ids: empNumbers } });
  }

  // ---- Admin ----
  async createSystemUser(u: { username: string; password: string; empNumber: number; role: 'Admin' | 'ESS'; enabled: boolean }) {
    const data = { username: u.username, password: u.password, empNumber: u.empNumber, userRoleId: u.role === 'Admin' ? 1 : 2, status: u.enabled };
    return (await this.call<{ data: SystemUser }>('POST', 'admin/users', { data })).data;
  }

  async getSystemUser(id: number) {
    return (await this.call<{ data: SystemUser }>('GET', `admin/users/${id}`)).data;
  }

  async deleteSystemUsers(ids: number[]) {
    await this.call('DELETE', 'admin/users', { data: { ids } });
  }

  // ---- Leave ----
  async currentLeavePeriod() {
    return (await this.call<{ meta: { currentLeavePeriod: LeavePeriod } }>('GET', 'leave/leave-periods')).meta.currentLeavePeriod;
  }

  async leaveType(preferredName: string) {
    const types = (await this.call<{ data: LeaveType[] }>('GET', 'leave/leave-types', { params: { limit: 0 } })).data;
    const active = types.filter((t) => !t.deleted);
    const type = active.find((t) => t.name === preferredName) ?? active[0];
    if (!type) throw new Error('No active leave types configured');
    return type;
  }

  async myLeaveBalance(leaveTypeId: number) {
    const res = await this.call<{ data: { balance: { balance: number } }; meta: { employee: Employee } }>(
      'GET',
      `leave/leave-balance/leave-type/${leaveTypeId}`,
    );
    return { balance: res.data.balance.balance, empNumber: res.meta.employee.empNumber };
  }

  async addLeaveEntitlement(e: { empNumber: number; leaveTypeId: number; period: LeavePeriod; days: number }) {
    const data = { empNumber: e.empNumber, leaveTypeId: e.leaveTypeId, fromDate: e.period.startDate, toDate: e.period.endDate, entitlement: String(e.days) };
    return (await this.call<{ data: { id: number } }>('POST', 'leave/leave-entitlements', { data })).data;
  }

  async deleteLeaveEntitlements(ids: number[]) {
    await this.call('DELETE', 'leave/leave-entitlements', { data: { ids } });
  }
}
