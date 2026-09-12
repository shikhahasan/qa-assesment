import { faker } from '@faker-js/faker';

export const invalidUsername = () => `nouser_${faker.string.alphanumeric(6)}`;
export const invalidPassword = () => faker.internet.password({ length: 12 });
