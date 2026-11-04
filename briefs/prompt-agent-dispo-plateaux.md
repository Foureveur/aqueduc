Projet Dispo : `aqueduc` (dispo.partiqle.studio). Repo : Foureveur/dispo.

Contexte : le tableau des disponibilités de L'Aqueduc est intégré en iframe sur la page « Les plateaux » du site Webflow, avec l'URL `/v/aqueduc?view=plan-table&header=0&embed=1`. Le client demande de masquer quatre éléments dans cette intégration. L'outil sert à d'autres projets : les changements ne doivent rien modifier ailleurs.

À faire :

1. **Photos et carrousel du détail d'un plateau.** Quand un lot n'a pas de photo, `src/lib/viewer/viewer.js` (`carousel()` / `slidesOf()`) affiche des cartons de démo : « Plateau X », « Vue intérieure », « Vue depuis la façade », « Terrasse privative ». Ajoute un paramètre d'URL `photos=0` qui supprime entièrement le bloc carrousel du détail (pas de cartons, pas de boutons, pas de pastilles). Hors démo, ne génère plus de cartons de démo quand un lot n'a pas de vraie photo.

2. **Contact.** La ligne de contact du pied (`Viewer.svelte`, `.head-contact`) affiche « d.codazzi@polaris-op.com » et « +33 6 44 26 89 04 ». Ajoute un paramètre `contact=0` qui masque cette ligne. **Ne vide pas l'email dans les réglages du projet** : c'est lui qui reçoit les demandes de visite.

3. **Numéro de version.** Le pied affiche « · vN » (`{#if meta.version} · v{meta.version}{/if}`). Ajoute un paramètre `version=0` qui le masque.

4. **Services de l'immeuble.** Ajoute un paramètre `services=0` qui retire tout ce qui concerne les zones `s = "services"` : l'entrée « Services » du filtre et de la légende (« Services de l'immeuble »), les lignes « Services » des niveaux dans le tableau, et les blocs « Services » sur les plans et l'axo. Seuls les lots commercialisables restent (disponible, sous option, occupé).

Implémentation : lis les quatre paramètres dans `src/routes/v/[slug]/+page.server.ts`, comme `header` et `embed`. Passe-les à `Viewer.svelte`, puis à `mountViewer()`. Valeur par défaut : 1, pour que les intégrations existantes ne changent pas. Ajoute des tests unitaires à côté des tests existants du viewer.

Vérification avant de livrer :
- `npm test` et le typecheck passent ;
- ouvre `/v/aqueduc?view=plan-table&header=0&embed=1&photos=0&contact=0&version=0&services=0` en desktop et en mobile, et vérifie :
  - l'absence de carrousel dans le détail d'un plateau ;
  - l'absence de l'email et du téléphone ;
  - l'absence du « vN » ;
  - l'absence de toute mention « Services » ;
- vérifie que la même URL sans ces paramètres s'affiche exactement comme avant.

Puis déploie en production, et réponds avec :
- l'URL finale à mettre dans l'iframe ;
- le numéro de build ;
- les captures avant/après.
