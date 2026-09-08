import type { Award, CountryPresence, NewsItem, Job, Patent, Person, TimelineEntry } from "@/types/content"

/**
 * Corporate records awaiting validation (see docs/13, blockers B3, B7, B8).
 * Empty or unpublished collections make their sections disappear rather than
 * fill with placeholder content.
 */

export const people: Person[] = []

export const awards: Award[] = []

export const patents: Patent[] = []

export const countries: CountryPresence[] = [
  {
    id: "ci",
    name: { fr: "Côte d'Ivoire", en: "Côte d'Ivoire" },
    isoCode: "CI",
    presenceType: "headquarters",
    entityName: "Syitech Group",
    isPublic: true,
  },
]

/**
 * Corporate timeline, transcribed from the official Syitech Group timeline
 * document supplied on 2026-09-08.
 *
 * Two governance points apply here:
 *
 *  1. This content REPLACES the 2018-2026 outline given in the written brief,
 *     which was more generic and differed year by year. Awaiting confirmation
 *     that this document is the authoritative version.
 *  2. Figures are gated individually. A stated OBJECTIVE is never published as
 *     a result: a public corporate site that shows forward-looking targets
 *     invites them to be read as achievements, and read back later as misses.
 */
export const timeline: TimelineEntry[] = [
  {
    year: "2018",
    title: { fr: "Création", en: "Founded" },
    body: {
      fr: "Lancement des cartes USB. Premiers clients, premières ventes.",
      en: "Launch of the USB cards. First customers, first sales.",
    },
    isPublic: true,
  },
  {
    year: "2019",
    title: { fr: "Product-Market Fit", en: "Product-market fit" },
    body: {
      fr: "Reconnaissance du marché. Contrat stratégique avec le BURIDA.",
      en: "Market recognition. Strategic contract with BURIDA.",
    },
    isPublic: true,
  },
  {
    year: "2020",
    title: { fr: "Crise Covid-19", en: "Covid-19 crisis" },
    body: {
      fr: "Activité ralentie mais entreprise résiliente. Vision maintenue.",
      en: "Activity slowed but the company held. Vision maintained.",
    },
    isPublic: true,
  },
  {
    year: "2021",
    title: { fr: "Relance & Croissance", en: "Recovery & growth" },
    body: {
      fr: "Retour en force du produit après la crise.",
      en: "The product returned in force after the crisis.",
    },
    figures: [
      {
        label: { fr: "Croissance post-crise", en: "Post-crisis growth" },
        value: { fr: "+220 %", en: "+220%" },
        kind: "achieved",
        isPublic: true,
      },
    ],
    isPublic: true,
  },
  {
    year: "2022",
    title: { fr: "Restructuration", en: "Restructuring" },
    body: {
      fr: "Révision de la stratégie. Étude des besoins culturels et adaptation.",
      en: "Strategy review. Study of cultural needs and adaptation.",
    },
    isPublic: true,
  },
  {
    year: "2023",
    title: { fr: "Croissance & Expansion", en: "Growth & expansion" },
    body: {
      fr: "Croissance soutenue et ouverture à l'international. Début du développement de Sydica et de la solution de paiement du Groupe.",
      en: "Sustained growth and international opening. Development of Sydica and the Group's payment solution begins.",
    },
    isPublic: true,
  },
  {
    year: "2024",
    title: { fr: "Année Challenge", en: "Challenge year" },
    body: {
      fr: "Accélération du développement technologique.",
      en: "Acceleration of technology development.",
    },
    figures: [
      {
        label: { fr: "Levée de fonds", en: "Funds raised" },
        value: { fr: "150 000 $", en: "$150,000" },
        kind: "achieved",
        // Held back pending confirmation that the amount is to be public on
        // an investor-facing site.
        isPublic: false,
      },
    ],
    isPublic: true,
  },
  {
    year: "2025",
    title: { fr: "Accélération", en: "Acceleration" },
    body: {
      fr: "Lancement officiel de Sydica et de la solution de paiement du Groupe. Croissance internationale.",
      en: "Official launch of Sydica and the Group's payment solution. International growth.",
    },
    figures: [
      {
        label: { fr: "Objectif utilisateurs", en: "User target" },
        value: { fr: "1 M", en: "1M" },
        kind: "objective",
        // An objective, not a result. Never published as an achievement.
        isPublic: false,
      },
      {
        label: { fr: "Objectif de levée", en: "Funding target" },
        value: { fr: "2 M€", en: "€2M" },
        kind: "objective",
        isPublic: false,
      },
    ],
    isPublic: true,
  },
]

export const news: NewsItem[] = []

export const jobs: Job[] = []
