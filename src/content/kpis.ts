import type { Kpi } from "@/types/content"

/**
 * GOVERNANCE — absolute rule.
 * No figure is ever written into a component. Every indicator lives here with
 * `isPublic: false` until Finance and Legal have validated a value, a period
 * and a source. Nothing with `isPublic: false` is served to the client.
 *
 * To publish one: set `value`, `period`, `source`, `lastUpdated`, `approvedBy`,
 * then flip `isPublic` to true. The site picks it up with no code change.
 */
const draft = (
  key: Kpi["key"],
  label: Kpi["label"],
  category: Kpi["category"],
  unit: Kpi["unit"] = "number",
  displayFormat: Kpi["displayFormat"] = "compact",
): Kpi => ({
  key,
  value: null,
  unit,
  displayFormat,
  label,
  category,
  period: null,
  source: null,
  lastUpdated: null,
  isPublic: false,
})

export const kpis: Kpi[] = [
  draft("sydica.users", { fr: "Utilisateurs Sydica", en: "Sydica users" }, "culture"),
  draft("sydica.artists", { fr: "Artistes et labels", en: "Artists and labels" }, "culture"),
  draft("sydica.countries", { fr: "Pays", en: "Countries" }, "culture", "count", "raw"),
  draft("sydica.streams", { fr: "Écoutes cumulées", en: "Cumulative streams" }, "culture"),
  draft("sydica.catalog", { fr: "Titres au catalogue", en: "Catalogue titles" }, "culture"),
  draft("sytium.organizations", { fr: "Organisations sur Sytium", en: "Organisations on Sytium" }, "enterprise", "count", "raw"),
  draft("sytium.users", { fr: "Utilisateurs Sytium", en: "Sytium users" }, "enterprise"),
  draft("usb.cardsDistributed", { fr: "Cartes USB distribuées", en: "USB cards distributed" }, "economic"),
  draft("usb.countries", { fr: "Pays de distribution", en: "Distribution countries" }, "economic", "count", "raw"),
  draft("events.count", { fr: "Événements accompagnés", en: "Events supported" }, "economic", "count", "raw"),
  draft("events.gadjiCeli.attendees", { fr: "Participants", en: "Attendees" }, "economic"),
  draft("group.employees", { fr: "Collaborateurs", en: "Employees" }, "corporate", "count", "raw"),
  draft("group.partners", { fr: "Partenaires", en: "Partners" }, "corporate", "count", "raw"),
  draft("group.offices", { fr: "Implantations", en: "Offices" }, "corporate", "count", "raw"),
  draft("group.years", { fr: "Années d'activité", en: "Years of activity" }, "corporate", "count", "raw"),
  draft("rd.patentsFiled", { fr: "Demandes de brevet déposées", en: "Patent applications filed" }, "technology", "count", "raw"),
  draft("rd.patentsGranted", { fr: "Brevets délivrés", en: "Patents granted" }, "technology", "count", "raw"),
  draft("fintech.transactions", { fr: "Transactions traitées", en: "Transactions processed" }, "economic"),
  draft("impact.organizationsDigitized", { fr: "Organisations numérisées", en: "Organisations digitised" }, "enterprise", "count", "raw"),
  draft("impact.creatorsSupported", { fr: "Créateurs accompagnés", en: "Creators supported" }, "social"),
]

export const homeKpiKeys = ["sydica.users", "usb.cardsDistributed", "sytium.organizations", "group.years"]

export const impactKpiKeys: Record<string, string[]> = {
  culture: ["sydica.artists", "sydica.catalog", "sydica.countries"],
  technology: ["sydica.users", "sytium.users", "rd.patentsGranted"],
  enterprise: ["sytium.organizations", "impact.organizationsDigitized"],
  economic: ["usb.cardsDistributed", "usb.countries", "events.count", "fintech.transactions"],
  social: ["impact.creatorsSupported"],
}
