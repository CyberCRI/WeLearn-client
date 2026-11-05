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
  // same message whether or not the email already has an account (no user enumeration)
  successMessage:
    'If no account exists yet for {email}, you will receive an email to confirm it and set your password.',
  errors: {
    RATE_LIMITED: 'Too many attempts. Please wait a while before trying again.',
    KEYCLOAK_UNAVAILABLE: 'The service is unavailable right now. Please try again in a moment.',
    SIGNUP_DISABLED: 'Sign-up is not available at the moment.',
    UNKNOWN: 'Something went wrong. Please try again in a moment.'
  },
  errorTitle: 'Your account could not be created',
  sessionExpired: {
    title: 'Your session has expired',
    message: 'For your security, your session was closed. Log in again to find your work.',
    login: 'Log in again',
    continueAsGuest: 'Continue without an account'
  },
  signupPrompt: {
    title: 'Create your free account',
    createAccount: 'Create an account',
    login: 'I already have an account',
    reasons: {
      bookmarks:
        'Your bookmarks are saved to your account. Create one for free to find them again.',
      bookmark: 'Create a free account to bookmark this resource and find it again later.',
      download:
        'Your syllabus is ready. Create a free account to download it, or log in: it will download right after.',
      bibliography: 'Create a free account to export your bibliography.',
      chatLimit:
        'You have used all the free questions of the guest access. Create a free account to keep chatting.',
      syllabusLimit:
        'You have used the free syllabus of the guest access. Create a free account to create more.'
    }
  },
  // plural forms: none left | 1 left | n left
  guestQuota: {
    chat: 'Guest access: you have used your {limit} free questions. | Guest access: 1 free question left out of {limit}. | Guest access: {n} free questions left out of {limit}.',
    syllabus:
      'Guest access: you have used your free syllabus. | Guest access: you can create 1 free syllabus. | Guest access: you can create {n} free syllabi.',
    createAccount: 'Create a free account for unlimited use'
  }
};
