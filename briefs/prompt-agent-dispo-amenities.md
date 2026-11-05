Projet Dispo : `aqueduc` — suite du brief « tableau des plateaux » (build 756c72d / 913bf9c).

Retour client sur `services=0` : il en fait trop. Le client voulait seulement ne plus afficher la **liste « Services de l'immeuble »** sous le tableau (la section `.amen`, 9 lignes). Les cases « Services » du RDC dans le tableau, la pastille de légende, le filtre et la teinte du socle sur l'axo doivent rester affichés.

Côté Webflow, l'iframe n'a déjà plus `services=0`, et elle passe déjà un nouveau paramètre :

```
/v/aqueduc?view=plan-table&header=0&embed=1&contact=0&version=0&photos=0&amenities=0
```

En attendant, la liste est donc revenue : les cases sont correctes, la liste est en trop.

À faire :

1. Ajoute un paramètre d'URL **`amenities=0`** qui masque uniquement la section « Services de l'immeuble » (`Viewer.svelte`, bloc `{#if services && cxAmenities.length}` → `<section class="amen">`) et rien d'autre. Même règle que les autres : valeur par défaut 1, seule la valeur `0` coupe.
2. Garde `services=0` tel quel pour les intégrations qui veulent tout retirer, mais documente la différence dans le README (« Ce qu'une intégration peut taire ») : `amenities=0` = la liste seulement ; `services=0` = tout ce qui touche aux services.
3. Ajoute le cas dans `tests/browser/iframe-params.js` : avec `amenities=0`, pas de `.amen`, mais les cases « Services » du tableau, la pastille de légende et le filtre sont présents.

Vérification : `npm test`, typecheck, puis ouvre l'URL ci-dessus en desktop et en mobile. La liste a disparu, les services du RDC sont visibles dans le tableau. Déploie en production et réponds avec le numéro de build.
