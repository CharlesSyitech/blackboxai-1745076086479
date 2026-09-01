import type { I18n, I18nList } from "@/types/content"

/**
 * Corporate narrative. Positioning copy, submitted for validation — it states
 * intent and method, and contains no factual claim that has not been verified.
 */
export const group = {
  vision: {
    fr: "Faire de l'Afrique un lieu où les infrastructures numériques dont dépendent les entreprises, les créateurs et les institutions sont conçues, détenues et opérées localement.",
    en: "Make Africa a place where the digital infrastructure that companies, creators and institutions depend on is designed, owned and operated locally.",
  } satisfies I18n,
  mission: {
    fr: "Concevoir, développer et déployer des plateformes et des technologies qui répondent aux conditions réelles d'exploitation du continent, et qui restent transposables au-delà.",
    en: "Design, develop and deploy platforms and technologies that answer the continent's real operating conditions, and remain transferable beyond it.",
  } satisfies I18n,
  values: [
    {
      title: { fr: "Preuve avant promesse", en: "Proof before promise" } satisfies I18n,
      body: {
        fr: "Nous ne communiquons pas un chiffre que nous ne pouvons pas sourcer, ni une relation que nous ne pouvons pas qualifier.",
        en: "We do not publish a figure we cannot source, or a relationship we cannot qualify.",
      } satisfies I18n,
    },
    {
      title: { fr: "Conçu pour les conditions réelles", en: "Built for real conditions" } satisfies I18n,
      body: {
        fr: "Connectivité intermittente, référentiels comptables spécifiques, contraintes de terrain : nos produits partent de ces réalités.",
        en: "Intermittent connectivity, specific accounting frameworks, field constraints: our products start from those realities.",
      } satisfies I18n,
    },
    {
      title: { fr: "Propriété technologique", en: "Technology ownership" } satisfies I18n,
      body: {
        fr: "Nous développons nos plateformes plutôt que de les assembler, afin de maîtriser ce que nous déployons et ce que nous promettons.",
        en: "We build our platforms rather than assemble them, so we control what we deploy and what we promise.",
      } satisfies I18n,
    },
    {
      title: { fr: "Du produit au terrain", en: "From product to field" } satisfies I18n,
      body: {
        fr: "Nous exploitons nous-mêmes nos technologies en conditions réelles. C'est ce qui nous permet de les améliorer.",
        en: "We operate our own technologies in real conditions. That is how we improve them.",
      } satisfies I18n,
    },
  ],
  model: {
    fr: [
      "Syitech Group est structuré autour d'un socle technologique commun — intelligence artificielle, données, blockchain, IoT, cloud et sécurité — sur lequel s'appuient plusieurs verticales.",
      "Chaque verticale répond à un marché distinct, mais réutilise les mêmes briques : c'est ce qui permet au Groupe d'intervenir dans plusieurs secteurs sans disperser son effort d'ingénierie.",
      "Les solutions du Groupe appartiennent au Groupe. Les partenaires apportent des capacités complémentaires, notamment réglementaires ou de distribution — ils ne sont ni des activités, ni des produits de Syitech.",
    ],
    en: [
      "Syitech Group is structured around a shared technology foundation — artificial intelligence, data, blockchain, IoT, cloud and security — on which several verticals build.",
      "Each vertical addresses a distinct market while reusing the same building blocks: that is what allows the Group to operate across sectors without fragmenting its engineering effort.",
      "The Group's solutions belong to the Group. Partners bring complementary capabilities, notably regulatory or distribution ones — they are neither activities nor products of Syitech.",
    ],
  } satisfies I18nList,
  governance: {
    fr: [
      "La gouvernance de Syitech Group repose sur une direction générale responsable de la stratégie et de l'allocation des moyens, et sur des responsabilités opérationnelles réparties par verticale et par fonction.",
      "Les informations nominatives relatives aux organes de direction sont publiées après validation. Elles ne figurent pas sur ce site tant que cette validation n'est pas intervenue.",
    ],
    en: [
      "Syitech Group's governance rests on an executive leadership responsible for strategy and resource allocation, with operational responsibilities distributed by vertical and by function.",
      "Named information about governing bodies is published once validated. It does not appear on this site until that validation has taken place.",
    ],
  } satisfies I18nList,
  investors: {
    fr: [
      "Syitech Group construit un portefeuille de plateformes technologiques adossées à un socle commun, déployées sur plusieurs marchés verticaux.",
      "Les informations financières, la traction commerciale et les éléments de valorisation ne sont pas publiés sur ce site. Ils sont communiqués dans un cadre confidentiel, aux investisseurs qualifiés, sur demande motivée.",
      "Une data room sécurisée sera mise à disposition dans un second temps.",
    ],
    en: [
      "Syitech Group is building a portfolio of technology platforms on a shared foundation, deployed across several vertical markets.",
      "Financial information, commercial traction and valuation elements are not published on this site. They are shared confidentially with qualified investors, on substantiated request.",
      "A secure investor data room will be made available at a later stage.",
    ],
  } satisfies I18nList,
  presenceLabels: {
    headquarters: { fr: "Siège", en: "Headquarters" } satisfies I18n,
    operations: { fr: "Implantation opérationnelle", en: "Operations" } satisfies I18n,
    market: { fr: "Marché", en: "Market" } satisfies I18n,
    distribution: { fr: "Distribution de produits", en: "Product distribution" } satisfies I18n,
    development: { fr: "Développement international", en: "International development" } satisfies I18n,
  },
  presenceNote: {
    fr: "Cette carte distingue les pays où le Groupe dispose d'une structure, ceux où ses produits sont disponibles et ceux où des produits physiques ont été distribués. Ces situations ne sont pas équivalentes et ne sont jamais présentées comme telles.",
    en: "This map distinguishes countries where the Group has a legal presence, those where its products are available, and those where physical products have been distributed. These are not equivalent situations and are never presented as such.",
  } satisfies I18n,
}
