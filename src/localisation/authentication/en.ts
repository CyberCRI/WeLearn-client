export const authentication = {
  registerTitle: 'Create account',
  // the logo of the pages without the nav bar, a link to the chat
  logoAlt: 'WeLearn, back to the chat',
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
    EMAIL_UNAVAILABLE: 'The service is unavailable right now. Please try again in a moment.',
    EMAIL_DISABLED: 'Sending requests is not available at the moment.',
    UNKNOWN: 'Something went wrong. Please try again in a moment.'
  },
  errorTitle: 'Your account could not be created',
  // the "Other" entry of the login page's list of universities leads here
  universityRequest: {
    title: 'My university is not listed',
    intro:
      'Tell us which university you would like to log in with, and we will ask to add it to WeLearn.',
    universityLabel: 'University name',
    universityRequired: 'Enter the name of your university.',
    cityLabel: 'City',
    cityRequired: 'Enter the city of your university.',
    emailLabel: 'Your email (optional)',
    emailHint: 'To let you know when your university is added.',
    submitButton: 'Send the request',
    submitting: 'Sending…',
    successTitle: 'Request sent',
    successMessage: 'Thank you! The WeLearn team has received your request to add {university}.',
    backToLogin: 'Back to the login page',
    errorTitle: 'Your request could not be sent'
  },
  sessionExpired: {
    title: 'Your session has expired',
    message: 'For your security, your session was closed. Log in again to find your work.',
    login: 'Log in again',
    continueAsGuest: 'Continue without an account'
  },
  limitedAccess: {
    title: 'Your access is temporary',
    message:
      'You did not log in with your school or university account, so your access to WeLearn is limited to 6 months: it ends on {date}. The length of this access is indicative: the WeLearn team may review it. To keep using WeLearn after that, log in with your institution account. Your profile shows how much time you have left.',
    messageWithoutDate:
      'You did not log in with your school or university account, so your access to WeLearn is limited to 6 months. The length of this access is indicative: the WeLearn team may review it. To keep using WeLearn after that, log in with your institution account. Your profile shows how much time you have left.',
    ok: 'I understand'
  },
  accessEnded: {
    title: 'Your temporary access has ended',
    message:
      'Access with a Google account or an email address is temporary, and yours has ended. Log in with your school or university account to keep using all of WeLearn.',
    login: 'Log in with my institution',
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
        'You have used today’s free questions of the guest access. Come back tomorrow, or create a free account to keep chatting.',
      syllabusLimit:
        'You have used today’s free syllabus of the guest access. Come back tomorrow, or create a free account to create more.',
      tooManyGuests:
        'Many new guests are connecting from your network right now. Log in or create a free account to continue, or come back in an hour.',
      feedbackLimit:
        'You have used today’s free changes to your syllabus with the guest access. Come back tomorrow, or create a free account to keep improving it.',
      filesLimit:
        'You have sent today’s free documents with the guest access. Come back tomorrow, or create a free account to send more.',
      adaptationLimit:
        'You have used today’s free course changes of the guest access. Come back tomorrow, or create a free account to develop more connections.'
    }
  },
  // plural forms: none left | 1 left | n left
  guestQuota: {
    chat: 'Guest access: you have used your {limit} free questions for today, come back tomorrow. | Guest access: 1 free question left out of {limit} today. | Guest access: {n} free questions left out of {limit} today.',
    syllabus:
      'Guest access: you have used your free syllabus for today, come back tomorrow. | Guest access: you can create 1 free syllabus today. | Guest access: you can create {n} free syllabi today.',
    createAccount: 'Or create a free account for unlimited use'
  }
};
