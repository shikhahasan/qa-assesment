import { faker } from '@faker-js/faker';

const lettersOnly = (s: string) => s.replace(/[^A-Za-z]/g, '');

export interface NewEmployee {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

export const fullName = (e: Pick<NewEmployee, 'firstName' | 'middleName' | 'lastName'>) =>
  [e.firstName, e.middleName, e.lastName].filter(Boolean).join(' ');

export function newEmployee(): NewEmployee {
  return {
    firstName: lettersOnly(faker.person.firstName()),
    middleName: lettersOnly(faker.person.middleName()),
    lastName: lettersOnly(faker.person.lastName()),
    // OrangeHRM caps Employee Id at 10 characters.
    employeeId: `QA${faker.string.numeric(7)}`,
  };
}

export function newSystemUser() {
  return {
    username: `qa_${faker.string.alphanumeric(8).toLowerCase()}`,
    password: `Qa@${faker.string.alphanumeric(8)}1`,
  };
}

export const invalidUsername = () => `nouser_${faker.string.alphanumeric(6)}`;
export const invalidPassword = () => faker.internet.password({ length: 12 });
export const uniqueTag = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${faker.string.alphanumeric(4)}`;
