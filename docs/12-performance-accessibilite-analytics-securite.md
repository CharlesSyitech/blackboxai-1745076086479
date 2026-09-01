# 12 — Performance · Accessibilité · Analytics · Sécurité

> Phase 4 · Livrables 24 à 27

---

## 1. Performance

### 1.1 Objectifs (bloquants en CI)

| Métrique | Cible | Seuil d'échec CI |
|---|---|---|
| Lighthouse Performance (mobile) | ≥ 90 | < 88 |
| Lighthouse Accessibility | ≥ 95 | < 95 |
| Lighthouse Best Practices | ≥ 95 | < 93 |
| Lighthouse SEO | ≥ 95 | < 95 |
| **LCP** (mobile, 4G lente) | < 2,0 s | > 2,5 s |
| **INP** | < 200 ms | > 200 ms |
| **CLS** | < 0,05 | > 0,1 |
| **TTFB** | < 500 ms | > 800 ms |
| JS initial (First Load, gzip) | < 130 Ko | > 180 Ko |
| Poids total de la home | < 1,2 Mo | > 1,8 Mo |

Mesuré sur **6 pages de référence** : Home, `/solutions/sytium`, `/solutions/sydica`,
`/realisations/<case study>`, `/partenaires`, `/actualites/<article>`.

### 1.2 Budgets par catégorie de ressource (page d'accueil, mobile)

| Ressource | Budget |
|---|---|
| HTML (document) | 40 Ko |
| CSS | 40 Ko |
| JS (initial) | 130 Ko |
| Polices | 90 Ko (3 familles, sous-ensembles latin + latin-ext) |
| Image LCP | 200 Ko |
| Images (total au chargement initial) | 500 Ko |

### 1.3 Leviers

| Levier | Mise en œuvre |
|---|---|
| Server Components | Le rendu par défaut n'envoie pas de JS ; `"use client"` sur les seuls îlots interactifs |
| Découpage du code | `next/dynamic` pour `EcosystemGraph`, `TechnologyEngine`, `WorldMap`, `Gallery` (hors du bundle initial) |
| Framer Motion | `LazyMotion` + composant `m` + `domAnimation` — pas de `motion` complet |
| Images | AVIF/WebP, `sizes` explicite, `priority` sur une seule image par page, LQIP |
| Polices | `next/font/local`, `display: swap`, `preload` sur 2 fichiers seulement, métriques de repli ajustées |
| Chargement différé | Sections sous la ligne de flottaison rendues côté serveur mais hydratées à la demande |
| Cache | ISR + `Cache-Control: public, s-maxage, stale-while-revalidate` sur les réponses de page |
| Tiers | Aucun script tiers avant consentement ; GA4 en `afterInteractive` ; aucune bibliothèque de cartographie externe |
| Données | Une requête GROQ par bloc, projections strictes (jamais `*[...]{...}` non projeté) |
| Fluidité | Animation limitée à `transform`/`opacity` (voir doc 09 §5) |

### 1.4 Surveillance continue

- **RUM** : collecte des Core Web Vitals réels (`web-vitals` → endpoint interne), segmentés
  par page, appareil et pays. La performance mesurée en Côte d'Ivoire sur réseau mobile
  est l'indicateur qui compte, pas le score de laboratoire.
- **Lighthouse CI** sur chaque PR, comparaison à la référence de la branche principale.
- **Alerte** : régression > 10 % du LCP sur une page de référence → notification.

---

## 2. Accessibilité — WCAG 2.2 niveau AA

### 2.1 Exigences structurelles

| Exigence | Mise en œuvre |
|---|---|
| HTML sémantique | `header` `nav` `main` `section` `article` `aside` `footer` ; jamais de `div` cliquable |
| Un seul `h1` par page | Vérifié par test automatisé |
| Hiérarchie de titres sans saut | Vérifié par test automatisé |
| Lien d'évitement | Premier élément focusable : « Aller au contenu principal » |
| Repères ARIA | `banner`, `navigation` (nommée), `main`, `contentinfo` |
| Langue | `lang` sur `<html>`, et sur tout fragment dans une autre langue (ex. citations EN dans une page FR) |
| Titre de page | Unique et descriptif ; annoncé au changement de page (`aria-live` de navigation) |

### 2.2 Exigences d'interaction

