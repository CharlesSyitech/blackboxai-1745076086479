import type { I18n } from "@/types/content"

export const site = {
  name: "Syitech Group",
  signature: "Technology. Ecosystems. Impact.",
  baseline: {
    fr: "Nous construisons les technologies qui transforment les économies.",
    en: "Building the technologies that transform economies.",
  } satisfies I18n,
  description: {
    fr: "Syitech Group est un groupe technologique africain qui conçoit, développe et déploie les plateformes, infrastructures et technologies qui transforment les entreprises, les industries culturelles et créatives, les services financiers et l'expérience événementielle.",
    en: "Syitech Group is an African technology group that designs, develops and deploys the platforms, infrastructure and technologies transforming companies, cultural and creative industries, financial services and live experiences.",
  } satisfies I18n,
  contact: {
    email: "contact@syitechgroup.com",
    city: { fr: "Abidjan, Côte d'Ivoire", en: "Abidjan, Côte d'Ivoire" } satisfies I18n,
  },
  /** Permanent, non-dismissible. Rendered in the footer and on every FinTech page. */
  regulatoryDisclaimer: {
    fr: "Syitech Group est un fournisseur de technologies. Les services financiers régulés sont fournis par des établissements agréés partenaires. Syitech Group n'est ni une banque, ni un établissement de crédit, ni un établissement de paiement, ni une société de gestion.",
    en: "Syitech Group is a technology provider. Regulated financial services are provided by licensed partner institutions. Syitech Group is not a bank, a credit institution, a payment institution or an asset management company.",
  } satisfies I18n,
}
