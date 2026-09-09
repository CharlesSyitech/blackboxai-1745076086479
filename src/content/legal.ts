import type { I18n, I18nList } from "@/types/content"

/**
 * Company identification for the legal notice. These are registry facts —
 * they are never invented. While any required field is null the legal notice
 * page returns 404 and its footer link is not rendered.
 */
export const legalEntity = {
  legalForm: null as string | null,
  shareCapital: null as string | null,
  registration: null as string | null,
  headquarters: null as string | null,
  publicationDirector: null as string | null,
  host: null as string | null,
}

export const legalEntityComplete = Object.values(legalEntity).every((value) => value !== null)

export interface LegalDocument {
  key: string
  slug: I18n
  title: I18n
  intro: I18n
  sections: { heading: I18n; body: I18nList }[]
  available: boolean
}

export const legalDocuments: LegalDocument[] = [
  {
    key: "legal-notice",
    slug: { fr: "mentions-legales", en: "legal-notice" },
    title: { fr: "Mentions légales", en: "Legal notice" },
    intro: {
      fr: "Informations légales relatives à l'éditeur et à l'hébergeur du site.",
      en: "Legal information about the site's publisher and host.",
    },
    sections: [],
    available: legalEntityComplete,
  },
  {
    key: "privacy",
    slug: { fr: "confidentialite", en: "privacy" },
    title: { fr: "Politique de confidentialité", en: "Privacy policy" },
    intro: {
      fr: "Comment les données que vous nous transmettez sont utilisées, conservées et protégées.",
      en: "How the data you send us is used, retained and protected.",
    },
    sections: [
      {
        heading: { fr: "Données collectées", en: "Data collected" },
        body: {
          fr: [
            "Ce site collecte uniquement les données que vous saisissez volontairement dans le formulaire de contact : nom, adresse e-mail, organisation le cas échéant, et le contenu de votre message.",
            "Aucune donnée n'est collectée à des fins publicitaires sans votre consentement explicite.",
          ],
          en: [
            "This site collects only the data you voluntarily enter in the contact form: name, email address, organisation where applicable, and the content of your message.",
            "No data is collected for advertising purposes without your explicit consent.",
          ],
        },
      },
      {
        heading: { fr: "Finalité et base légale", en: "Purpose and legal basis" },
        body: {
          fr: [
            "Ces données sont utilisées exclusivement pour traiter votre demande et y répondre. Elles ne sont ni cédées, ni louées, ni exploitées à d'autres fins.",
            "La base légale du traitement est votre consentement, matérialisé par l'envoi du formulaire.",
          ],
          en: [
            "This data is used solely to handle and answer your request. It is neither sold, rented nor used for any other purpose.",
            "The legal basis for processing is your consent, given by submitting the form.",
          ],
        },
      },
      {
        heading: { fr: "Durée de conservation", en: "Retention period" },
        body: {
          fr: [
            "Demandes de contact : 36 mois à compter du dernier échange.",
            "Candidatures : 24 mois à compter de la réception.",
            "Journaux techniques : 12 mois.",
          ],
          en: [
            "Contact requests: 36 months from the last exchange.",
            "Applications: 24 months from receipt.",
            "Technical logs: 12 months.",
          ],
        },
      },
      {
        heading: { fr: "Vos droits", en: "Your rights" },
        body: {
          fr: [
            "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition sur les données vous concernant.",
            "Pour exercer ces droits, écrivez à contact@syitechgroup.com en précisant votre demande.",
          ],
          en: [
            "You have the right to access, rectify, erase, restrict and object to the processing of your data.",
            "To exercise these rights, write to contact@syitechgroup.com describing your request.",
          ],
        },
      },
    ],
    available: true,
  },
  {
    key: "cookies",
    slug: { fr: "cookies", en: "cookies" },
    title: { fr: "Politique cookies", en: "Cookie policy" },
    intro: {
      fr: "Les traceurs utilisés par ce site et la manière dont vous les contrôlez.",
      en: "The trackers used by this site and how you control them.",
    },
    sections: [
      {
        heading: { fr: "Cookies strictement nécessaires", en: "Strictly necessary cookies" },
        body: {
          fr: [
            "Un seul cookie est déposé sans votre consentement : NEXT_LOCALE, qui mémorise votre langue d'affichage. Il ne permet pas de vous identifier et expire au bout de douze mois.",
          ],
          en: [
            "Only one cookie is set without your consent: NEXT_LOCALE, which remembers your display language. It does not identify you and expires after twelve months.",
          ],
        },
      },
      {
        heading: { fr: "Mesure d'audience et publicité", en: "Analytics and advertising" },
        body: {
          fr: [
            "Aucun script de mesure d'audience ou de publicité n'est chargé avant votre consentement explicite.",
            "Le refus est aussi simple que l'acceptation, et votre choix peut être modifié à tout moment.",
          ],
          en: [
            "No analytics or advertising script is loaded before your explicit consent.",
            "Refusing is as simple as accepting, and your choice can be changed at any time.",
          ],
        },
      },
    ],
    available: true,
  },
  {
    key: "accessibility",
    slug: { fr: "accessibilite", en: "accessibility" },
    title: { fr: "Déclaration d'accessibilité", en: "Accessibility statement" },
    intro: {
      fr: "Le niveau d'accessibilité visé par ce site et les moyens de nous signaler une difficulté.",
      en: "The accessibility level this site targets and how to report a difficulty.",
    },
    sections: [
      {
        heading: { fr: "Niveau visé", en: "Target level" },
        body: {
          fr: [
            "Ce site est conçu pour atteindre le niveau AA des règles WCAG 2.2 : navigation complète au clavier, focus toujours visible, contrastes contrôlés, alternatives textuelles, respect de la préférence de mouvement réduit.",
            "Les schémas interactifs disposent tous d'un équivalent textuel présent dans la page.",
          ],
          en: [
            "This site is designed to meet WCAG 2.2 level AA: full keyboard navigation, always-visible focus, controlled contrast, text alternatives, and respect for reduced-motion preferences.",
            "Every interactive diagram has a text equivalent present in the page.",
          ],
        },
      },
      {
        heading: { fr: "Signaler une difficulté", en: "Report a difficulty" },
        body: {
          fr: [
            "Si vous rencontrez un obstacle, écrivez à contact@syitechgroup.com en décrivant la page concernée et la difficulté rencontrée. Nous nous engageons à vous répondre et à corriger le point signalé.",
          ],
          en: [
            "If you encounter an obstacle, write to contact@syitechgroup.com describing the page and the difficulty. We commit to responding and correcting the issue reported.",
          ],
        },
      },
    ],
    available: true,
  },
]

export function getLegalDocuments() {
  return legalDocuments.filter((document) => document.available)
}
