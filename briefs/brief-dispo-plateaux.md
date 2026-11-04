# Brief Dispo — tableau des plateaux de L'Aqueduc

**Projet :** `aqueduc` sur dispo.partiqle.studio
**Intégration :** iframe sur la page Les plateaux (`/v/aqueduc?view=plan-table&header=0&embed=1`)
**Demande :** Quentin, retours client du staging

## Ce qu'il faut ne plus afficher dans l'iframe

| # | Élément | D'où il vient | Proposition |
|---|---------|---------------|-------------|
| 1 | Carrousel d'images dans le détail d'un plateau | `src/lib/viewer/viewer.js`, `carousel()` et `slidesOf()`. Quand un lot n'a pas de photo, le viewer affiche des cartons de démo (« Plateau X », « Vue intérieure », « Vue depuis la façade », « Terrasse privative »). | Ne plus afficher de cartons de démo hors mode démo : `slidesOf()` renvoie `[]` quand il n'y a pas de vraie photo, et `carousel()` ne rend alors rien. Pour L'Aqueduc, supprimer aussi les photos des lots s'il y en a. |
| 2 | « d.codazzi@polaris-op.com · +33 6 44 26 89 04 » | `Viewer.svelte`, ligne `.note` → `meta.contact.email` et `meta.contact.phone`, saisis dans Réglages → Contact. | **Ne pas vider l'email dans les réglages** : c'est lui qui reçoit les demandes de visite. Ajouter plutôt un paramètre d'URL `contact=0` qui masque la ligne `.head-contact`. |
| 3 | Numéro de version (« · vN ») | `Viewer.svelte`, `{#if meta.version} · v{meta.version}{/if}` | Paramètre `version=0`, ou ne jamais afficher la version en mode `embed=1`. |
| 4 | Services de l'immeuble (zone « Services » du RDC, légende « Services de l'immeuble », filtre « Services ») | Zones `s = "services"` des plans de niveau (`Viewer.svelte`, l. 81-90, 370-377 et 489 ; `viewer.js`, l. 412) | Paramètre `services=0` qui retire la légende, le filtre et les blocs « Services ». Ce sont des espaces communs, pas des lots à louer. |

## Proposition technique

Ajouter quatre paramètres d'URL, lus dans `src/routes/v/[slug]/+page.server.ts` et passés à `Viewer` puis à `mountViewer()` comme `header` et `embed` :

```
contact=0   version=0   photos=0   services=0
```

Une fois en ligne, l'URL de l'iframe sur Webflow devient :

```
/v/aqueduc?view=plan-table&header=0&embed=1&contact=0&version=0&photos=0&services=0
```

Je mets cette URL à jour côté Webflow (staging) dès que c'est déployé.

## À ne pas toucher

- L'email de contact du projet : il route les demandes de visite.
- Les autres intégrations Dispo : les paramètres valent 1 par défaut, donc rien ne change ailleurs.
