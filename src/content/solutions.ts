import type { Solution } from "@/types/content"

export const solutions: Solution[] = [
  {
    id: "sytium",
    slug: { fr: "sytium", en: "sytium" },
    name: "Sytium",
    vertical: "Enterprise Technology",
    accent: "navy",
    positioning: {
      fr: "Une plateforme intelligente pour piloter toute votre organisation.",
      en: "One intelligent platform to manage your entire organisation.",
    },
    tagline: {
      fr: "ERP et SaaS de gestion intégrée : finance, ressources humaines, commercial, projets, achats, décisionnel.",
      en: "Integrated ERP and SaaS management: finance, HR, sales, projects, procurement, business intelligence.",
    },
    problem: {
      fr: [
        "Une comptabilité, une paie et un suivi commercial gérés dans trois outils qui ne se parlent pas.",
        "Des référentiels SYSCOHADA et IFRS mal pris en charge par les solutions internationales.",
        "Des données de terrain — présence, activité, dépenses — qui remontent trop tard pour décider.",
      ],
      en: [
        "Accounting, payroll and sales tracking split across three systems that do not talk to each other.",
        "SYSCOHADA and IFRS frameworks poorly supported by international solutions.",
        "Field data — attendance, activity, spending — arriving too late to inform decisions.",
      ],
    },
    answer: {
      fr: [
        "Un référentiel unique : les écritures, les salariés, les clients et les projets partagent la même base.",
        "Une comptabilité conçue pour les référentiels applicables, jusqu'aux états financiers.",
        "Une application mobile qui rapproche le terrain du système de gestion, en temps réel.",
      ],
      en: [
        "A single source of truth: entries, employees, customers and projects share one database.",
        "Accounting designed for the applicable frameworks, through to financial statements.",
        "A mobile application that brings the field into the management system, in real time.",
      ],
    },
    universes: [
      {
        key: "finance",
        title: { fr: "Finance & Comptabilité", en: "Finance & Accounting" },
        description: {
          fr: "De la saisie comptable aux états financiers, avec la gestion budgétaire, la trésorerie et le suivi des tiers.",
          en: "From bookkeeping to financial statements, with budgeting, treasury and third-party management.",
        },
        features: {
          fr: ["Gestion budgétaire", "Comptabilité générale", "Comptabilité analytique", "SYSCOHADA", "IFRS", "États financiers", "Trésorerie et banque", "Créances et dettes", "Emprunts", "Achats et facturation", "Encaissements et décaissements", "Reporting financier"],
          en: ["Budget management", "General ledger", "Cost accounting", "SYSCOHADA", "IFRS", "Financial statements", "Treasury and banking", "Receivables and payables", "Loans", "Purchasing and invoicing", "Collections and disbursements", "Financial reporting"],
        },
        maturity: "live",
      },
      {
        key: "hr",
        title: { fr: "Ressources humaines", en: "Human Resources" },
        description: {
          fr: "Le dossier salarié, la paie et le temps de travail dans un même système, alimentés par le terrain.",
          en: "Employee records, payroll and working time in one system, fed from the field.",
        },
        features: {
          fr: ["Dossiers salariés", "Paie", "Pointage géolocalisé", "Demandes de permission", "Recrutement", "Documents RH", "Temps de travail", "Sondages internes", "To-do et suivi"],
          en: ["Employee records", "Payroll", "Geolocated attendance", "Leave requests", "Recruitment", "HR documents", "Working time", "Internal surveys", "To-do and follow-up"],
        },
        maturity: "live",
      },
      {
        key: "crm",
        title: { fr: "Commercial & CRM", en: "Sales & CRM" },
        description: {
          fr: "Du prospect à l'encaissement, sans rupture entre le suivi commercial et la comptabilité.",
          en: "From prospect to payment, with no break between sales tracking and accounting.",
        },
        features: {
          fr: ["Prospects", "Clients", "Ventes", "Commandes", "Facturation", "Encaissements", "Suivi commercial"],
          en: ["Prospects", "Customers", "Sales", "Orders", "Invoicing", "Collections", "Sales pipeline"],
        },
        maturity: "live",
      },
      {
        key: "projects",
        title: { fr: "Projets", en: "Projects" },
        description: {
          fr: "Planification, budgets et équipes reliés aux écritures réelles du projet.",
          en: "Planning, budgets and teams connected to the project's actual entries.",
        },
        features: {
          fr: ["Planification", "Budgets de projet", "Équipes", "Tâches", "Suivi de performance"],
          en: ["Planning", "Project budgets", "Teams", "Tasks", "Performance tracking"],
        },
        maturity: "live",
      },
      {
        key: "procurement",
        title: { fr: "Achats & Logistique", en: "Procurement & Logistics" },
        description: {
          fr: "Le cycle achat complet, du besoin exprimé à la livraison réceptionnée.",
          en: "The full purchasing cycle, from expressed need to received delivery.",
        },
        features: {
          fr: ["Achats", "Fournisseurs", "Bons de commande", "Logistique", "Livraisons"],
          en: ["Purchasing", "Suppliers", "Purchase orders", "Logistics", "Deliveries"],
        },
        maturity: "live",
      },
      {
        key: "business-plan",
        title: { fr: "Business Plan", en: "Business Plan" },
        description: {
          fr: "Création assistée de business plans, de prévisions financières et de documents professionnels.",
          en: "Assisted creation of business plans, financial forecasts and professional documents.",
        },
        features: {
          fr: ["Business plan assisté", "Prévisions financières", "Documents professionnels"],
          en: ["Assisted business plan", "Financial forecasts", "Professional documents"],
        },
        maturity: "live",
      },
      {
        key: "bi",
        title: { fr: "Business Intelligence", en: "Business Intelligence" },
        description: {
          fr: "Les indicateurs de l'organisation, construits sur les données du système et non ressaisis.",
          en: "Organisational indicators built on system data rather than re-keyed.",
        },
        features: {
          fr: ["Indicateurs clés", "Tableaux de bord", "Analytics", "Rapports"],
          en: ["Key indicators", "Dashboards", "Analytics", "Reports"],
        },
        maturity: "live",
      },
      {
        key: "ai",
        title: { fr: "Assistant IA", en: "AI Assistant" },
        description: {
          fr: "Une assistance à l'analyse et à la décision, strictement limitée aux données autorisées de l'organisation.",
          en: "Analysis and decision support, strictly limited to the organisation's authorised data.",
        },
        features: {
          fr: ["Analyse des données autorisées", "Synthèses", "Aide à la décision"],
          en: ["Analysis of authorised data", "Summaries", "Decision support"],
        },
        maturity: "beta",
      },
      {
        key: "mobile",
        title: { fr: "Mobile", en: "Mobile" },
        description: {
          fr: "L'application des dirigeants et des collaborateurs : le terrain entre dans le système de gestion.",
          en: "The application for executives and staff: the field enters the management system.",
        },
        features: {
          fr: ["Pointage géolocalisé", "Présence en temps réel", "Informations RH", "Demandes de permission", "Accès aux données autorisées", "Statistiques"],
          en: ["Geolocated attendance", "Real-time presence", "HR information", "Leave requests", "Access to authorised data", "Statistics"],
        },
        maturity: "live",
      },
      {
        key: "collaboration",
        title: { fr: "Collaboration", en: "Collaboration" },
        description: {
          fr: "Messagerie professionnelle et communication d'équipe intégrées au système de gestion.",
          en: "Professional messaging and team communication integrated with the management system.",
        },
        features: {
          fr: ["Messagerie professionnelle", "Appels", "Historique des échanges", "Transcription", "Synthèses assistées"],
          en: ["Professional messaging", "Calls", "Conversation history", "Transcription", "Assisted summaries"],
        },
        maturity: "roadmap",
      },
    ],
    useCases: [
      {
        sector: { fr: "Entreprises et groupes", en: "Companies and groups" },
        body: {
          fr: "Consolidation multi-entités, comptabilité analytique et pilotage budgétaire dans un référentiel unique.",
          en: "Multi-entity consolidation, cost accounting and budget steering in a single framework.",
        },
      },
      {
        sector: { fr: "Institutions et organisations", en: "Institutions and organisations" },
        body: {
          fr: "Traçabilité des engagements, gestion documentaire et reporting normalisé.",
          en: "Commitment traceability, document management and standardised reporting.",
        },
      },
      {
        sector: { fr: "PME en structuration", en: "Growing SMEs" },
        body: {
          fr: "Sortie des tableurs vers un système unique, avec reprise des données existantes.",
          en: "Moving from spreadsheets to a single system, with migration of existing data.",
        },
      },
    ],
    technologies: ["data", "ai", "cloud", "security"],
    expertise: "enterprise-technology",
    kpis: ["sytium.organizations", "sytium.users"],
    regulatoryStatus: "not_applicable",
    licenseReference: null,
    ctaPrimary: { fr: "Demander une démonstration", en: "Request a demo" },
    ctaSecondary: { fr: "Voir les modules", en: "See the modules" },
    order: 1,
    featuredOnHome: true,
  },
  {
    id: "sydica",
    slug: { fr: "sydica", en: "sydica" },
    name: "Sydica",
    vertical: "CultTech",
    accent: "amber",
    positioning: {
      fr: "La technologie au service des créateurs africains.",
      en: "Technology empowering African creators.",
    },
    tagline: {
      fr: "Un écosystème culturel numérique : diffusion, monétisation, gestion des artistes et des labels, analytics.",
      en: "A digital cultural ecosystem: distribution, monetisation, artist and label management, analytics.",
    },
    problem: {
      fr: [
        "Des œuvres largement écoutées dont les revenus échappent en grande partie à leurs créateurs.",
        "Des catalogues dispersés, sans outil unifié de gestion des droits et des ayants droit.",
        "Des publics dont la connectivité ne permet pas une écoute exclusivement en ligne.",
      ],
      en: [
        "Widely heard works whose revenue largely escapes their creators.",
        "Scattered catalogues with no unified rights and rights-holder management tooling.",
        "Audiences whose connectivity does not allow online-only listening.",
      ],
    },
    answer: {
      fr: [
        "Une plateforme de diffusion pensée pour les réseaux et les usages réels du continent.",
        "Des outils de gestion pour les artistes, les labels et leurs catalogues.",
        "Une continuité entre l'écoute en ligne et la distribution physique sécurisée.",
      ],
      en: [
        "A distribution platform designed for the continent's real networks and usage patterns.",
        "Management tooling for artists, labels and their catalogues.",
        "Continuity between online listening and secure physical distribution.",
      ],
    },
    universes: [
      {
        key: "streaming",
        title: { fr: "Diffusion", en: "Streaming" },
        description: {
          fr: "Musique, vidéo, podcast, livres audio et contenus culturels sur une même plateforme.",
          en: "Music, video, podcast, audiobooks and cultural content on a single platform.",
        },
        features: {
          fr: ["Musique", "Vidéo", "Podcast", "Livres audio", "Contenus culturels", "Expérience hors ligne"],
          en: ["Music", "Video", "Podcast", "Audiobooks", "Cultural content", "Offline experience"],
        },
        maturity: "live",
      },
      {
        key: "creators",
        title: { fr: "Créateurs", en: "Creators" },
        description: {
          fr: "Monétisation, suivi des revenus et outils de production pour les artistes et les labels.",
          en: "Monetisation, revenue tracking and production tooling for artists and labels.",
        },
        features: {
          fr: ["Monétisation", "Gestion des artistes", "Gestion des labels", "Sydica Studio", "Suivi des revenus"],
          en: ["Monetisation", "Artist management", "Label management", "Sydica Studio", "Revenue tracking"],
        },
        maturity: "live",
      },
      {
        key: "analytics",
        title: { fr: "Analytics & Découverte", en: "Analytics & Discovery" },
        description: {
          fr: "Comprendre les audiences et faire circuler les catalogues au-delà des artistes déjà installés.",
          en: "Understanding audiences and circulating catalogues beyond already-established artists.",
        },
        features: {
          fr: ["Analytics d'audience", "Analytics de revenus", "Recommandation", "Découverte assistée"],
          en: ["Audience analytics", "Revenue analytics", "Recommendation", "Assisted discovery"],
        },
        maturity: "live",
      },
    ],
    useCases: [
      {
        sector: { fr: "Artistes indépendants", en: "Independent artists" },
        body: {
          fr: "Distribution, suivi d'audience et monétisation sans intermédiaire imposé.",
          en: "Distribution, audience tracking and monetisation without an imposed intermediary.",
        },
      },
      {
        sector: { fr: "Labels et producteurs", en: "Labels and producers" },
        body: {
          fr: "Gestion de catalogue, suivi des ayants droit et reporting consolidé.",
          en: "Catalogue management, rights-holder tracking and consolidated reporting.",
        },
      },
      {
        sector: { fr: "Institutions culturelles", en: "Cultural institutions" },
        body: {
          fr: "Diffusion de fonds culturels et de contenus patrimoniaux, en ligne et hors ligne.",
          en: "Distribution of cultural and heritage collections, online and offline.",
        },
      },
    ],
    technologies: ["ai", "data", "blockchain", "cloud"],
    expertise: "culture-entertainment",
    kpis: ["sydica.users", "sydica.artists", "sydica.countries", "sydica.streams"],
    regulatoryStatus: "not_applicable",
    licenseReference: null,
    ctaPrimary: { fr: "Découvrir Sydica", en: "Discover Sydica" },
    ctaSecondary: { fr: "Artistes & Labels", en: "Artists & Labels" },
    order: 2,
    featuredOnHome: true,
  },
  {
    id: "kultix",
    slug: { fr: "kultix", en: "kultix" },
    name: "KultiX",
    vertical: "EventTech",
    accent: "teal",
    positioning: {
      fr: "Une billetterie plus intelligente. De meilleurs événements.",
      en: "Smarter ticketing. Better events.",
    },
    tagline: {
      fr: "Billetterie digitale, contrôle d'accès et pilotage financier pour les organisateurs d'événements.",
      en: "Digital ticketing, access control and financial steering for event organisers.",
    },
    problem: {
      fr: [
        "Des billetteries qui tiennent en salle mais pas à l'entrée, quand le réseau sature.",
        "Aucune visibilité en temps réel sur les ventes et les entrées le jour J.",
        "Des flux financiers difficiles à réconcilier après l'événement.",
      ],
      en: [
        "Ticketing that holds up in the venue but not at the gate, when the network saturates.",
        "No real-time visibility on sales and entries on the day.",
        "Financial flows that are hard to reconcile after the event.",
      ],
    },
    answer: {
      fr: [
        "Un billet à QR sécurisé et une application de scan conçue pour fonctionner en conditions dégradées.",
        "Un tableau de bord organisateur : ventes, entrées, prestataires, recettes.",
        "Un reporting financier disponible dès la fin de l'événement.",
      ],
      en: [
        "A secure QR ticket and a scanning application designed to work in degraded conditions.",
        "An organiser dashboard: sales, entries, suppliers, revenue.",
        "Financial reporting available as soon as the event ends.",
      ],
    },
    universes: [
      {
        key: "create",
        title: { fr: "Créer", en: "Create" },
        description: { fr: "Configuration de l'événement, des catégories de billets et des tarifs.", en: "Event, ticket category and pricing setup." },
        features: { fr: ["Création d'événement", "Catégories de billets", "Tarification", "Quotas"], en: ["Event creation", "Ticket categories", "Pricing", "Quotas"] },
        maturity: "live",
      },
      {
        key: "sell",
        title: { fr: "Vendre", en: "Sell" },
        description: { fr: "Vente en ligne, réservation et suivi des ventes en temps réel.", en: "Online sales, booking and real-time sales tracking." },
        features: { fr: ["Billetterie en ligne", "Réservation", "Suivi des ventes", "Points de vente"], en: ["Online ticketing", "Booking", "Sales tracking", "Points of sale"] },
        maturity: "live",
      },
      {
        key: "access",
        title: { fr: "Contrôler", en: "Access" },
        description: { fr: "QR sécurisé, application de scan et contrôle des flux d'entrée.", en: "Secure QR, scanning application and entry flow control." },
        features: { fr: ["QR sécurisé", "Application de scan", "Contrôle d'accès", "Gestion des files"], en: ["Secure QR", "Scanning application", "Access control", "Queue management"] },
        maturity: "live",
      },
      {
        key: "manage",
        title: { fr: "Piloter", en: "Manage" },
        description: { fr: "Tableau de bord organisateur, prestataires et coordination le jour J.", en: "Organiser dashboard, suppliers and day-of coordination." },
        features: { fr: ["Tableau de bord", "Gestion des prestataires", "Coordination", "Droits d'accès"], en: ["Dashboard", "Supplier management", "Coordination", "Access rights"] },
        maturity: "live",
      },
      {
        key: "analyze",
        title: { fr: "Analyser", en: "Analyze" },
        description: { fr: "Analytics de fréquentation et reporting financier post-événement.", en: "Attendance analytics and post-event financial reporting." },
        features: { fr: ["Analytics", "Reporting financier", "Bilan d'événement"], en: ["Analytics", "Financial reporting", "Event review"] },
        maturity: "live",
      },
    ],
    useCases: [
      { sector: { fr: "Concerts et spectacles", en: "Concerts and shows" }, body: { fr: "Billetterie grand public, contrôle d'accès à forte affluence, pilotage des recettes.", en: "Consumer ticketing, high-volume access control, revenue steering." } },
      { sector: { fr: "Conférences et salons", en: "Conferences and trade shows" }, body: { fr: "Inscriptions, badges, contrôle d'accès par session et suivi des participants.", en: "Registration, badges, per-session access control and attendee tracking." } },
      { sector: { fr: "Événements institutionnels", en: "Institutional events" }, body: { fr: "Invitations nominatives, accréditations et traçabilité des accès.", en: "Named invitations, accreditation and access traceability." } },
    ],
    technologies: ["data", "cloud", "security"],
    expertise: "eventtech",
    kpis: ["events.count"],
    regulatoryStatus: "not_applicable",
    licenseReference: null,
    ctaPrimary: { fr: "Découvrir KultiX", en: "Discover KultiX" },
    ctaSecondary: { fr: "Organiser un événement", en: "Organise an event" },
    order: 3,
    featuredOnHome: true,
  },
  {
    id: "fintech",
    slug: { fr: "fintech", en: "fintech" },
    name: "FinTech / SydiCard",
    vertical: "FinTech",
    accent: "navy",
    positioning: {
      fr: "Des revenus créatifs vers l'opportunité financière.",
      en: "From creative income to financial opportunity.",
    },
    tagline: {
      fr: "L'infrastructure technologique qui relie revenus, portefeuille, paiement et services financiers.",
      en: "The technology layer connecting income, wallet, payment and financial services.",
    },
    problem: {
      fr: [
        "Un créateur peut être payé sans pour autant accéder à un service financier.",
        "Les flux entre plateformes, mobile money et établissements financiers restent fragmentés.",
        "L'inclusion financière suppose une infrastructure, pas seulement une offre commerciale.",
      ],
      en: [
        "A creator can be paid without gaining access to a financial service.",
        "Flows between platforms, mobile money and financial institutions remain fragmented.",
        "Financial inclusion requires infrastructure, not just a commercial offer.",
      ],
    },
    answer: {
      fr: [
        "Une infrastructure de paiement et de reversement conçue pour l'économie créative.",
        "Une connectivité avec les opérateurs de mobile money et les établissements agréés.",
        "Un parcours progressif, où chaque étape dépend de la disponibilité réglementaire.",
      ],
      en: [
        "Payment and payout infrastructure designed for the creative economy.",
        "Connectivity with mobile money operators and licensed institutions.",
        "A progressive journey where each step depends on regulatory availability.",
      ],
    },
    universes: [
      {
        key: "payments",
        title: { fr: "Paiements & Reversements", en: "Payments & Payouts" },
        description: { fr: "Encaissement, reversement aux créateurs et transferts, opérés avec des partenaires agréés.", en: "Collection, creator payouts and transfers, operated with licensed partners." },
        features: { fr: ["Paiements", "Reversements créateurs", "Transferts", "Connectivité mobile money"], en: ["Payments", "Creator payouts", "Transfers", "Mobile money connectivity"] },
        maturity: "live",
      },
      {
        key: "wallet",
        title: { fr: "Portefeuille & Cartes", en: "Wallet & Cards" },
        description: { fr: "Technologies de portefeuille numérique et de cartes, sous réserve de disponibilité réglementaire.", en: "Digital wallet and card technologies, subject to regulatory availability." },
        features: { fr: ["Portefeuille numérique", "Technologies de cartes", "Gestion des soldes"], en: ["Digital wallet", "Card technologies", "Balance management"] },
        maturity: "beta",
      },
      {
        key: "inclusion",
        title: { fr: "Inclusion financière", en: "Financial Inclusion" },
        description: { fr: "Éducation financière et parcours d'accès aux services d'épargne, de protection et d'investissement proposés par des établissements agréés.", en: "Financial education and access pathways to savings, protection and investment services offered by licensed institutions." },
        features: { fr: ["Éducation financière", "Parcours d'épargne", "Accès aux services de protection", "Orientation vers l'investissement"], en: ["Financial education", "Savings pathways", "Access to protection services", "Investment orientation"] },
        maturity: "roadmap",
      },
    ],
    useCases: [
      { sector: { fr: "Économie créative", en: "Creative economy" }, body: { fr: "Reversement des revenus de diffusion vers des moyens de paiement utilisables localement.", en: "Routing distribution revenue to locally usable payment methods." } },
      { sector: { fr: "Plateformes et places de marché", en: "Platforms and marketplaces" }, body: { fr: "Infrastructure de paiement et de reversement pour des flux multi-bénéficiaires.", en: "Payment and payout infrastructure for multi-beneficiary flows." } },
    ],
    technologies: ["security", "data", "cloud", "blockchain"],
    expertise: "fintech",
    kpis: ["fintech.transactions"],
    regulatoryStatus: "partner_operated",
    licenseReference: null,
    ctaPrimary: { fr: "Parler à notre équipe", en: "Talk to our team" },
    ctaSecondary: null,
    order: 4,
    featuredOnHome: true,
  },
  {
    id: "secure-usb",
    slug: { fr: "cartes-usb-securisees", en: "secure-usb-cards" },
    name: "Cartes USB sécurisées",
    vertical: "Hardware",
    accent: "neutral",
    positioning: {
      fr: "Quand distribution physique et technologie se rencontrent.",
      en: "Where physical distribution meets technology.",
    },
    tagline: {
      fr: "Une infrastructure hybride de distribution de contenus, conçue pour les environnements à faible connectivité.",
      en: "Hybrid content distribution infrastructure, built for low-connectivity environments.",
    },
    problem: {
      fr: [
        "Une part des publics visés n'a pas accès à une connexion continue et abordable.",
        "Les contenus premium distribués en ligne sont difficiles à protéger et à valoriser.",
        "Le support physique reste, dans de nombreux contextes, le canal le plus fiable.",
      ],
      en: [
        "A share of target audiences has no continuous, affordable connection.",
        "Premium content distributed online is hard to protect and monetise.",
        "In many contexts, physical media remains the most reliable channel.",
      ],
    },
    answer: {
      fr: [
        "Un support physique premium, personnalisable, contenant des contenus protégés.",
        "Une lecture indépendante de la connexion, sans compte ni abonnement requis.",
        "Une chaîne de production maîtrisée, de la personnalisation à la distribution.",
      ],
      en: [
        "Premium, customisable physical media carrying protected content.",
        "Playback independent of connectivity, with no account or subscription required.",
        "A controlled production chain, from personalisation through distribution.",
      ],
    },
    universes: [
      {
        key: "usecases",
        title: { fr: "Cas d'usage", en: "Use cases" },
        description: { fr: "Un même support pour des contenus culturels, éducatifs et institutionnels.", en: "One medium for cultural, educational and institutional content." },
        features: { fr: ["Albums", "Livres", "Vidéos", "Formations", "Contenus institutionnels", "Documents premium"], en: ["Albums", "Books", "Videos", "Training", "Institutional content", "Premium documents"] },
        maturity: "live",
      },
      {
        key: "advantages",
        title: { fr: "Avantages", en: "Advantages" },
        description: { fr: "Ce que le support physique apporte là où le tout-en-ligne atteint ses limites.", en: "What physical media brings where online-only reaches its limits." },
        features: { fr: ["Distribution hors ligne", "Protection des contenus", "Personnalisation", "Accessibilité", "Faible dépendance à Internet", "Support physique premium", "Approche écoresponsable"], en: ["Offline distribution", "Content protection", "Personalisation", "Accessibility", "Low internet dependency", "Premium physical medium", "Eco-responsible approach"] },
        maturity: "live",
      },
    ],
    useCases: [
      { sector: { fr: "Industries culturelles", en: "Cultural industries" }, body: { fr: "Édition d'albums et d'œuvres en support physique premium, protégé et personnalisé.", en: "Releasing albums and works on premium, protected, personalised physical media." } },
      { sector: { fr: "Institutions et entreprises", en: "Institutions and companies" }, body: { fr: "Diffusion de contenus documentaires, de formations et de documents premium.", en: "Distribution of reference content, training material and premium documents." } },
    ],
    technologies: ["security", "iot", "data"],
    expertise: "hardware-iot",
    kpis: ["usb.cardsDistributed", "usb.countries"],
    regulatoryStatus: "not_applicable",
    licenseReference: null,
    ctaPrimary: { fr: "Demander un devis", en: "Request a quote" },
    ctaSecondary: { fr: "Découvrir la technologie", en: "Explore the technology" },
    order: 5,
    featuredOnHome: true,
  },
  {
    id: "usb-connect",
    slug: { fr: "usb-connect", en: "usb-connect" },
    name: "USB Connect",
    vertical: "Hardware & IoT",
    accent: "neutral",
    positioning: {
      fr: "Physique. Numérique. Connecté.",
      en: "Physical. Digital. Connected.",
    },
    tagline: {
      fr: "L'évolution connectée de notre expertise de distribution hybride : le support physique devient un point d'entrée vers des services en ligne.",
      en: "The connected evolution of our hybrid distribution expertise: physical media becomes an entry point to online services.",
    },
    problem: {
      fr: [
        "Un support physique seul ne permet ni mise à jour, ni mesure, ni relation continue.",
        "Une expérience uniquement en ligne exclut les publics faiblement connectés.",
      ],
      en: [
        "Physical media alone allows no updates, no measurement and no ongoing relationship.",
        "An online-only experience excludes weakly connected audiences.",
      ],
    },
    answer: {
      fr: [
        "Un support qui fonctionne hors ligne et se prolonge en ligne dès qu'une connexion est disponible.",
        "Une convergence entre matériel, stockage, mobile, connectivité et contenu.",
      ],
      en: [
        "Media that works offline and extends online as soon as a connection is available.",
        "Convergence between hardware, storage, mobile, connectivity and content.",
      ],
    },
    universes: [
      {
        key: "convergence",
        title: { fr: "Convergence", en: "Convergence" },
        description: { fr: "Cinq couches réunies dans un même dispositif.", en: "Five layers brought together in a single device." },
        features: { fr: ["Hardware", "Stockage", "Mobile", "Connectivité", "Contenu"], en: ["Hardware", "Storage", "Mobile", "Connectivity", "Content"] },
        maturity: "beta",
      },
    ],
    useCases: [
      { sector: { fr: "Distribution de contenus", en: "Content distribution" }, body: { fr: "Prolonger un support physique par des services et des contenus additionnels en ligne.", en: "Extending physical media with additional online services and content." } },
    ],
    technologies: ["iot", "security", "cloud"],
    expertise: "hardware-iot",
    kpis: [],
    regulatoryStatus: "not_applicable",
    licenseReference: null,
    ctaPrimary: { fr: "Parler à notre équipe", en: "Talk to our team" },
    ctaSecondary: null,
    order: 6,
    featuredOnHome: false,
  },
  {
    id: "iot",
    slug: { fr: "iot", en: "iot" },
    name: "IoT & Connected Solutions",
    vertical: "IoT",
    accent: "teal",
    positioning: {
      fr: "Connecter les équipements, collecter les données, piloter les opérations.",
      en: "Connect equipment, collect data, steer operations.",
    },
    tagline: {
      fr: "Une verticale technologique dédiée aux dispositifs connectés et à la supervision opérationnelle.",
      en: "A technology vertical dedicated to connected devices and operational monitoring.",
    },
    problem: {
      fr: [
        "Les données du terrain remontent tard, partiellement, et rarement dans le système de gestion.",
        "La supervision d'équipements dispersés suppose une connectivité tolérante aux coupures.",
      ],
      en: [
        "Field data arrives late, partially, and rarely inside the management system.",
        "Monitoring dispersed equipment requires connectivity tolerant to outages.",
      ],
    },
    answer: {
      fr: [
        "Des dispositifs connectés reliés aux plateformes de gestion du Groupe.",
        "Une collecte de données conçue pour des réseaux intermittents.",
      ],
      en: [
        "Connected devices linked to the Group's management platforms.",
        "Data collection designed for intermittent networks.",
      ],
    },
    universes: [
      {
        key: "capabilities",
        title: { fr: "Domaines d'application", en: "Application areas" },
        description: { fr: "Les usages opérationnels couverts par la verticale.", en: "The operational uses covered by the vertical." },
        features: { fr: ["Supervision de flotte", "Suivi et localisation", "Dispositifs connectés", "Collecte de données", "Supervision opérationnelle", "Automatisation"], en: ["Fleet monitoring", "Tracking and location", "Connected devices", "Data collection", "Operational monitoring", "Automation"] },
        maturity: "live",
      },
    ],
    useCases: [
      { sector: { fr: "Gestion de flotte", en: "Fleet management" }, body: { fr: "Suivi de véhicules, remontée d'événements et reporting d'exploitation.", en: "Vehicle tracking, event reporting and operational reporting." } },
      { sector: { fr: "Exploitation et maintenance", en: "Operations and maintenance" }, body: { fr: "Supervision d'équipements distribués et collecte de données terrain.", en: "Monitoring of distributed equipment and field data collection." } },
    ],
    technologies: ["iot", "data", "cloud", "security"],
    expertise: "hardware-iot",
    kpis: [],
    regulatoryStatus: "not_applicable",
    licenseReference: null,
    ctaPrimary: { fr: "Parler à notre équipe", en: "Talk to our team" },
    ctaSecondary: null,
    order: 7,
    featuredOnHome: false,
  },
]

export function solutionById(id: string) {
  return solutions.find((solution) => solution.id === id)
}
