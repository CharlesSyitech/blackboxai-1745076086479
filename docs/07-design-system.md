# 07 — Design System

> Phase 3 · Livrable 15 · Tokens machine-lisibles : `design-system/tokens.json`

> ⚠️ **Dépendance ouverte.** La charte graphique officielle de Syitech Group (couleurs
> exactes, logo vectoriel, polices sous licence) n'a pas été fournie. Le système ci-dessous
> est **complet et cohérent**, construit sur des tokens sémantiques : le remplacement des
> valeurs primitives par la charte officielle se fait dans un seul fichier, sans toucher
> à un seul composant. Voir `docs/13-gouvernance-donnees-questions-ouvertes.md`.

---

## 1. Architecture des tokens

Trois niveaux, une seule direction de dépendance :

```
PRIMITIFS            →   SÉMANTIQUES              →   COMPOSANTS
navy-700: #12305D        color.text.primary            button.primary.bg
amber-500: #E39A2B       color.bg.surface              card.border
space-6: 24px            color.border.default          section.paddingY
```

**Règle absolue :** un composant ne consomme **jamais** un primitif.
Il consomme un token sémantique. C'est ce qui rend le rebranding possible en une journée.

---

## 2. Couleurs

### 2.1 Primitifs

**Navy — primaire institutionnel**

| Token | Hex | Usage |
|---|---|---|
| `navy-50` | `#EEF3FA` | Fonds très clairs, états survol |
| `navy-100` | `#D6E2F2` | Bordures douces, badges |
| `navy-200` | `#AEC5E5` | Séparateurs sur fond clair |
| `navy-300` | `#7C9FD1` | Éléments décoratifs |
| `navy-400` | `#4C77B8` | Icônes sur fond sombre |
| `navy-500` | `#2A5698` | Liens sur fond sombre |
| `navy-600` | `#1B4079` | Liens, éléments interactifs |
| `navy-700` | `#12305D` | **Primaire** — titres, boutons secondaires |
| `navy-800` | `#0B2142` | Fonds de section sombres |
| `navy-900` | `#061428` | Fonds profonds |

**Ink — neutres profonds**

| `ink-900` `#060B14` · `ink-800` `#12151B` · `ink-700` `#2B3240` |

**Neutres**

| Token | Hex | Usage |
|---|---|---|
| `neutral-0` | `#FFFFFF` | Fond page |
| `neutral-50` | `#F7F8FA` | Surface |
| `neutral-100` | `#EDEFF3` | Surface alternative, séparateurs |
| `neutral-200` | `#D9DDE4` | Bordures |
| `neutral-400` | `#9AA3B0` | Texte désactivé, icônes décoratives |
| `neutral-600` | `#5A6472` | Texte secondaire |
| `neutral-800` | `#2B3240` | Texte fort sur fond clair |

**Accent — Amber (accent unique)**

| `amber-100` `#FDF0DA` · `amber-300` `#F2C177` · `amber-500` `#E39A2B` · `amber-600` `#C67F16` · `amber-700` `#9A5B00` |

**Data — Teal (visualisation et schémas uniquement)**

| `teal-300` `#5FCFCB` · `teal-500` `#0FA3A3` · `teal-700` `#0A7B7B` |

**Sémantiques d'état**

| `success-600` `#12805C` · `warning-600` `#9A5B00` · `error-600` `#B3261E` · `info-600` `#1B4079` |

### 2.2 Tokens sémantiques

| Token | Thème clair | Thème sombre (sections ink) |
|---|---|---|
| `color.bg.page` | `neutral-0` | `ink-900` |
| `color.bg.surface` | `neutral-50` | `navy-900` |
| `color.bg.elevated` | `neutral-0` | `navy-800` |
| `color.bg.inverse` | `ink-900` | `neutral-0` |
| `color.text.primary` | `navy-900` | `neutral-0` |
| `color.text.secondary` | `neutral-600` | `navy-100` |
| `color.text.tertiary` | `neutral-400` | `navy-300` |
| `color.text.accent` | `navy-700` | `amber-300` |
| `color.text.inverse` | `neutral-0` | `navy-900` |
| `color.border.subtle` | `neutral-100` | `rgba(255,255,255,.08)` |
| `color.border.default` | `neutral-200` | `rgba(255,255,255,.16)` |
| `color.border.strong` | `navy-700` | `amber-500` |
| `color.action.primary.bg` | `navy-700` | `amber-500` |
| `color.action.primary.fg` | `neutral-0` | `ink-900` |
| `color.action.accent.bg` | `amber-500` | `amber-500` |
| `color.action.accent.fg` | `ink-900` | `ink-900` |
| `color.focus.ring` | `amber-600` | `amber-300` |

### 2.3 Contrastes vérifiés (WCAG 2.2)

