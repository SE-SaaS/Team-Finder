/**
 * Logger Utility
 *
 * Provides console logging that respects environment settings.
 * Debug logs are only shown in development, while errors/warnings always show.
 *
 * Usage:
 * ```ts
 * import { logger } from '@/lib/logger';
 *
 * logger.log('Debug info');          // Only in development
 * logger.error('Something failed');  // Always shown
 * logger.warn('Deprecation notice'); // Always shown
 * logger.info('User logged in');     // Only in development
 * ```
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log debug information (development only)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log informational messages (development only)
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log warnings (always shown)
   */
  warn: (...args: any[]) => {
    console.warn(...args);
  },

  /**
   * Log errors (always shown)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Create a namespaced logger for a specific module
   *
   * @param namespace - Module name (e.g., 'Dashboard', 'Auth', 'API')
   * @returns Logger with prefixed messages
   *
   * @example
   * const log = logger.create('Dashboard');
   * log.info('Loaded projects'); // [Dashboard] Loaded projects
   */
  create: (namespace: string) => ({
    log: (...args: any[]) => {
      if (isDevelopment) {
        console.log(`[${namespace}]`, ...args);
      }
    },
    info: (...args: any[]) => {
      if (isDevelopment) {
        console.info(`[${namespace}]`, ...args);
      }
    },
    warn: (...args: any[]) => {
      console.warn(`[${namespace}]`, ...args);
    },
    error: (...args: any[]) => {
      console.error(`[${namespace}]`, ...args);
    },
  }),
};