| Exigence | Mise en œuvre |
|---|---|
| Navigation clavier intégrale | Tout élément interactif atteignable et actionnable ; ordre de tabulation logique |
| Focus visible | Anneau ambre 2 px + offset ; jamais supprimé (critère 2.4.11 *Focus Not Obscured* respecté : le header collant ne masque jamais l'élément focalisé — `scroll-margin-top` appliqué) |
| Cibles tactiles | ≥ 44 × 44 px (critère 2.5.8) |
| Pas de piège au clavier | Focus trap uniquement dans les modales, avec sortie par `Escape` |
| Contenu au survol | Persistant, survolable, fermable par `Escape` (critère 1.4.13) |
| Mouvement | `prefers-reduced-motion` respecté fonctionnellement (doc 09 §4) |
| Aide cohérente | Le contact est toujours au même emplacement (critère 3.2.6) |
| Saisie redondante | Les valeurs communes sont conservées entre profils du formulaire (critère 3.3.7) |

### 2.3 Exigences de contenu

- `alt` rédigé pour toute image porteuse de sens ; `alt=""` pour le décoratif.
- Aucun libellé porté par le seul `placeholder`.
- Aucune information transmise par la seule couleur (les statuts FinTech et les maturités
  produit portent un texte, pas seulement une pastille).
- Les schémas interactifs disposent d'un **équivalent textuel dans le DOM** (doc 08 §4).
- Contrastes conformes au contrat de tokens (doc 07 §2.3), vérifiés au build.

### 2.4 Vérification

| Niveau | Outil | Fréquence |
|---|---|---|
| Automatisé | `axe-core` en test unitaire par composant | Chaque PR |
| Automatisé | `@axe-core/playwright` sur 12 pages | Chaque PR |
| Manuel | Parcours complet au clavier seul | Avant chaque livraison majeure |
| Manuel | NVDA (Windows) + VoiceOver (macOS/iOS) | Avant mise en ligne |
| Manuel | Zoom 200 % et 400 %, reflow à 320 px | Avant mise en ligne |
| Déclaration | Page `/accessibilite` publiée, avec état de conformité et contact | À la mise en ligne |

L'automatisation ne détecte qu'environ 30 % des problèmes réels : **les tests manuels sont
obligatoires**, pas optionnels.

---

## 3. Analytics & conversion

### 3.1 Dispositif

| Outil | Rôle | Consentement requis |
|---|---|---|
| Google Analytics 4 | Audience, parcours, conversions | Oui |
| Google Search Console | SEO, indexation | Non (pas de script) |
| LinkedIn Insight Tag | Audience B2B, retargeting institutionnel | Oui |
| Meta Pixel | Uniquement si campagne B2C (Sydica/KultiX) | Oui |
| RUM interne (web-vitals) | Performance réelle, données agrégées non identifiantes | Non (mesure technique anonyme) |

**Aucun script de mesure n'est chargé avant consentement explicite.** Le mode Consent
Mode v2 est configuré ; en l'absence de consentement, aucune donnée personnelle n'est collectée.

### 3.2 Taxonomie d'événements

Définie une seule fois, typée, dans `lib/analytics/events.ts` — aucun appel `gtag` dispersé.

| Événement | Déclencheur | Propriétés |
|---|---|---|
| `partner_request` | Envoi du formulaire, profil partenaire/institution | `profile`, `category`, `locale`, `page` |
| `investor_contact` | Envoi du formulaire, profil investisseur | `investorType`, `locale` |
| `contact_submit` | Tout envoi de formulaire de contact | `profile`, `locale`, `page` |
| `sytium_demo` | Demande de démonstration Sytium | `module`, `companySize`, `sector` |
| `sydica_visit` | Sortie vers l'application Sydica | `source`, `audience` (artiste/label/auditeur) |
| `kultix_request` | Demande KultiX | `eventType`, `expectedAttendance` |
| `usb_quote` | Demande de devis Secure USB | `useCase`, `volume` |
| `event_request` | Demande d'accompagnement événementiel | `eventType`, `date` |
| `career_apply` | Candidature envoyée | `jobId`, `department`, `location` |
| `newsletter_signup` | Inscription newsletter | `source`, `locale` |

**Événements d'engagement complémentaires** (analyse de parcours, non des conversions) :
`ecosystem_node_click` (`node`), `solution_tab_view` (`solution`, `tab`),
`case_study_open` (`slug`, `sector`), `kpi_source_view` (`kpiKey`),
`locale_switch` (`from`, `to`), `scroll_depth` (25/50/75/100 %, home uniquement).

### 3.3 Objectifs de conversion

| Objectif | Définition | Cible initiale |
|---|---|---|
| Conversion institutionnelle | `partner_request` + `investor_contact` | À définir après 3 mois de référence |
| Conversion produit | `sytium_demo` + `kultix_request` + `usb_quote` | idem |
| Qualité d'audience | Sessions > 3 min sur `/groupe`, `/investisseurs`, `/realisations` | idem |

**Aucune cible chiffrée n'est fixée a priori** : elle serait inventée. Une période de
référence de trois mois établit la ligne de base, puis les objectifs sont posés.

---

## 4. Sécurité

### 4.1 En-têtes HTTP

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: (voir §4.2)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
```

### 4.2 Content Security Policy

```
default-src 'self';
script-src 'self' 'nonce-{{nonce}}' https://www.googletagmanager.com https://snap.licdn.com;
style-src 'self' 'nonce-{{nonce}}';
img-src 'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com;
font-src 'self';
connect-src 'self' https://*.api.sanity.io https://www.google-analytics.com https://region1.google-analytics.com;
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests;
report-uri /api/csp-report;
```

- **Nonce par requête**, généré dans le middleware. Aucun `unsafe-inline`, aucun `unsafe-eval`.
- Déploiement en deux temps : `Content-Security-Policy-Report-Only` pendant deux semaines,
  analyse des rapports, puis application stricte.

### 4.3 Formulaires et abus

| Protection | Mise en œuvre |
|---|---|
| Validation | `zod`, schéma partagé client et serveur ; **la validation serveur fait foi** |
| Rate limiting | 5 envois / 10 min / IP ; 20 / heure / IP toutes routes confondues (Upstash Redis ou équivalent) |
| Honeypot | Champ masqué + mesure du temps de remplissage (< 2 s = rejet) |
| Captcha | Cloudflare Turnstile (respectueux de la vie privée), invisible sauf comportement suspect |
| CSRF | Server Actions Next.js (protection d'origine native) + vérification `Origin` sur les Route Handlers |
| Téléversements | Types autorisés (`pdf`, `docx`), 5 Mo max, analyse antivirus, stockage hors racine web, nom de fichier régénéré |
| Journalisation | Tentatives rejetées journalisées sans donnée personnelle |

### 4.4 Secrets et dépendances

- **Aucune clé côté client.** Seules les variables `NEXT_PUBLIC_*` sont exposées, et elles ne
  contiennent jamais de secret (ID GA4 et URL publique du CDN uniquement).
- Jetons CMS, clés d'API Sytium, secrets de webhook : variables d'environnement serveur,
  rotation semestrielle documentée.
- `npm audit` + Dependabot en CI ; toute vulnérabilité *high* bloque la livraison.
- `scripts/check-secrets.ts` : recherche de motifs de secrets dans le bundle client au build.

### 4.5 Vie privée et conformité

| Exigence | Mise en œuvre |
|---|---|
| Consentement | Bandeau non modal ; refus aussi simple que l'acceptation ; choix révocable depuis le footer |
| Cookies | Aucun cookie non essentiel avant consentement ; inventaire publié sur `/cookies` |
| Données de formulaire | Finalité, durée de conservation et destinataires indiqués sur le formulaire |
| Droits des personnes | Contact dédié sur `/confidentialite` ; procédure d'exercice des droits documentée |
| Conservation | Candidatures : 24 mois · Contacts : 36 mois · Journaux techniques : 12 mois |
| Transferts | Localisation des données CMS et d'hébergement documentée (enjeu pour les clients institutionnels) |
| RGPD / loi ivoirienne n° 2013-450 | Registre de traitement à établir avec le conseil juridique |

### 4.6 Exploitation

- Sauvegardes CMS quotidiennes, restauration testée trimestriellement.
- Journalisation des accès au back-office, authentification à deux facteurs obligatoire.
- Procédure d'incident documentée : détection → confinement → notification (72 h si données
  personnelles) → correction → retour d'expérience.
- Test d'intrusion recommandé avant la mise en ligne, compte tenu du public institutionnel visé.
