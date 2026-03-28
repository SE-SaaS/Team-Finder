/**
 * Jordanian Universities with IT/CS Programs
 * Total: 25 universities (10 public + 15 private)
 */

export const UNIVERSITIES = [
  // ============================================
  // PUBLIC UNIVERSITIES
  // ============================================
  'University of Jordan (UJ) – Amman',
  'Jordan University of Science & Technology (JUST) – Irbid',
  'Yarmouk University – Irbid',
  'Hashemite University – Zarqa',
  'Mutah University – Karak',
  'Al al-Bayt University – Mafraq',
  'Al-Hussein Bin Talal University – Ma\'an',
  'Tafila Technical University – Tafila',
  'German Jordanian University (GJU) – Amman',
  'The Jordanian University for Tourism & Heritage – Petra',

  // ============================================
  // PRIVATE UNIVERSITIES
  // ============================================
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

const VALID_DOMAINS = Object.keys(EMAIL_DOMAIN_MAP);

/**
 * Check if email is from a valid university domain
 * @param email - Email address to validate
 * @returns true if email is from @ju.edu.jo or @hu.edu.jo
 */
export function isValidUniversityEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  return VALID_DOMAINS.includes(domain);
}

/**
 * Get university name from email domain
 * @param email - Email address
 * @returns University name or null if not found
 */
export function getUniversityFromEmail(email: string): string | null {
  if (!email || !email.includes('@')) return null;

  const domain = email.split('@')[1]?.toLowerCase();
  return EMAIL_DOMAIN_MAP[domain] || null;
}
