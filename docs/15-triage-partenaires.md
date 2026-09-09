# 15 — Triage de la planche partenaires

> Planche fournie le 2026-09-09. **Aucun logo n'a été publié.**
> Les 32 organisations retenues sont enregistrées dans `src/content/partners.ts`
> en `isPublic: false`, catégorisées, avec la raison du blocage.

---

## 1. Ce que cette planche est, et ce qu'elle n'est pas

C'est un document de travail interne — utile, dense, et **impubliable tel quel**. Il mélange
cinq natures de relation que le site doit tenir séparées, plus deux éléments qui ne sont pas
des relations du tout.

| Ce qu'on y trouve | Ce que c'est | Où ça va |
|---|---|---|
| 32 organisations tierces | Relations de natures très diverses | Page Partenaires, **après qualification une par une** |
| **KultiX et Sydica** | **Vos propres marques** | Nulle part dans les partenaires — voir §2 |
| Bloc média de droite (27 titres) | Couverture presse | Rubrique distincte « Ils parlent de nous » — voir §3 |
| Encart **Visa / Mastercard** | **Une question interne** — voir §4 | Nulle part |
| **« +4K Artistes »** | Un indicateur, pas un partenaire | Entité KPI, à valider — voir §5 |

---

## 2. Vos propres marques ne sont pas vos partenaires

**KultiX et Sydica figurent sur la planche.** Sur un document interne d'écosystème, c'est
logique. Sur une page « Nos partenaires », c'est destructeur : le Groupe se présenterait
comme cautionné par ses propres produits.

Cela contredit frontalement la hiérarchie narrative posée depuis le premier dossier —
*Groupe → Expertises → Technologies → Solutions* — où les solutions **appartiennent** au
Groupe. Elles sont retirées de la liste partenaires.

---

## 3. Le bloc média n'est pas un bloc partenaires

Vingt-sept titres — RTI, Fraternité Matin, Africa Radio, Life TV, L'Intelligent d'Abidjan,
AIP, Linfodrome, Business 24, et les autres.

**Un média qui parle de vous n'est pas votre partenaire.** Les présenter comme tels
travestit la relation dans les deux sens : cela vous attribue des liens que vous n'avez pas,
et cela laisse entendre que ces rédactions vous sont liées — ce qui, pour une rédaction, est
une atteinte à son indépendance.

**Recommandation :** une rubrique distincte, avec pour chaque titre **un lien vers l'article
daté**. Une couverture presse sourcée vaut infiniment plus qu'un logo posé. La liste est
conservée dans `pressCoverage`, hors de la collection partenaires.

---

## 4. L'encart Visa / Mastercard est une décision interne

Sur la planche, les deux logos sont surmontés de la mention **« Choisir entre VISA et
MasterCard ? »**. C'est une question que l'équipe se posait, pas une relation.

Publier ces deux marques sur cette base serait une affirmation de partenariat avec deux
réseaux de paiement mondiaux, sans fondement. C'est le cas d'école de la règle §48 du brief :
*ne jamais déduire qu'une organisation est partenaire parce que son logo est fourni.*

Rappel du point tranché précédemment : votre contrat d'agrément bancaire confirme le
programme SydiCard, **il n'emporte pas licence de marque réseau**.

---

## 5. « +4K Artistes » est un indicateur

Ce n'est pas un partenaire. C'est un KPI — et un KPI non validé. Il rejoint la fiche
d'indicateurs avec les champs obligatoires : valeur, période, source, date de mise à jour,
validateur. Tant qu'ils manquent, il n'est pas affiché.

---

## 6. Les 32 organisations, par niveau de risque

### 6.1 Risque élevé — publication exclue sans autorisation formelle

| Organisation | Pourquoi |
|---|---|
| **Organisation mondiale de la Santé** | Nom et emblème protégés par une réglementation internationale spécifique. L'usage non autorisé de l'emblème de l'OMS est un problème juridique caractérisé, pas un risque de forme. |
| **Ministère de la Culture et de la Francophonie — République de Côte d'Ivoire** | Emblème d'État. Autorisation administrative expresse requise. |
| **Visa**, **Mastercard** | Voir §4. Marques de réseau, protection maximale. |
| **Universal Music Africa** | Major. Le brief impose déjà une qualification contractuelle exacte. |
| **Sacem** | Société de gestion collective, usage de marque encadré. |
| **Carrefour Côte d'Ivoire**, **CFAO** | Grands comptes, autorisation écrite indispensable. |

### 6.2 Programmes d'accompagnement — à ne jamais présenter en partenariat stratégique

Business France · Marseille Innovation · Accélérateur M · ANIMA Investment Network ·
La Métropole Aix-Marseille-Provence · KEDGE Business School · Eurobiomed

**Eurobiomed** — lecture corrigée par Syitech (j'avais lu « Euroquomed »). Pôle de compétitivité
santé, rattaché à l'écosystème d'innovation avec les autres acteurs marseillais de la planche.
Catégorisation à confirmer.

Le brief est explicite : *un programme d'accélération n'est pas un investisseur*. Le libellé
exact — `Program` — doit apparaître à l'écran.

### 6.3 Finance et paiements — à qualifier

Wave · MTN Mobile Money · BNI · AFG Bank · SA2IF · Max it CI

Ces relations touchent au périmètre réglementaire de SydiCard. Leur qualification doit
préciser si l'organisation est **partenaire technologique**, **établissement agréé**,
**fournisseur** ou **prospect**.

### 6.4 Culture, technologie, recherche — à qualifier

Nidal Production · Clape Babiwood · La Fabrique · Bock · NCI · Terrabo ·
2N Academy · VH Vades · SODEPCI · CEP

---

## 7. Ce qu'il faut renseigner, par organisation

Six champs. Sans les six, l'entrée reste invisible.

| Champ | Question à laquelle il répond |
|---|---|
| `relationshipType` | Partenaire stratégique, institutionnel, technologique, contenu, financier, client, fournisseur, POC, collaboration, programme, recherche ? |
| `startDate` / `endDate` | Depuis quand, et est-ce toujours actif ? |
| `contractReference` | Quel document formalise la relation ? (jamais affiché) |
| `legalValidatedBy` | Qui, chez Syitech, engage la publication ? |
| `logoUsageApproved` | **Le partenaire** a-t-il autorisé l'usage de sa marque ? |
| `description` | Que couvre réellement la relation ? |

Rappel de la distinction acquise avec BURIDA : **nommer une relation et afficher un logo sont
deux autorisations distinctes.** La première vous appartient. La seconde appartient au
partenaire. Une organisation peut donc apparaître en texte sans son logo — c'est le cas de
BURIDA aujourd'hui.

---

## 8. État actuel

| | |
|---|---|
| Organisations enregistrées | 32 |
| Publiées | **1** — BURIDA, en texte, sans logo |
| Titres de presse mis de côté | 27 |
| Marques propres retirées de la liste | 2 — KultiX, Sydica |
| Retirées à la demande de Syitech | 2 — HG/EG, Magnus Création |
| Éléments écartés | Encart Visa/Mastercard, « +4K Artistes » |
