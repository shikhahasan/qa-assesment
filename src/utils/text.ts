const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const exactText = (s: string) => new RegExp(`^\\s*${escapeRegExp(s)}\\s*$`);
