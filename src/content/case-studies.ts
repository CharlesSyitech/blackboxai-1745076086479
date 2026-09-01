import type { CaseStudy } from "@/types/content"

export const caseStudies: CaseStudy[] = [
  {
    id: "gadji-celi-le-king-en-fete",
    slug: { fr: "gadji-celi-le-king-en-fete", en: "gadji-celi-le-king-en-fete" },
    title: { fr: "Gadji Celi — Le King en fête", en: "Gadji Celi — Le King en fête" },
    client: { fr: "Production Syitech Group", en: "Syitech Group production" },
    sector: "events",
    date: "2026-04-04",
    location: { fr: "Esplanade du Palais de la Culture, Abidjan", en: "Esplanade du Palais de la Culture, Abidjan" },
    summary: {
      fr: "Une production événementielle intégrale, de la billetterie au contrôle d'accès, opérée par les équipes du Groupe avec ses propres technologies.",
      en: "An end-to-end event production, from ticketing to access control, operated by the Group's teams with its own technologies.",
    },
    challenge: {
      fr: "Un concert de grande envergure impose trois contraintes simultanées : une billetterie qui doit tenir la montée en charge, un contrôle d'accès qui doit fonctionner même lorsque le réseau sature à l'entrée du site, et un pilotage financier qui doit rester traçable du premier billet vendu au bilan de l'événement. Ces trois contraintes se traitent rarement dans un même dispositif.",
      en: "A large-scale concert imposes three simultaneous constraints: ticketing that must absorb peak load, access control that must work even when the network saturates at the gates, and financial steering that must stay traceable from the first ticket sold to the final event review. These three rarely sit within one system.",
    },
    solution: {
      fr: "Syitech Group a assuré la production et l'organisation de l'événement en s'appuyant sur ses propres outils : billetterie digitale et réservation, billets à QR sécurisé, application de scan pour le contrôle d'accès, tableau de bord organisateur pour le suivi des ventes et la coordination des prestataires.",
      en: "Syitech Group delivered the production and organisation of the event using its own tooling: digital ticketing and booking, secure QR tickets, a scanning application for access control, and an organiser dashboard for sales tracking and supplier coordination.",
    },
    implementation: {
      fr: "Le dispositif a été déployé sur site à l'Esplanade du Palais de la Culture d'Abidjan : préparation des points de contrôle, formation des équipes de scan, coordination des prestataires et supervision des flux d'entrée le jour de l'événement. Les équipes techniques du Groupe étaient présentes sur le terrain pendant toute la durée de l'exploitation.",
      en: "The setup was deployed on site at the Esplanade du Palais de la Culture in Abidjan: preparation of control points, training of scanning teams, supplier coordination and supervision of entry flows on the day. The Group's technical teams were present in the field throughout operations.",
    },
    impact: {
      fr: "Le projet démontre une capacité rarement réunie : concevoir la technologie, puis l'exploiter soi-même en conditions réelles. C'est cette continuité entre le produit et le terrain qui distingue l'expertise événementielle du Groupe d'une simple offre logicielle.",
      en: "The project demonstrates a rarely combined capability: designing the technology, then operating it in real conditions. That continuity between product and field is what distinguishes the Group's event expertise from a purely software offering.",
    },
    disciplines: {
      fr: ["Production événementielle", "Organisation", "Billetterie", "Contrôle d'accès", "Coordination", "Technologie", "Expérience public"],
      en: ["Event production", "Organisation", "Ticketing", "Access control", "Coordination", "Technology", "Audience experience"],
    },
    technologies: ["data", "cloud", "security"],
    solutions: ["kultix"],
    expertise: "eventtech",
    /** Attendance figures stay unpublished until officially validated. */
    results: ["events.gadjiCeli.attendees"],
    disclosureLevel: "public",
    clientApprovalRef: "INTERNAL-PRODUCTION",
    featured: true,
  },
]

export const caseStudySectors = ["culture", "enterprise", "events", "public", "technology", "iot"] as const
