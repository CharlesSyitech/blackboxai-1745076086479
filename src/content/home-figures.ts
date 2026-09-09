import type { I18n } from "@/types/content"

/**
 * The five figures of the homepage band.
 *
 * PROVENANCE. These come from the composition Syitech Group supplied on
 * 2026-09-09 — they are the client's own figures, not derived, estimated or
 * inferred here. They sit apart from `kpis.ts`, whose indicators still await
 * a period, a source and a validator before publication; putting them here
 * keeps that distinction visible rather than quietly promoting draft KPIs.
 *
 * To correct one, edit the value below. To withdraw one, delete its entry —
 * the band recomposes on whatever remains.
 */
export interface HomeFigure {
  id: string
  value: string
  label: I18n
  /** Which of the band's five marks is drawn beside the value. */
  icon: "founded" | "solutions" | "countries" | "distributed" | "vision"
}

export const homeFigures: HomeFigure[] = [
  {
    id: "founded",
    value: "2018",
    label: { fr: "Année de création", en: "Founded" },
    icon: "founded",
  },
  {
    id: "solutions",
    value: "6+",
    label: { fr: "Solutions technologiques", en: "Technology solutions" },
    icon: "solutions",
  },
  {
    id: "countries",
    value: "20+",
    label: { fr: "Pays d'activité", en: "Countries of operation" },
    icon: "countries",
  },
  {
    id: "distributed",
    value: "1.2M+",
    label: { fr: "Supports distribués", en: "Units distributed" },
    icon: "distributed",
  },
  {
    id: "vision",
    value: "1 vision",
    label: { fr: "Un impact durable", en: "One lasting impact" },
    icon: "vision",
  },
]

/** The rail set beside the hero, reading down the right edge. */
export const heroRail: I18n[] = [
  { fr: "Afrique", en: "Africa" },
  { fr: "Innovation", en: "Innovation" },
  { fr: "People", en: "People" },
  { fr: "Technologie", en: "Technology" },
  { fr: "Impact", en: "Impact" },
]

/**
 * The six brand cards, in the order of the supplied composition. Copy is the
 * client's own, taken verbatim from that document.
 */
export interface BrandCard {
  brandId: "sydica" | "sytium" | "sydicard" | "kultix" | "syitex" | "rd"
  name: string
  headline: I18n
  footer: I18n
  /** Shown on a product that is not open yet, on every surface it appears on. */
  badge: I18n | null
  href: string | null
}

export const brandCards: BrandCard[] = [
  {
    brandId: "sydica",
    name: "Sydica",
    headline: { fr: "Culture, Créateurs.\nSans frontières.", en: "Culture, Creators.\nWithout borders." },
    footer: {
      fr: "Musique, vidéo, podcast, audiobooks et plus encore.",
      en: "Music, video, podcast, audiobooks and more.",
    },
    badge: null,
    href: "sydica",
  },
  {
    brandId: "sytium",
    name: "Sytium",
    headline: { fr: "Une plateforme.\nToute votre organisation.", en: "One platform.\nYour whole organisation." },
    footer: {
      fr: "ERP, finance, RH, projets, IA et plus encore.",
      en: "ERP, finance, HR, projects, AI and more.",
    },
    badge: null,
    href: "sytium",
  },
  {
    brandId: "sydicard",
    name: "SydiCard",
    headline: { fr: "Vos revenus.\nDe nouvelles opportunités.", en: "Your revenue.\nNew opportunities." },
    footer: {
      fr: "Paiements, wallet et inclusion financière.",
      en: "Payments, wallet and financial inclusion.",
    },
    badge: { fr: "Bientôt disponible", en: "Coming soon" },
    href: "fintech",
  },
  {
    brandId: "kultix",
    name: "KultiX",
    headline: { fr: "Des événements\nplus intelligents.", en: "Smarter\nevents." },
    footer: {
      fr: "Billetterie, accès, analytics et expérience.",
      en: "Ticketing, access, analytics and experience.",
    },
    badge: null,
    href: "kultix",
  },
  {
    brandId: "syitex",
    name: "SyitEx",
    headline: { fr: "Évaluer. Anticiper.\nDécider.", en: "Assess. Anticipate.\nDecide." },
    footer: {
      fr: "Intelligence prédictive pour l'économie culturelle.",
      en: "Predictive intelligence for the cultural economy.",
    },
    badge: null,
    href: null,
  },
  {
    brandId: "rd",
    name: "Syitech R&D",
    headline: { fr: "Explorer aujourd'hui.\nConstruire demain.", en: "Explore today.\nBuild tomorrow." },
    footer: {
      fr: "IA, Blockchain, IoT, Data et innovation appliquée.",
      en: "AI, blockchain, IoT, data and applied innovation.",
    },
    badge: null,
    href: null,
  },
]
