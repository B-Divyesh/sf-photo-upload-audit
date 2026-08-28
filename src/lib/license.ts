export const PRODUCT_SLUG = 'photo-upload-audit';
export const BILLING_BASE = 'https://api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${PRODUCT_SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${PRODUCT_SLUG}`;

export interface LicenseState { active: boolean; token?: string; note: string }

export function captureLicenseFromUrl(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storeLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function clearLicense(): void {
  localStorage.removeItem(LICENSE_KEY);
  localStorage.removeItem(VERDICT_KEY);
}

export async function licenseState(): Promise<LicenseState> {
  const token = localStorage.getItem(LICENSE_KEY) ?? '';
  if (!token) return { active: false, note: 'No license saved' };
  const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || 'null') as { valid: boolean; checkedAt: number } | null;
  const fresh = cached && Date.now() - cached.checkedAt < 86_400_000;
  if (fresh) return { active: cached.valid, token, note: cached.valid ? 'Archive License active' : 'License no longer active' };
  try {
    const response = await fetch(`${BILLING_BASE}/products/${PRODUCT_SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification service unavailable');
    const verdict = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now() }));
    return { active: verdict.valid, token, note: verdict.valid ? 'Archive License active' : 'License no longer active' };
  } catch {
    if (cached?.valid) return { active: true, token, note: 'License active · verification will retry online' };
    return { active: false, token, note: 'Could not verify the license. Check your connection.' };
  }
}

export const checkoutUrl = `${BILLING_BASE}/products/${PRODUCT_SLUG}/checkout`;
