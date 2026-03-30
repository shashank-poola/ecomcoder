export type ThemeMode = 'light' | 'dark';

/** Default is **dark** unless cookie is exactly `theme=light`. */
export function parseThemeCookie(value: string | undefined): ThemeMode {
  return value === 'light' ? 'light' : 'dark';
}
