import type { Expertise } from "@/types/content"

export const expertises: Expertise[] = [
  {
    id: "digital-transformation",
    slug: { fr: "transformation-numerique", en: "digital-transformation" },
    name: { fr: "Transformation numérique", en: "Digital Transformation" },
    tagline: {
      fr: "Structurer, outiller et piloter la transformation des organisations.",
      en: "Structuring, equipping and steering organisational transformation.",
    },
    challenge: {
      fr: "La transformation numérique échoue rarement pour des raisons techniques. Elle échoue lorsque les outils ne correspondent pas aux processus réels, aux référentiels comptables applicables ou aux conditions d'exploitation du terrain. Notre approche part de l'organisation, pas du logiciel.",
      en: "Digital transformation rarely fails for technical reasons. It fails when tools do not match real processes, applicable accounting frameworks or field operating conditions. Our approach starts with the organisation, not the software.",
    },
    capabilities: {
      fr: [
        "Cadrage et audit des processus existants",
        "Conception de systèmes d'information intégrés",
        "Déploiement et conduite du changement",
        "Reprise et fiabilisation des données",
        "Formation et accompagnement des équipes",
        "Support et maintien en conditions opérationnelles",
      ],
      en: [
        "Framing and audit of existing processes",
        "Design of integrated information systems",
        "Deployment and change management",
        "Data migration and quality assurance",
        "Team training and support",
        "Ongoing operational support",
      ],
    },
    technologies: ["data", "ai", "cloud", "security"],
    solutions: ["sytium"],
    order: 1,
  },
  {
    id: "culture-entertainment",
    slug: { fr: "culture-entertainment", en: "culture-entertainment" },
    name: { fr: "Culture & Entertainment", en: "Culture & Entertainment" },
    tagline: {
      fr: "Une infrastructure numérique pour les industries culturelles et créatives.",
      en: "Digital infrastructure for cultural and creative industries.",
    },
    challenge: {
      fr: "Les créateurs africains produisent des œuvres dont la distribution, la monétisation et la gestion des droits restent largement dépendantes d'infrastructures conçues ailleurs. Construire cette infrastructure localement change la répartition de la valeur.",
      en: "African creators produce works whose distribution, monetisation and rights management still depend largely on infrastructure designed elsewhere. Building that infrastructure locally changes how value is shared.",
    },
    capabilities: {
      fr: [
        "Streaming et distribution de contenus",
        "Monétisation et reversement aux créateurs",
        "Gestion des artistes et des labels",
        "Technologies de gestion des droits",
        "Analytics d'audience et de revenus",
        "Expérience hors ligne et distribution physique",
      ],
      en: [
        "Streaming and content distribution",
        "Creator monetisation and payouts",
        "Artist and label management",
        "Rights management technology",
        "Audience and revenue analytics",
        "Offline experience and physical distribution",
      ],
    },
    technologies: ["ai", "data", "blockchain", "cloud"],
    solutions: ["sydica", "secure-usb"],
    order: 2,
  },
  {
    id: "enterprise-technology",
    slug: { fr: "enterprise-technology", en: "enterprise-technology" },
    name: { fr: "Enterprise Technology", en: "Enterprise Technology" },
    tagline: {
      fr: "Une plateforme intégrée pour gérer l'ensemble d'une organisation.",
      en: "One integrated platform to run an entire organisation.",
    },
    challenge: {
      fr: "La plupart des organisations de la région fonctionnent avec des outils dispersés : une comptabilité d'un côté, la paie de l'autre, des tableurs partout. Les référentiels applicables — SYSCOHADA, IFRS — sont rarement pris en charge nativement par les solutions internationales.",
      en: "Most organisations in the region run on scattered tools: accounting on one side, payroll on the other, spreadsheets everywhere. Applicable frameworks — SYSCOHADA, IFRS — are rarely natively supported by international solutions.",
    },
    capabilities: {
      fr: [
        "Finance, comptabilité et trésorerie",
        "Ressources humaines et paie",
        "Commercial, CRM et facturation",
        "Gestion de projets et de portefeuilles",
        "Achats, fournisseurs et logistique",
        "Business Intelligence et reporting",
      ],
      en: [
        "Finance, accounting and treasury",
        "Human resources and payroll",
        "Sales, CRM and invoicing",
        "Project and portfolio management",
        "Procurement, suppliers and logistics",
        "Business intelligence and reporting",
      ],
    },
    technologies: ["data", "ai", "cloud", "security"],
    solutions: ["sytium"],
    order: 3,
  },
  {
    id: "fintech",
    slug: { fr: "fintech-inclusion-financiere", en: "fintech-financial-inclusion" },
    name: { fr: "FinTech & Inclusion financière", en: "FinTech & Financial Inclusion" },
    tagline: {
      fr: "Relier les revenus de l'économie créative aux services financiers.",
      en: "Connecting creative-economy income to financial services.",
    },
    challenge: {
      fr: "Percevoir un revenu ne suffit pas : encore faut-il pouvoir le recevoir, le conserver, le dépenser et le projeter. Entre le paiement d'un créateur et l'accès à un service financier, il manque une infrastructure. Nous construisons cette infrastructure technologique — les services régulés relèvent d'établissements agréés.",
      en: "Earning income is not enough: it must be received, held, spent and projected. Between paying a creator and accessing a financial service, infrastructure is missing. We build that technology layer — regulated services are provided by licensed institutions.",
    },
    capabilities: {
      fr: [
        "Infrastructure de paiement et de transfert",
        "Portefeuille numérique",
        "Reversement aux créateurs",
        "Technologies de cartes",
        "Connectivité mobile money",
        "Éducation et inclusion financières",
      ],
      en: [
        "Payment and transfer infrastructure",
        "Digital wallet",
        "Creator payouts",
        "Card technologies",
        "Mobile money connectivity",
        "Financial education and inclusion",
      ],
    },
    technologies: ["security", "data", "cloud", "blockchain"],
    solutions: ["fintech"],
    order: 4,
  },
  {
    id: "eventtech",
    slug: { fr: "eventtech-evenementiel", en: "eventtech-live-experiences" },
    name: { fr: "EventTech & Événementiel", en: "EventTech & Live Experiences" },
    tagline: {
      fr: "De la technologie de billetterie à la production sur le terrain.",
      en: "From ticketing technology to on-site production.",
    },
    challenge: {
      fr: "Un événement ne se joue pas dans un logiciel. Il se joue sur le terrain : file d'attente, réseau instable, contrôle d'accès, flux financiers à sécuriser. Nous concevons la technologie et nous l'exploitons nous-mêmes en conditions réelles.",
      en: "An event does not happen inside software. It happens in the field: queues, unstable networks, access control, financial flows to secure. We design the technology and operate it ourselves in real conditions.",
    },
    capabilities: {
      fr: [
        "Billetterie digitale et réservation",
        "Contrôle d'accès et application de scan",
        "Production et organisation d'événements",
        "Pilotage financier et reporting",
        "Expérience spectateur",
        "Coordination des prestataires",
      ],
      en: [
        "Digital ticketing and booking",
        "Access control and scanning application",
        "Event production and organisation",
        "Financial steering and reporting",
        "Audience experience",
        "Supplier coordination",
      ],
    },
    technologies: ["data", "cloud", "security"],
    solutions: ["kultix"],
    order: 5,
  },
  {
    id: "hardware-iot",
    slug: { fr: "hardware-iot", en: "hardware-iot" },
    name: { fr: "Hardware & IoT", en: "Hardware & IoT" },
    tagline: {
      fr: "Quand la distribution physique complète l'infrastructure numérique.",
      en: "Where physical distribution completes digital infrastructure.",
    },
    challenge: {
      fr: "Une part importante des publics visés ne dispose pas d'une connexion continue et abordable. Concevoir uniquement pour le tout-en-ligne revient à exclure. Le support physique sécurisé et les dispositifs connectés répondent à cette réalité.",
      en: "A significant share of target audiences has no continuous, affordable connection. Designing for online-only means excluding them. Secure physical media and connected devices answer that reality.",
    },
    capabilities: {
      fr: [
        "Cartes USB sécurisées",
        "Distribution de contenus hors ligne",
        "Dispositifs connectés",
        "Supervision de flotte",
        "Collecte de données terrain",
        "Personnalisation et production de supports",
      ],
      en: [
        "Secure USB cards",
        "Offline content distribution",
        "Connected devices",
        "Fleet monitoring",
        "Field data collection",
        "Media personalisation and production",
      ],
    },
    technologies: ["iot", "security", "data"],
    solutions: ["secure-usb", "usb-connect", "iot"],
    order: 6,
  },
  {
    id: "ai-blockchain-data",
    slug: { fr: "ai-blockchain-data", en: "ai-blockchain-data" },
    name: { fr: "AI, Blockchain & Data", en: "AI, Blockchain & Data" },
    tagline: {
      fr: "Le socle technologique transverse de toutes nos solutions.",
      en: "The technology foundation shared by every solution.",
    },
    challenge: {
      fr: "Ces technologies ne valent que par leurs usages. Nous les développons à l'intérieur de nos produits, sur des données réelles, pour des résultats mesurables — pas comme un discours d'accompagnement.",
      en: "These technologies matter only through their uses. We develop them inside our products, on real data, for measurable outcomes — not as accompanying discourse.",
    },
    capabilities: {
      fr: [
        "Analyse et prévision",
        "Automatisation de traitements",
        "Recommandation et découverte",
        "Traçabilité et certification",
        "Gestion des droits",
        "Gouvernance de la donnée",
      ],
      en: [
        "Analysis and forecasting",
        "Process automation",
        "Recommendation and discovery",
        "Traceability and certification",
        "Rights management",
        "Data governance",
      ],
    },
    technologies: ["ai", "blockchain", "data", "security"],
    solutions: ["sytium", "sydica"],
    order: 7,
  },
  {
    id: "research-development",
    slug: { fr: "recherche-developpement", en: "research-development" },
    name: { fr: "Recherche & Développement", en: "Research & Development" },
    tagline: {
      fr: "Des problématiques africaines vers des technologies transposables.",
      en: "From African challenges to transferable technologies.",
    },
    challenge: {
      fr: "Les contraintes que nous rencontrons — connectivité intermittente, référentiels comptables spécifiques, distribution hors ligne, inclusion financière — ne sont pas des limites : ce sont des sujets de recherche appliquée dont les réponses sont transposables à d'autres marchés.",
      en: "The constraints we face — intermittent connectivity, specific accounting frameworks, offline distribution, financial inclusion — are not limitations: they are applied research topics whose answers transfer to other markets.",
    },
    capabilities: {
      fr: [
        "Recherche appliquée",
        "Innovation produit",
        "Collaborations académiques",
        "Propriété intellectuelle",
        "Technologies émergentes",
        "Programmes d'innovation",
      ],
      en: [
        "Applied research",
        "Product innovation",
        "Academic collaboration",
        "Intellectual property",
        "Emerging technologies",
        "Innovation programmes",
      ],
    },
    technologies: ["ai", "blockchain", "iot", "data"],
    solutions: [],
    order: 8,
  },
]

export function expertiseById(id: string) {
  return expertises.find((expertise) => expertise.id === id)
}