| Combinaison | Ratio | Verdict |
|---|---|---|
| `navy-900` sur `neutral-0` | ≈ 18,2:1 | AAA |
| `navy-700` sur `neutral-0` | ≈ 13,0:1 | AAA |
| `neutral-600` sur `neutral-0` | ≈ 6,0:1 | AA (texte normal) ✓ |
| `neutral-0` sur `navy-800` | ≈ 16,0:1 | AAA |
| `neutral-0` sur `ink-900` | ≈ 19,5:1 | AAA |
| `ink-900` sur `amber-500` (bouton accent) | ≈ 8,1:1 | AAA |
| `amber-500` sur `ink-900` (texte accent sur sombre) | ≈ 8,1:1 | AAA |
| **`amber-500` sur `neutral-0`** | **≈ 2,4:1** | **✗ interdit pour du texte** |
| `amber-700` sur `neutral-0` | ≈ 5,4:1 | AA ✓ (variante texte sur clair) |
| `teal-500` sur `neutral-0` | ≈ 3,1:1 | ✗ texte · ✓ éléments graphiques (≥ 3:1) |
| `teal-700` sur `neutral-0` | ≈ 5,1:1 | AA ✓ |
| `success-600` / `error-600` sur `neutral-0` | ≈ 5,0:1 / 6,6:1 | AA ✓ |
| `neutral-400` sur `neutral-0` | ≈ 2,6:1 | Bordures et décor uniquement |

**Règle opposable :** `amber-500` et `teal-500` ne portent jamais de texte sur fond clair.
Un test automatisé (`scripts/check-contrast.ts`) vérifie toutes les paires déclarées à chaque build.

---

## 3. Typographie

### 3.1 Familles

| Rôle | Police | Fallback | Poids chargés |
|---|---|---|---|
| Display / titres | **Manrope** | `"Manrope", "Segoe UI", system-ui, sans-serif` | 500, 600, 700, 800 |
| Corps / interface | **Inter** | `"Inter", system-ui, -apple-system, "Segoe UI", sans-serif` | 400, 500, 600 |
| Technique / données | **IBM Plex Mono** | `"IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace` | 400, 500 |

**Chargement :** `next/font/local` avec sous-ensembles `latin` + `latin-ext` (nécessaire pour
les diacritiques FR), `display: swap`, `preload` sur Manrope 700 et Inter 400 uniquement.
Métriques de repli ajustées (`adjustFontFallback`) pour un CLS proche de zéro.

