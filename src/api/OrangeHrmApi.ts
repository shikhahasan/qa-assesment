import type { APIRequestContext } from '@playwright/test';

interface Employee {
  empNumber: number;
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export class OrangeHrmApi {
  constructor(private readonly request: APIRequestContext) {}

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
}
