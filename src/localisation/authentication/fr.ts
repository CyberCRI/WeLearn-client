export const authentication = {
  registerTitle: 'Créer votre compte',
  registerButton: 'Inscription',
  cancelButton: 'Annuler',
  requiredFieldsNote: 'Les champs marqués d’un astérisque (*) sont obligatoires.',
  firstNameLabel: 'Prénom',
  lastNameLabel: 'Nom',
  emailLabel: 'Adresse e-mail',
  emailHint: "Exemple : nom{'@'}universite.fr",
  firstNameRequired: 'Saisissez votre prénom.',
  lastNameRequired: 'Saisissez votre nom.',
  emailInvalid: "Saisissez une adresse e-mail valide, par exemple nom{'@'}universite.fr.",
  submitting: 'Création du compte…',
  successTitle: 'Vérifiez votre boîte mail',
  successMessage:
    'Un lien a été envoyé à {email}. Suivez-le pour confirmer votre adresse et choisir votre mot de passe.',
  loginButton: 'Se connecter',
  errors: {
    EMAIL_ALREADY_EXISTS: 'Un compte existe déjà pour cette adresse. Vous pouvez vous connecter.',
    KEYCLOAK_UNAVAILABLE: 'Le service est indisponible pour le moment. Réessayez dans un instant.',
    SIGNUP_DISABLED: 'L’inscription n’est pas disponible pour le moment.',
    UNKNOWN: 'Une erreur est survenue. Réessayez dans un instant.'
  },
  errorTitle: 'Votre compte n’a pas pu être créé'
};
