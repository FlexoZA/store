// Password validation rules
export const passwordRules = {
  minLength: 8,
  requiresNumber: true,
  requiresSpecial: true,
  requiresUppercase: true,
}

// Email validation pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone validation and formatting
export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')

  // If it starts with 0, replace with +27
  if (cleaned.startsWith('0')) {
    cleaned = '27' + cleaned.substring(1)
  }

  // If no country code and length is valid, add +27
  if (!cleaned.startsWith('27') && cleaned.length === 9) {
    cleaned = '27' + cleaned
  }

  // Add + if not present
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }

  // Format the number: +27 XX XXX XXXX
  if (cleaned.length >= 11) {
    return cleaned.replace(/(\+\d{2})(\d{2})(\d{3})(\d{4}).*/, '$1 $2 $3 $4')
  }

  return cleaned
}

export const validatePhone = (phone) => {
  if (!phone) return ''

  // Remove all non-digit characters for validation
  const cleaned = phone.replace(/\D/g, '')

  // For SA numbers: should be exactly 11 digits (27 + 9 digits)
  const isValidLength = cleaned.length === 11
  const hasValidPrefix = cleaned.startsWith('27')

  // Additional check for the correct format of SA mobile numbers
  // After 27, should start with 6,7,8 for mobile numbers
  const hasValidMobilePrefix = /^27[6-8]/.test(cleaned)

  if (!isValidLength) {
    return 'Phone number must be 9 digits (excluding country code)'
  }

  if (!hasValidPrefix || !hasValidMobilePrefix) {
    return 'Please enter a valid South African mobile number starting with +27'
  }

  return ''
}

// Validation functions
export const validatePassword = (password) => {
  if (!password) return ''
  const errors = []

  if (password.length < passwordRules.minLength) {
    errors.push(`Password must be at least ${passwordRules.minLength} characters`)
  }
  if (passwordRules.requiresNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  if (passwordRules.requiresSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  if (passwordRules.requiresUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  return errors.length ? errors.join('. ') : ''
}

export const validateEmail = (email) => {
  if (!email) return ''
  return emailPattern.test(email) ? '' : 'Please enter a valid email address'
}
