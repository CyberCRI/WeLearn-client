export const authentication = {
  registerTitle: 'Créer votre compte',
  // le logo des pages sans barre de navigation, un lien vers le chat
  logoAlt: 'WeLearn, retour au chat',
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
  // même message que l’adresse ait déjà un compte ou non (pas d’énumération des comptes)
  successMessage:
    'Si aucun compte n’existe encore pour {email}, vous allez recevoir un e-mail pour le confirmer et choisir votre mot de passe.',
  errors: {
    RATE_LIMITED: 'Trop de tentatives. Patientez un moment avant de réessayer.',
    KEYCLOAK_UNAVAILABLE: 'Le service est indisponible pour le moment. Réessayez dans un instant.',
    SIGNUP_DISABLED: 'L’inscription n’est pas disponible pour le moment.',
    EMAIL_UNAVAILABLE: 'Le service est indisponible pour le moment. Réessayez dans un instant.',
    EMAIL_DISABLED: 'L’envoi de demandes n’est pas disponible pour le moment.',
    UNKNOWN: 'Une erreur est survenue. Réessayez dans un instant.'
  },
  errorTitle: 'Votre compte n’a pas pu être créé',
  // l’entrée « Autre » de la liste des universités de la page de connexion mène ici
  universityRequest: {
    title: 'Mon université n’est pas dans la liste',
    intro:
      'Indiquez-nous l’université avec laquelle vous souhaitez vous connecter : nous demanderons à l’ajouter à WeLearn.',
    universityLabel: 'Nom de l’université',
    universityRequired: 'Saisissez le nom de votre université.',
    cityLabel: 'Ville',
    cityRequired: 'Saisissez la ville de votre université.',
    emailLabel: 'Votre adresse e-mail (facultatif)',
    emailHint: 'Pour vous prévenir quand votre université sera ajoutée.',
    submitButton: 'Envoyer la demande',
    submitting: 'Envoi…',
    successTitle: 'Demande envoyée',
    successMessage: 'Merci ! L’équipe WeLearn a bien reçu votre demande d’ajout de {university}.',
    backToLogin: 'Retour à la page de connexion',
    errorTitle: 'Votre demande n’a pas pu être envoyée'
  },
  sessionExpired: {
    title: 'Votre session a expiré',
    message:
      'Pour votre sécurité, votre session a été fermée. Reconnectez-vous pour retrouver votre travail.',
    login: 'Se reconnecter',
    continueAsGuest: 'Continuer sans compte'
  },
  limitedAccess: {
    title: 'Votre accès est temporaire',
    message:
      "Vous ne vous êtes pas connecté·e avec le compte de votre établissement : votre accès à WeLearn est donc limité à 6 mois et se termine le {date}. La durée de cet accès est indicative : l'équipe WeLearn peut la revoir. Pour continuer à utiliser WeLearn ensuite, connectez-vous avec le compte de votre établissement. Votre profil indique le temps qu'il vous reste.",
    messageWithoutDate:
      "Vous ne vous êtes pas connecté·e avec le compte de votre établissement : votre accès à WeLearn est donc limité à 6 mois. La durée de cet accès est indicative : l'équipe WeLearn peut la revoir. Pour continuer à utiliser WeLearn ensuite, connectez-vous avec le compte de votre établissement. Votre profil indique le temps qu'il vous reste.",
    ok: "J'ai compris"
  },
  accessEnded: {
    title: 'Votre accès temporaire est terminé',
    message:
      "L'accès avec un compte Google ou une adresse e-mail est temporaire, et le vôtre est arrivé à son terme. Connectez-vous avec le compte de votre établissement pour continuer à utiliser tout WeLearn.",
    login: 'Me connecter avec mon établissement',
    continueAsGuest: 'Continuer sans compte'
  },
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
        'Vous avez utilisé les questions gratuites du jour de l’accès invité. Revenez demain, ou créez un compte gratuit pour continuer à discuter.',
      syllabusLimit:
        'Vous avez utilisé le syllabus gratuit du jour de l’accès invité. Revenez demain, ou créez un compte gratuit pour en créer d’autres.',
      tooManyGuests:
        'Beaucoup de nouveaux invités se connectent depuis votre réseau en ce moment. Connectez-vous ou créez un compte gratuit pour continuer, ou revenez dans une heure.',
      feedbackLimit:
        'Vous avez utilisé les modifications gratuites du jour de votre syllabus avec l’accès invité. Revenez demain, ou créez un compte gratuit pour continuer à l’améliorer.',
      filesLimit:
        'Vous avez envoyé les documents gratuits du jour avec l’accès invité. Revenez demain, ou créez un compte gratuit pour en envoyer d’autres.',
      adaptationLimit:
        'Vous avez utilisé les modifications de cours gratuites du jour de l’accès invité. Revenez demain, ou créez un compte gratuit pour développer d’autres liens.'
    }
  },
  // formes du pluriel : aucune restante | 1 restante | n restantes
  guestQuota: {
    chat: 'Accès invité : vous avez utilisé vos {limit} questions gratuites du jour, revenez demain. | Accès invité : il vous reste 1 question gratuite sur {limit} aujourd’hui. | Accès invité : il vous reste {n} questions gratuites sur {limit} aujourd’hui.',
    syllabus:
      'Accès invité : vous avez utilisé votre syllabus gratuit du jour, revenez demain. | Accès invité : vous pouvez créer 1 syllabus gratuit aujourd’hui. | Accès invité : vous pouvez créer {n} syllabus gratuits aujourd’hui.',
    createAccount: 'Ou créez un compte gratuit pour un usage illimité'
  }
};