**Répartition des rôles :** Manrope porte l'autorité (titres, chiffres clés) ; Inter porte
la lisibilité (tout le corps, tous les composants d'interface) ; IBM Plex Mono porte la
précision (étiquettes de schémas, noms de technologies, eyebrows, unités de KPI).

### 3.2 Échelle typographique

| Style | Famille / poids | Taille (clamp) | Interligne | Interlettrage | Usage |
|---|---|---|---|---|---|
| `Display XL` | Manrope 800 | `clamp(2.75rem, 1.6rem + 4.6vw, 5rem)` (44→80 px) | 1.05 | −0.03em | Hero home uniquement |
| `Display` | Manrope 700 | `clamp(2.25rem, 1.5rem + 3vw, 3.75rem)` (36→60 px) | 1.1 | −0.025em | Hero de page |
| `H1` | Manrope 700 | `clamp(2rem, 1.4rem + 2.4vw, 3rem)` (32→48 px) | 1.15 | −0.02em | Titre de page |
| `H2` | Manrope 700 | `clamp(1.625rem, 1.2rem + 1.7vw, 2.25rem)` (26→36 px) | 1.2 | −0.015em | Titre de section |
| `H3` | Manrope 600 | `clamp(1.375rem, 1.15rem + 0.9vw, 1.75rem)` (22→28 px) | 1.3 | −0.01em | Sous-section, carte |
| `H4` | Manrope 600 | `1.25rem` (20 px) | 1.4 | 0 | Titre de carte |
| `Body Large` | Inter 400 | `1.125rem` (18 px) | 1.7 | 0 | Chapô, sous-titres |
| `Body` | Inter 400 | `1rem` (16 px) | 1.7 | 0 | Corps |
| `Small` | Inter 400 | `0.875rem` (14 px) | 1.6 | 0 | Notes, méta |
| `Caption` | Inter 400 | `0.75rem` (12 px) | 1.5 | +0.01em | Légendes, sources |
| `Overline` | IBM Plex Mono 500 | `0.75rem` (12 px) | 1.4 | +0.12em, majuscules | Eyebrows, étiquettes de schéma |
| `Metric` | Manrope 800 | `clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem)` | 1 | −0.03em | Valeurs de KPI (chiffres tabulaires) |

**Règles :**
- Mesure de ligne : 65–75 caractères pour le corps (`max-width: 68ch`).
- `font-variant-numeric: tabular-nums` obligatoire sur tous les chiffres de KPI et tableaux.
- Aucun texte en dessous de 12 px.
- Jamais plus de 3 niveaux typographiques visibles dans un même bloc.

---

## 4. Espacement, grille, formes

### 4.1 Échelle d'espacement (base 8 px, demi-pas 4 px)

`0 · 4 · 8 · 12 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128 · 160 · 200`

Nommage : `space-0` … `space-14`. **Aucune valeur hors échelle** — vérifié par une règle
ESLint/Tailwind interdisant les valeurs arbitraires d'espacement.

### 4.2 Rythme vertical des sections

| Breakpoint | Padding vertical section standard | Section majeure |
|---|---|---|
| < 768 px | `space-11` (80 px) | `space-12` (96 px) |
| 768–1023 px | `space-12` (96 px) | `space-13` (128 px) |
| ≥ 1024 px | `space-13` (128 px) | `space-14` (160 px) |

### 4.3 Grille et conteneurs

| Token | Valeur |
|---|---|
| `container.content` | 1200 px |
| `container.wide` | 1440 px |
| `container.narrow` | 800 px (contenu éditorial long) |
| `grid.columns` | 12 (≥1024) · 8 (768–1023) · 4 (<768) |
| `grid.gutter` | 24 px (≥1024) · 16 px (<1024) |
| `page.margin` | 80 px (≥1440) · 40 px (1024–1439) · 32 px (768–1023) · 20 px (<768) |

### 4.4 Points de rupture

| Nom | Largeur | Cible de conception |
|---|---|---|
| `xs` | 320 px | Contrainte minimale absolue (aucun débordement horizontal) |
| `sm` | 375 px | Référence mobile principale |
| `sm+` | 390 px | iPhone récent |
| `md-` | 430 px | Grand mobile |
| `md` | 768 px | Tablette portrait |
| `lg` | 1024 px | Tablette paysage / petit laptop |
| `xl` | 1440 px | **Référence de conception desktop** |
| `2xl` | 1920 px | Grand écran (le contenu ne s'étire pas, les fonds oui) |

### 4.5 Rayons et ombres

| Token | Valeur | Usage |
|---|---|---|
| `radius-sm` | 4 px | Badges, champs de formulaire |
| `radius-md` | 8 px | Boutons, cartes |
| `radius-lg` | 12 px | Grandes cartes, panneaux |
| `radius-xl` | 16 px | Conteneurs de mockups |
| `radius-full` | 9999 px | Pastilles, avatars |

| Token | Valeur | Usage |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(6,20,40,.06)` | Champs |
| `shadow-sm` | `0 2px 8px rgba(6,20,40,.06)` | Cartes au repos |
| `shadow-md` | `0 8px 24px rgba(6,20,40,.08)` | Cartes au survol, menus |
| `shadow-lg` | `0 24px 48px rgba(6,20,40,.12)` | Mockups produit, modales |

**Discipline des ombres :** une carte au repos porte une **bordure**, pas une ombre.
L'ombre signale une **élévation active** (survol, ouverture). C'est ce qui évite l'effet
« cartes flottantes partout » banni en direction artistique.

### 4.6 Couches (z-index)

`base 0 · raised 10 · sticky 100 · header 200 · dropdown 300 · overlay 400 · modal 500 · toast 600 · skipLink 700`

---

## 5. Focus, états et accessibilité du système

**Anneau de focus (identique partout, non supprimable) :**

```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
  border-radius: inherit;
}
```

| État | Traitement |
|---|---|
| Repos | Bordure `color.border.default` |
| Survol | Bordure `color.border.strong`, `shadow-md`, translation −2 px (désactivée si `reduced-motion`) |
| Focus visible | Anneau ambre 2 px + offset 2 px, **en plus** de l'état de survol |
| Actif | Translation 0, ombre réduite |
| Désactivé | Opacité 0,45, `cursor: not-allowed`, `aria-disabled` |
| Chargement | Skeleton `neutral-100` animé (pulse 1,5 s), remplacé par le contenu sans saut de mise en page |
| Erreur | Bordure `error-600` + message texte associé par `aria-describedby` |

**Interdits :** `outline: none` sans remplacement ; couleur seule pour porter une
information (toujours doublée d'un texte ou d'une icône) ; `title` comme unique libellé.

---

## 6. Thématisation

Deux thèmes coexistent **dans la même page** : les sections ink appliquent le thème sombre
via un attribut de portée, pas via une media query.

```html
<section data-theme="dark"> … </section>
```

```css
:root { /* tokens clairs */ }
[data-theme="dark"] { /* redéfinition des tokens sémantiques uniquement */ }
```

Les composants ne connaissent que les tokens sémantiques : **le même composant fonctionne
dans les deux thèmes sans variante**. Un mode sombre global au niveau du site pourra être
ajouté ultérieurement sans refonte, en basculant l'attribut sur `<html>`.
