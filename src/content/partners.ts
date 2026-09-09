import type { Partner } from "@/types/content"

/**
 * GOVERNANCE — absolute rule.
 * A logo does not qualify a relationship. Every organisation below stays
 * `isPublic: false` until Legal has recorded the exact `relationshipType`,
 * a contract reference and — separately — written approval to use its mark.
 *
 * Entries come from the partner board supplied on 2026-09-09. That board is a
 * working document, not a publication list: it mixes Syitech's own brands,
 * press coverage, accelerator programmes and an internal decision slide.
 * See docs/15 for the triage.
 */

/** Draft entry: recorded, categorised, and deliberately unpublished. */
const draft = (
  id: string,
  partnerName: string,
  category: Partner["category"],
  qualificationNote: string,
): Partner => ({
  id,
  partnerName,
  category,
  relationshipType: null,
  description: null,
  startDate: null,
  endDate: null,
  showAfterEnd: false,
  website: null,
  contractReference: null,
  logoUsageApproved: false,
  legalValidatedBy: null,
  isPublic: false,
  featured: false,
  qualificationNote,
})

const TO_QUALIFY = "Nature de la relation à qualifier, puis autorisation d'usage de marque à obtenir."
const HIGH_RISK = "Marque à très forte protection : usage non autorisé = risque juridique réel, pas un détail éditorial."
const PROGRAMME = "Programme d'accompagnement ou d'accélération. N'est ni un partenariat stratégique ni un investisseur."
const PRESS = "Couverture média. Un média qui parle de vous n'est pas un partenaire : relève d'une rubrique « Ils parlent de nous », pas de la page Partenaires."

export const partners: Partner[] = [
  {
    // Confirmed publishable by Syitech Group on 2026-09-09, corroborated by the
    // official timeline: "2019 — Contrat stratégique avec le BURIDA".
    // Published as text; the logo is NOT, because using BURIDA's mark needs
    // BURIDA's own written approval, which we do not have.
    id: "burida",
    partnerName: "BURIDA",
    category: "culture_music",
    relationshipType: "Strategic Partner",
    description: {
      fr: "Contrat stratégique noué en 2019, dans le prolongement des premières solutions de distribution culturelle du Groupe.",
      en: "Strategic contract signed in 2019, extending the Group's first cultural distribution solutions.",
    },
    startDate: "2019-01-01",
    endDate: null,
    showAfterEnd: false,
    website: null,
    contractReference: null,
    logoUsageApproved: false,
    legalValidatedBy: "Syitech Group — confirmation du 2026-09-09",
    isPublic: true,
    featured: true,
  },

  // ── Culture, musique et industries créatives ──────────────────────────────
  draft("universal-music-africa", "Universal Music Africa", "culture_music", HIGH_RISK),
  draft("sacem", "Sacem", "culture_music", HIGH_RISK),
  draft("nidal-production", "Nidal Production", "culture_music", TO_QUALIFY),
  draft("clape-babiwood", "Clape Babiwood Productions", "culture_music", TO_QUALIFY),
  draft("la-fabrique", "La Fabrique", "culture_music", TO_QUALIFY),
  draft("bock", "Bock", "culture_music", TO_QUALIFY),

  // ── Finance et paiements ──────────────────────────────────────────────────
  draft("visa", "Visa", "finance_payments", HIGH_RISK + " Apparaît sur la planche dans un encart intitulé « Choisir entre VISA et MasterCard ? » : c'est une question interne, pas une relation."),
  draft("mastercard", "Mastercard", "finance_payments", HIGH_RISK + " Même encart de décision interne."),
  draft("wave", "Wave", "finance_payments", TO_QUALIFY),
  draft("mtn-mobile-money", "MTN Mobile Money", "finance_payments", TO_QUALIFY),
  draft("bni", "BNI — Banque Nationale d'Investissement", "finance_payments", TO_QUALIFY),
  draft("afg-bank", "AFG Bank — Atlantic Group", "finance_payments", TO_QUALIFY),
  draft("sa2if", "SA2IF — Société Africaine d'Ingénierie et d'Intermédiation Financières", "finance_payments", TO_QUALIFY),
  draft("max-it", "Max it CI", "finance_payments", TO_QUALIFY),

  // ── Institutions et impact ────────────────────────────────────────────────
  draft("oms", "Organisation mondiale de la Santé", "institutions_social", "Nom et emblème de l'OMS sont protégés par une réglementation internationale spécifique. Publication exclue sans autorisation formelle de l'organisation."),
  draft("ministere-culture-ci", "Ministère de la Culture et de la Francophonie — République de Côte d'Ivoire", "institutions_social", "Emblème d'État. Usage soumis à autorisation administrative expresse."),
  draft("sodepci", "SODEPCI", "institutions_social", TO_QUALIFY),
  draft("cep", "CEP", "institutions_social", TO_QUALIFY),

  // ── Technologie, distribution et grands comptes ───────────────────────────
  draft("carrefour-ci", "Carrefour Côte d'Ivoire", "technology_innovation", HIGH_RISK),
  draft("cfao", "CFAO", "technology_innovation", HIGH_RISK),
  draft("nci", "NCI", "technology_innovation", TO_QUALIFY),
  draft("terrabo", "Terrabo", "technology_innovation", TO_QUALIFY),

  // ── Recherche, éducation et programmes ────────────────────────────────────
  draft("2n-academy", "2N Academy", "research_education", TO_QUALIFY),
  draft("kedge", "KEDGE Business School", "research_education", PROGRAMME),
  draft("vades", "VH Vades", "research_education", TO_QUALIFY),

  // ── Écosystème international et accélération ──────────────────────────────
  draft("business-france", "Business France", "international_ecosystem", PROGRAMME),
  draft("marseille-innovation", "Marseille Innovation", "international_ecosystem", PROGRAMME),
  draft("accelerateur-m", "Accélérateur M", "international_ecosystem", PROGRAMME),
  draft("anima", "ANIMA Investment Network", "international_ecosystem", PROGRAMME),
  draft("metropole-amp", "La Métropole Aix-Marseille-Provence", "international_ecosystem", PROGRAMME),
  draft("eurobiomed", "Eurobiomed", "international_ecosystem", "Pôle de compétitivité santé. Rattaché à l'écosystème d'innovation, avec les autres acteurs marseillais de la planche — catégorisation à confirmer."),
]

/**
 * Media outlets from the right-hand block of the supplied board. They are kept
 * out of `partners` on purpose: press coverage is not a partnership, and
 * listing a newsroom as a partner misrepresents both sides. If the Group wants
 * to show this, it belongs in a distinct "Ils parlent de nous" section with
 * dated article links.
 */
export const pressCoverage: { name: string; note: string }[] = [
  "RTI", "Fraternité Matin", "Africa Radio", "Life TV", "Life Radio 107.7", "Life Mag",
  "La 3", "L'Inter", "Soir Info", "L'Intelligent d'Abidjan", "Linfodrome", "AIP — Agence Ivoirienne de Presse",
  "Business 24", "Dékalé Mag", "My Afro Culture", "J'aime CIV", "4 Ivoire", "Strat'Marques",
  "Iris Médias", "Kpolé.com", "Bidjan.net", "Hits2Club", "First", "Media Prime", "Lol.com", "Reflet TV",
  "Fréquence",
].map((name) => ({ name, note: PRESS }))

export const partnerCategoryOrder: Partner["category"][] = [
  "culture_music",
  "finance_payments",
  "institutions_social",
  "technology_innovation",
  "research_education",
  "international_ecosystem",
]
