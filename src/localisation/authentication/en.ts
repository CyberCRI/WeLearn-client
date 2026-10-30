export const authentication = {
  registerTitle: 'Create account',
  registerButton: 'Sign up',
  cancelButton: 'Cancel',
  requiredFieldsNote: 'Fields marked with an asterisk (*) are required.',
  firstNameLabel: 'First name',
  lastNameLabel: 'Last name',
  emailLabel: 'Email',
  emailHint: "Example: name{'@'}university.edu",
  firstNameRequired: 'Enter your first name.',
  lastNameRequired: 'Enter your last name.',
  emailInvalid: "Enter a valid email address, for example name{'@'}university.edu.",
  submitting: 'Creating account…',
  successTitle: 'Check your inbox',
  successMessage:
    'We sent a link to {email}. Follow it to confirm your address and choose your password.',
  loginButton: 'Log in',
  errors: {
    EMAIL_ALREADY_EXISTS: 'An account already exists for this email. You can log in instead.',
    KEYCLOAK_UNAVAILABLE: 'The service is unavailable right now. Please try again in a moment.',
    SIGNUP_DISABLED: 'Sign-up is not available at the moment.',
    UNKNOWN: 'Something went wrong. Please try again in a moment.'
  },
  errorTitle: 'Your account could not be created'
};
