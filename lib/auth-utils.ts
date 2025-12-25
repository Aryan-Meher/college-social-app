// Helper functions for email verification

export function extractDomainFromEmail(email: string): string {
  const parts = email.split("@")
  return parts.length === 2 ? parts[1].toLowerCase() : ""
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getEmailDomain(email: string): string {
  return extractDomainFromEmail(email)
}

export function getCollegeDomain(email: string): string {
  return extractDomainFromEmail(email)
}
