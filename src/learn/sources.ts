// bibliography of the learn modules (from the researcher's source base). titles stay in their
// original language; `url.fr` only when an official French version exists
export const SOURCES = {
  wced: {
    short: 'WCED, 1987',
    full: 'World Commission on Environment and Development (1987). Our Common Future (A/42/427).',
    url: { en: 'https://digitallibrary.un.org/record/139811' }
  },
  agenda: {
    short: 'UN, 2015',
    full: 'United Nations (2015). Transforming our world: the 2030 Agenda for Sustainable Development (A/RES/70/1).',
    url: { en: 'https://sdgs.un.org/2030agenda', fr: 'https://sdgs.un.org/fr/2030agenda' }
  },
  sdgs: {
    short: 'UN, SDGs',
    full: 'United Nations. The 17 Sustainable Development Goals.',
    url: { en: 'https://sdgs.un.org/goals' }
  },
  roadmap: {
    short: 'UNESCO, 2020',
    full: 'UNESCO (2020). Education for Sustainable Development: a roadmap (ESD for 2030).',
    url: { en: 'https://unesdoc.unesco.org/ark:/48223/pf0000374802' }
  },
  unesco2017: {
    short: 'UNESCO, 2017',
    full: 'UNESCO (2017). Education for Sustainable Development Goals: Learning Objectives.',
    url: {
      en: 'https://www.unesco.org/en/articles/education-sustainable-development-goals-learning-objectives'
    }
  },
  mesr2022: {
    short: 'MESR, 2022',
    full: 'Ministère de l’Enseignement supérieur et de la Recherche (2022). La ministre annonce la généralisation de l’enseignement de la transition écologique (communiqué, 20 octobre 2022).',
    url: {
      en: 'https://www.enseignementsup-recherche.gouv.fr/fr/la-ministre-de-l-enseignement-superieur-et-de-la-recherche-annonce-la-generalisation-de-l-87608'
    }
  },
  mesr2023: {
    short: 'MESR, 2023',
    full: 'Ministère de l’Enseignement supérieur et de la Recherche (2023). Former les étudiants de premier cycle à la transition écologique pour un développement soutenable (note de cadrage).',
    url: {
      en: 'https://www.enseignementsup-recherche.gouv.fr/fr/former-les-etudiants-de-premier-cycle-la-transition-ecologique-pour-un-developpement-soutenable-93027'
    }
  },
  jouzel: {
    short: 'Jouzel, 2022',
    full: 'Groupe de travail présidé par J. Jouzel (2022). Sensibiliser et former aux enjeux de la transition écologique et du développement durable dans l’enseignement supérieur.',
    url: {
      en: 'https://www.enseignementsup-recherche.gouv.fr/fr/sensibiliser-et-former-aux-enjeux-de-la-transition-ecologique-dans-l-enseignement-superieur-83888'
    }
  },
  greencomp: {
    short: 'GreenComp, 2022',
    full: 'Bianchi, G., Pisiotis, U. & Cabrera Giraldez, M. (2022). GreenComp: The European sustainability competence framework. JRC128040. CC BY 4.0.',
    // the FR edition has its own page numbers (cited as such in the FR content)
    url: {
      en: 'https://publications.jrc.ec.europa.eu/repository/handle/JRC128040',
      fr: 'https://publications.jrc.ec.europa.eu/repository/bitstream/JRC128040/JRC128040_008.pdf'
    }
  },
  ec: {
    short: 'European Commission',
    full: 'European Commission. Learning for the green transition and sustainable development.',
    url: {
      en: 'https://education.ec.europa.eu/focus-topics/green-education/learning-for-the-green-transition'
    }
  }
} as const satisfies Record<
  string,
  { short: string; full: string; url: { en: string; fr?: string } }
>;

export type SourceId = keyof typeof SOURCES;

export const sourceUrl = (id: SourceId, locale: string) => {
  const url: { en: string; fr?: string } = SOURCES[id].url;
  return (locale === 'fr' && url.fr) || url.en;
};
