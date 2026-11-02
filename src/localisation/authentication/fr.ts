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
  errorTitle: 'Votre compte n’a pas pu être créé',
  signupPrompt: {
    title: 'Créez votre compte gratuit',
    createAccount: 'Créer un compte',
    login: 'J’ai déjà un compte',
    reasons: {
      bookmarks:
        'Vos favoris sont enregistrés dans votre compte. Créez-en un gratuitement pour les retrouver.',
      bookmark:
        'Créez un compte gratuit pour ajouter cette ressource à vos favoris et la retrouver plus tard.',
      download:
        'Votre syllabus est prêt. Créez un compte gratuit pour le télécharger, ou connectez-vous : il se téléchargera juste après.',
      bibliography: 'Créez un compte gratuit pour exporter votre bibliographie.',
      chatLimit:
        'Vous avez utilisé toutes les questions gratuites de l’accès invité. Créez un compte gratuit pour continuer à discuter.',
      syllabusLimit:
        'Vous avez utilisé le syllabus gratuit de l’accès invité. Créez un compte gratuit pour en créer d’autres.'
    }
  },
  // formes du pluriel : aucune restante | 1 restante | n restantes
  guestQuota: {
    chat: 'Accès invité : vous avez utilisé vos {limit} questions gratuites. | Accès invité : il vous reste 1 question gratuite sur {limit}. | Accès invité : il vous reste {n} questions gratuites sur {limit}.',
    syllabus:
      'Accès invité : vous avez utilisé votre syllabus gratuit. | Accès invité : vous pouvez créer 1 syllabus gratuit. | Accès invité : vous pouvez créer {n} syllabus gratuits.',
    createAccount: 'Créez un compte gratuit pour un usage illimité'
  }
};
