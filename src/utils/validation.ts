// same basic shape check as the API's SignUpRequest; keycloak validates the address itself
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const isValidEmail = (email: string): boolean => EMAIL_PATTERN.test(email.trim());
