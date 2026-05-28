/**
 * Currently supported universities. Signup is restricted to email domains
 * mapped in EMAIL_DOMAIN_MAP below — keep this list in sync with that map.
 */
export const UNIVERSITIES = [
  'University of Jordan (UJ) – Amman',
  'Hashemite University – Zarqa',
] as const;

/**
 * Jordanian universities planned for production rollout (10 public + 13 private).
 * Not yet wired into signup — promote entries into UNIVERSITIES and add a domain
 * to EMAIL_DOMAIN_MAP when onboarding a new university.
 */
export const FUTURE_UNIVERSITIES = [
  // Public
  'Jordan University of Science & Technology (JUST) – Irbid',
  'Yarmouk University – Irbid',
  'Mutah University – Karak',
  'Al al-Bayt University – Mafraq',
  'Al-Hussein Bin Talal University – Ma\'an',
  'Tafila Technical University – Tafila',
  'German Jordanian University (GJU) – Amman',
  'The Jordanian University for Tourism & Heritage – Petra',

  // Private
  'Applied Science Private University (ASU) – Amman',
  'Middle East University (MEU) – Amman',
  'Petra University – Amman',
  'Philadelphia University – Jarash',
  'Amman Arab University – Amman',
  'Zarqa University – Zarqa',
  'Isra University – Amman',
  'Al-Zaytoonah University – Amman',
  'Arab Open University (AOU) – Amman',
  'Jerash University – Jerash',
  'Al-Ahliyya Amman University – Amman',
  'Irbid National University (INU) – Irbid',
  'Ajloun National University – Ajloun',
  'Aqaba University of Technology (AUT) – Aqaba',
  'Al-Balqa Applied University – Salt',
] as const;

export type University = typeof UNIVERSITIES[number];

// ============================================
// EMAIL DOMAIN MAPPING
// ============================================

const EMAIL_DOMAIN_MAP: Record<string, string> = {
  'ju.edu.jo': 'University of Jordan',
  'hu.edu.jo': 'Hashemite University',
};

export function getUniversityFromEmail(email: string): string | null {
  if (!email || !email.includes('@')) return null;

  const domain = email.split('@')[1]?.toLowerCase();
  return EMAIL_DOMAIN_MAP[domain] || null;
}
