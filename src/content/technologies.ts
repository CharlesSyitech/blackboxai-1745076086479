import type { Technology } from "@/types/content"

export const technologies: Technology[] = [
  {
    id: "ai",
    slug: { fr: "intelligence-artificielle", en: "artificial-intelligence" },
    name: { fr: "Intelligence artificielle", en: "Artificial Intelligence" },
    short: { fr: "Analyse, prévision, automatisation", en: "Analysis, forecasting, automation" },
    description: {
      fr: "L'intelligence artificielle n'est pas une couche décorative de nos produits : elle traite des données métier réelles, à l'intérieur du périmètre autorisé de chaque organisation, pour produire des analyses, des prévisions et des recommandations exploitables.",
      en: "Artificial intelligence is not a decorative layer on our products: it processes real operational data, within each organisation's authorised perimeter, to produce analysis, forecasts and actionable recommendations.",
    },
    applications: [
      {
        context: "business",
        title: { fr: "Aide à la décision", en: "Decision support" },
        body: {
          fr: "Analyse des données financières, commerciales et opérationnelles autorisées, production de synthèses et de prévisions pour les dirigeants.",
          en: "Analysis of authorised financial, commercial and operational data, producing summaries and forecasts for executives.",
        },
      },
      {
        context: "culture",
        title: { fr: "Découverte et recommandation", en: "Discovery and recommendation" },
        body: {
          fr: "Recommandation de contenus culturels, compréhension des catalogues, outils d'accompagnement des créateurs.",
          en: "Cultural content recommendation, catalogue intelligence, creator-facing tooling.",
        },
      },
      {
        context: "operations",
        title: { fr: "Traitement et supervision", en: "Processing and monitoring" },
        body: {
          fr: "Traitement documentaire, contrôle de cohérence, détection d'anomalies et supervision d'exploitation.",
          en: "Document processing, consistency checks, anomaly detection and operational monitoring.",
        },
      },
    ],
    maturity: "production",
  },
  {
    id: "blockchain",
    slug: { fr: "blockchain", en: "blockchain" },
    name: { fr: "Blockchain", en: "Blockchain" },
    short: { fr: "Traçabilité, droits, certification", en: "Traceability, rights, certification" },
    description: {
      fr: "Nous abordons la blockchain comme une infrastructure de preuve et de traçabilité, au service de la gestion des droits, de la certification et de la transparence des échanges — et non comme un instrument spéculatif.",
      en: "We treat blockchain as proof and traceability infrastructure serving rights management, certification and transactional transparency — not as a speculative instrument.",
    },
    applications: [
      {
        context: "culture",
        title: { fr: "Gestion des droits", en: "Rights management" },
        body: {
          fr: "Traçabilité des œuvres, des ayants droit et des usages, pour fiabiliser la répartition des revenus.",
          en: "Traceability of works, rights holders and usage, to make revenue allocation reliable.",
        },
      },
      {
        context: "business",
        title: { fr: "Certification et registres", en: "Certification and registries" },
        body: {
          fr: "Horodatage et certification de documents, registres partagés entre organisations.",
          en: "Document timestamping and certification, shared registries between organisations.",
        },
      },
      {
        context: "operations",
        title: { fr: "Traçabilité opérationnelle", en: "Operational traceability" },
        body: {
          fr: "Suivi de chaînes logistiques et de distribution, avec preuve d'intégrité des étapes.",
          en: "Supply and distribution chain tracking, with integrity proof at each step.",
        },
      },
    ],
    maturity: "pilot",
  },
  {
    id: "data",
    slug: { fr: "data", en: "data" },
    name: { fr: "Data", en: "Data" },
    short: { fr: "Collecte, modélisation, restitution", en: "Collection, modelling, reporting" },
    description: {
      fr: "La donnée est le socle commun de nos plateformes : collecte, normalisation, modélisation et restitution, avec une exigence constante de qualité et de traçabilité des sources.",
      en: "Data is the common foundation of our platforms: collection, normalisation, modelling and reporting, with a constant requirement for quality and source traceability.",
    },
    applications: [
      {
        context: "business",
        title: { fr: "Pilotage et indicateurs", en: "Steering and indicators" },
        body: {
          fr: "Tableaux de bord, indicateurs métier, consolidation multi-entités et reporting financier.",
          en: "Dashboards, business indicators, multi-entity consolidation and financial reporting.",
        },
      },
      {
        context: "culture",
        title: { fr: "Analytics créateurs", en: "Creator analytics" },
        body: {
          fr: "Compréhension des audiences, des usages et des revenus, restituée aux artistes et aux labels.",
          en: "Audience, usage and revenue intelligence, delivered back to artists and labels.",
        },
      },
      {
        context: "operations",
        title: { fr: "Qualité et gouvernance", en: "Quality and governance" },
        body: {
          fr: "Contrôle de la fraîcheur, de la source et de la fiabilité de chaque donnée publiée.",
          en: "Freshness, source and reliability controls on every published figure.",
        },
      },
    ],
    maturity: "production",
  },
  {
    id: "iot",
    slug: { fr: "iot", en: "iot" },
    name: { fr: "IoT", en: "IoT" },
    short: { fr: "Objets connectés et supervision", en: "Connected devices and monitoring" },
    description: {
      fr: "Nos travaux sur l'Internet des objets portent sur la collecte de données terrain, la supervision d'équipements et la connectivité de dispositifs physiques dans des environnements où le réseau n'est pas toujours garanti.",
      en: "Our Internet of Things work covers field data collection, equipment monitoring and physical device connectivity in environments where network coverage cannot be assumed.",
    },
    applications: [
      {
        context: "operations",
        title: { fr: "Supervision de flotte", en: "Fleet monitoring" },
        body: {
          fr: "Suivi de véhicules et d'équipements, remontée d'événements et pilotage opérationnel.",
          en: "Vehicle and equipment tracking, event reporting and operational steering.",
        },
      },
      {
        context: "business",
        title: { fr: "Collecte de données terrain", en: "Field data collection" },
        body: {
          fr: "Capteurs et dispositifs connectés alimentant les tableaux de bord de l'organisation.",
          en: "Sensors and connected devices feeding the organisation's dashboards.",
        },
      },
      {
        context: "culture",
        title: { fr: "Dispositifs hybrides", en: "Hybrid devices" },
        body: {
          fr: "Supports physiques connectés associant distribution hors ligne et services en ligne.",
          en: "Connected physical media combining offline distribution with online services.",
        },
      },
    ],
    maturity: "pilot",
  },
  {
    id: "cloud",
    slug: { fr: "cloud", en: "cloud" },
    name: { fr: "Cloud", en: "Cloud" },
    short: { fr: "Architecture et exploitation", en: "Architecture and operations" },
    description: {
      fr: "Nos plateformes sont conçues pour fonctionner à l'échelle : architecture applicative, hébergement, supervision et continuité de service, avec une attention particulière aux contraintes de connectivité africaines.",
      en: "Our platforms are built to operate at scale: application architecture, hosting, monitoring and service continuity, with particular attention to African connectivity constraints.",
    },
    applications: [
      {
        context: "operations",
        title: { fr: "Exploitation et continuité", en: "Operations and continuity" },
        body: {
          fr: "Supervision, sauvegardes, restauration testée et plans de continuité d'activité.",
          en: "Monitoring, backups, tested restoration and business continuity planning.",
        },
      },
      {
        context: "business",
        title: { fr: "Déploiement multi-organisations", en: "Multi-organisation deployment" },
        body: {
          fr: "Isolation des données par organisation, gestion des rôles et des permissions.",
          en: "Per-organisation data isolation, role and permission management.",
        },
      },
      {
        context: "culture",
        title: { fr: "Diffusion à grande échelle", en: "Large-scale delivery" },
        body: {
          fr: "Distribution de contenus optimisée pour des réseaux mobiles contraints.",
          en: "Content delivery optimised for constrained mobile networks.",
        },
      },
    ],
    maturity: "production",
  },
  {
    id: "security",
    slug: { fr: "securite", en: "security" },
    name: { fr: "Sécurité", en: "Security" },
    short: { fr: "Protection des données et des contenus", en: "Data and content protection" },
    description: {
      fr: "La sécurité couvre l'ensemble de nos produits : protection des données des organisations, sécurisation des contenus distribués physiquement, contrôle des accès et des identités.",
      en: "Security spans all our products: protection of organisational data, securing of physically distributed content, access and identity control.",
    },
    applications: [
      {
        context: "business",
        title: { fr: "Accès et identités", en: "Access and identity" },
        body: {
          fr: "Authentification, gestion fine des permissions et journalisation des accès.",
          en: "Authentication, fine-grained permissions and access logging.",
        },
      },
      {
        context: "culture",
        title: { fr: "Protection des contenus", en: "Content protection" },
        body: {
          fr: "Sécurisation des œuvres distribuées sur support physique et en ligne.",
          en: "Securing of works distributed on physical media and online.",
        },
      },
      {
        context: "operations",
        title: { fr: "Intégrité des dispositifs", en: "Device integrity" },
        body: {
          fr: "Contrôle d'intégrité des supports et des équipements déployés sur le terrain.",
          en: "Integrity control of media and equipment deployed in the field.",
        },
      },
    ],
    maturity: "production",
  },
]

export function technologyById(id: string) {
  return technologies.find((technology) => technology.id === id)
}
