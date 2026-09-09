# 09 — Motion Guidelines

> Phase 3 · Livrable 20

---

## 1. Doctrine

**Une animation doit expliquer quelque chose.** Si elle n'aide pas à comprendre une
structure, une transition d'état ou une continuité, elle est supprimée.

Trois fonctions autorisées, et trois seulement :

| Fonction | Exemple |
|---|---|
| **Révéler une structure** | Le graphe d'écosystème qui trace ses liaisons |
| **Signaler un changement d'état** | Survol de carte, ouverture de menu, onglet actif |
| **Guider l'attention** | Apparition séquentielle des étapes d'un processus |

Fonction interdite : **décorer**. Aucune animation en boucle, aucune particule,
aucun élément flottant permanent, aucun texte qui se réécrit.

---

## 2. Vocabulaire de mouvement

| Token | Durée | Courbe | Usage |
|---|---|---|---|
| `instant` | 100 ms | `standard` | Retour de clic, changement d'état de champ |
| `fast` | 150 ms | `standard` | Survol, focus, couleur |
| `base` | 220 ms | `standard` | Transitions de composant, onglets, ouverture de menu |
| `slow` | 400 ms | `entrance` | Panneaux, mega-menu, modales |
| `reveal` | 600 ms | `entrance` | Apparition au scroll |
| `counter` | 900 ms | `entrance` | Compteurs de KPI |

Courbes : `standard cubic-bezier(0.2, 0, 0, 1)` · `entrance cubic-bezier(0.16, 1, 0.3, 1)` ·
`exit cubic-bezier(0.4, 0, 1, 1)`.

**Sortie plus rapide qu'entrée** : une fermeture utilise `fast` même si l'ouverture utilise `slow`.

---

## 3. Catalogue d'animations

### 3.1 Scroll Reveal

- Déclenchement : `IntersectionObserver`, seuil 0,15, `rootMargin: "0px 0px -10% 0px"`.
- Transformation : `opacity 0→1` + `translateY 16px→0`. **Jamais de scale, jamais de rotation.**
- Décalage (`stagger`) : 60 ms entre éléments d'une même grille, plafonné à 6 éléments
  (au-delà, tout apparaît ensemble — sinon l'attente devient perceptible).
- **Une seule fois** (`once: true`). Rien ne se rejoue au scroll inverse.
- Le contenu est **présent dans le DOM et lisible sans JavaScript** : l'animation part
  d'un état visible par défaut, l'état masqué n'est appliqué que si JS est actif.

### 3.2 Parallaxe

Autorisée uniquement sur les images de hero et de case study, amplitude maximale **8 %**
de la hauteur de l'élément. Implémentée en `transform: translate3d` piloté par
`useScroll` de Framer Motion, jamais par écoute directe de l'événement `scroll`.

### 3.3 Compteurs

Interpolation `easeOut` sur 900 ms, arrondi progressif, chiffres tabulaires pour éviter
tout tremblement de largeur. Déclenchement unique. Valeur finale exacte garantie.
Si `prefers-reduced-motion` : la valeur finale s'affiche directement.

### 3.4 Graphe d'écosystème

| Phase | Traitement |
|---|---|
| Apparition | Nœuds en fondu par décalage de 80 ms, du centre vers l'extérieur |
| Liaisons | `stroke-dashoffset` de 100 % à 0 sur 600 ms |
| Repos | Oscillation **très** faible des nœuds (±2 px, 6 s) — supprimée si `reduced-motion` ou batterie faible |
| Survol d'un nœud | Nœud à 1,04, liaisons associées en accent, autres nœuds à 40 % d'opacité |
| Clic | Panneau latéral en `slow`, focus déplacé dans le panneau |

### 3.5 Transitions de page

Fondu court (`base`) sur le contenu principal, en conservant le header fixe.
**Pas de transition élaborée entre pages** : elle retarde le contenu et dégrade l'INP perçu.
`ViewTransition` n'est activée que si l'API est disponible et que `reduced-motion` est absent.

### 3.6 Micro-interactions

| Élément | Comportement |
|---|---|
| Bouton | Fond en `fast` ; à l'appui `scale(0.98)` en `instant` |
| Carte | `translateY(-2px)` + ombre `sm`→`md` en `base` |
| Lien avec chevron | Le chevron avance de 4 px en `fast` |
| Onglet | Indicateur glissant (`layoutId` Framer Motion) en `base` |
| Champ de formulaire | Bordure en `fast` ; l'erreur apparaît sans secousse (pas de « shake ») |
| Accordéon | Hauteur animée en `base`, contenu en fondu |

---

## 4. `prefers-reduced-motion` — contrat

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Au-delà de cette règle globale, comportement **fonctionnel** attendu :

| Animation | Comportement en mode réduit |
|---|---|
| Scroll reveal | Contenu visible immédiatement |
| Compteurs | Valeur finale directe |
| Graphes | Version statique, aucune oscillation |
| Parallaxe | Désactivée |
| ProcessFlow | Toutes les étapes visibles d'emblée |
| Transitions de page | Aucune |
| Indicateur d'onglet | Déplacement instantané |

Le hook `useReducedMotion()` est consommé par tous les composants animés — la règle CSS
seule ne suffit pas pour les animations pilotées en JavaScript.

---

## 5. Contrat de performance des animations

| Règle | Raison |
|---|---|
| Animer uniquement `transform` et `opacity` | Seules propriétés composées par le GPU |
| Jamais `width`, `height`, `top`, `left`, `margin` | Provoquent layout et repaint |
| `will-change` posé au survol, retiré ensuite | Une couche permanente coûte de la mémoire |
| Pas plus de **3 animations simultanées** dans le viewport | Budget de frame |
| Toute animation liée au scroll passe par `requestAnimationFrame` | Pas d'écouteur `scroll` synchrone |
| Les graphes se mettent en pause hors viewport | Économie CPU/batterie |
| Suspension si `navigator.connection.saveData` ou batterie < 20 % | Respect des contraintes réelles des utilisateurs mobiles |
| Framer Motion importé par composant (`m` + `LazyMotion`) | Évite d'embarquer la bibliothèque complète dans le bundle initial |

**Budget :** aucune animation ne doit faire descendre sous 55 fps sur un appareil de
milieu de gamme (référence : Moto G Power, throttling CPU ×4). Mesuré en recette.
