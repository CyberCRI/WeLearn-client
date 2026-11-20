// the "Sustainability in your discipline" module, written in two parts:
// - DISCIPLINES below: what does not depend on the language (competence kinds, UVED sheets)
// - its text, one file per language: src/localisation/learn/content/discipline.<lang>.ts
// buildDiscipline merges them into the steps the screens read
import { discipline as en } from '@/localisation/learn/content/discipline.en';
import { discipline as fr } from '@/localisation/learn/content/discipline.fr';
import type {
  Data,
  DataByLang,
  DiscValue,
  DisciplineStructure,
  DisciplinesText
} from '@/types/learn/discipline';

export const DISCIPLINES = {
  math: {
    featured: ['transversal', 'transversal', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Mathematiques_et_TEDS.pdf'
  },
  history: {
    featured: ['transversal', 'transversal', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Histoire_et_TEDS.pdf'
  },
  economics: {
    featured: ['disciplinary', 'disciplinary', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Economie_et_TEDS.pdf'
  },
  law: {
    featured: ['disciplinary', 'transversal', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Droit_et_TEDS.pdf'
  },
  philosophy: {
    featured: ['disciplinary', 'transversal', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Philosophie_et_TEDS.pdf'
  },
  psychology: {
    featured: ['transversal', 'transversal', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Psychologie_et_TEDS.pdf'
  },
  geography: {
    featured: ['disciplinary', 'transversal', 'disciplinary'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Geographie_et_TEDS.pdf'
  },
  health: {
    featured: ['disciplinary', 'transversal', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Sante_et_TEDS.pdf'
  },
  staps: {
    featured: ['transversal', 'disciplinary', 'disciplinary'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_STAPS_et_TEDS.pdf'
  },
  letters: {
    featured: ['disciplinary', 'transversal', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Lettres_et_TEDS.pdf'
  },
  ecology: {
    featured: ['disciplinary', 'disciplinary', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Ecologie_et_TEDS.pdf'
  },
  art: {
    featured: ['disciplinary', 'disciplinary', 'transversal'],
    resource: 'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Art_et_TEDS.pdf'
  },
  polsci: {
    featured: ['disciplinary', 'disciplinary', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Science_politique_et_TEDS.pdf'
  },
  physics: {
    featured: ['transversal', 'transversal', 'transversal'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Physique_et_TEDS.pdf'
  },
  anthropology: {
    featured: ['disciplinary', 'transversal', 'disciplinary'],
    resource:
      'https://www.uved.fr/fileadmin/user_upload/Documents/pdf/Fiches/Fiche_Anthropologie_et_TEDS.pdf'
  }
} as const satisfies Record<DiscValue, DisciplineStructure>;

// colour of each contribution, by position: its flip card and its activities share it
const CONTRIBUTION_COLORS = ['ct', 'cp', 'ck', 'cy'] as const;

export function buildDiscipline(text: DisciplinesText<typeof DISCIPLINES>): Data {
  const entries = (Object.keys(DISCIPLINES) as DiscValue[]).map((disc) => {
    const s = DISCIPLINES[disc];
    const t = text[disc];
    const steps: Data[DiscValue]['steps'] = [
      {
        type: 'flip',
        statement: t.flip.statement,
        cards: t.contributions.map((c, i) => ({
          verb: c.verb,
          text: c.text,
          color: CONTRIBUTION_COLORS[i]
        })),
        closing: t.flip.closing
      },
      {
        type: 'competences',
        intro: t.competences.intro,
        featured: t.competences.featured.map((f, i) => ({ ...f, tagClass: s.featured[i] })),
        also: t.competences.also
      },
      {
        type: 'activities',
        apports: t.contributions.map((c, i) => ({
          label: c.verb,
          color: CONTRIBUTION_COLORS[i],
          acts: c.activities
        })),
        feedback: t.activities.feedback
      },
      {
        type: 'votretour',
        sub: t.reflection.sub,
        prompts: t.reflection.prompts,
        resource: { title: t.reflection.resourceTitle, href: s.resource }
      }
    ];
    return [disc, { steps }] as const;
  });
  return Object.fromEntries(entries) as Data;
}

export const DATA: DataByLang = { fr: buildDiscipline(fr), en: buildDiscipline(en) };
