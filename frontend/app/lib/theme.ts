export type ThemeMode = 'light' | 'dark';

export function parseThemeCookie(value: string | undefined): ThemeMode {
  return value === 'light' ? 'light' : 'dark';
}
