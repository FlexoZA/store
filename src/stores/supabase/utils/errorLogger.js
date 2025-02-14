/**
 * Utility for centralized error logging
 */
import { supabase } from '@/stores/supabase/supabaseClient'
/**
 * Log severity levels
 */
export const LogSeverity = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  CRITICAL: 'critical'
}

/**
 * Determine error severity based on error type and context
 * @param {Error} error - The error object
 * @param {string} source - Source of the error
 * @param {Object} context - Error context
 * @returns {string} - Severity level
 */
const calculateSeverity = (error, source) => {
  // Critical errors - system breaking issues
  if (
    error.name === 'AuthenticationError' ||
    error.message.includes('authentication') ||
    error.message.includes('permission') ||
    error.message.includes('unauthorized')
  ) {
    return LogSeverity.CRITICAL
  }

  // Database related errors
  if (
    source.includes('supabase') ||
    error.message.includes('database') ||
    error.message.includes('query')
  ) {
    return LogSeverity.ERROR
  }

  // Network related issues
  if (
    error instanceof TypeError ||
    error.message.includes('network') ||
    error.message.includes('fetch') ||
    error.message.includes('timeout')
  ) {
    return LogSeverity.WARNING
  }

  // Validation or expected errors
  if (
    error.name === 'ValidationError' ||
    error.message.includes('validation') ||
    error.message.includes('invalid')
  ) {
    return LogSeverity.WARNING
  }

  // Default to ERROR for unknown cases
  return LogSeverity.ERROR
}

/**
 * Log an error with context to console and/or backend
 * @param {Error} error - The error object to log
 * @param {string} source - Source of the error (e.g., 'productsStore')
 * @param {Object} context - Additional context as JSON
 * @param {string} [severity] - Optional severity override (error/warning/info/critical)
 * @returns {Promise<void>} - Resolves when error is logged
 *
 * Fields sent to database:
 * - source: text
 * - error_message: text
 * - error_stack: text
 * - severity: text
 * - context: jsonb
 * (created_at is handled by Supabase)
 */
export const logError = async (error, source, context = {}, severity = null) => {
  // Calculate severity if not explicitly provided
  const calculatedSeverity = severity || calculateSeverity(error, source)

  const errorLog = {
    source,
    error_message: error.message,
    error_stack: error.stack,
    severity: calculatedSeverity,
    context
  }

  // Log to console in development TODO: remove in production
  console.error(`Error in ${source} [${calculatedSeverity}]:`, errorLog)

  // Send to backend logging endpoint
  try {
    await supabase
      .from('logs')
      .insert([errorLog])

  } catch (logError) {
    // Fallback to console if logging fails
    console.error('Failed to log to database:', logError)
  }
}
