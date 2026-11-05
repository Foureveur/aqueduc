L'AQUEDUC — MODIFICATIONS DU SITE VITRINE (STAGING)
Devis D-2026-53 · Partiqle Studio · novembre 2026

Version de travail : https://laqueduc.webflow.io
Site en ligne (inchangé tant que la version n'est pas validée) : https://laqueduc.work

Ce document liste l'état final des modifications par rapport au site d'origine.
« Masqué » = élément conservé dans Webflow mais caché (il peut être réaffiché).


============================================================
TOUTES LES PAGES
============================================================

- Adresse : « 18 rue des Aqueducs » remplacé par « 20 rue des Aqueducs » partout.
- Copyright : © 2025 → © 2026.
- Bloc « Organisez une visite » : le bouton « Consulter les disponibilités » pointait vers une page
  inexistante (/les-plateaux/). Il mène maintenant à la section disponibilités de la page Les plateaux.
- Pied de page :
  - logo cliquable vers l'accueil (le lien était mort) ;
  - ajout du lien « Cahier de plans » (PDF) dans la colonne Télécharger, sous « Brochure commerciale » ;
  - ajout du lien « Louer l'auditorium » vers https://auditorium.laqueduc.work.
- Section témoignages transformée en composant unique, partagé entre l'Accueil et L'expérience
  (une modification s'applique aux deux pages).


============================================================
ACCUEIL
============================================================

Haut de page
- Lien « Disponibilités » réparé (il pointait vers une page inexistante) : il mène aux disponibilités
  de la page Les plateaux.
- Écran de chargement : fond blanc et logo noir (au lieu du fond vert foncé et du logo clair).
- Voile sombre de l'image d'ouverture allégé (opacité 0,3 → 0,2).

Première section (« Un lieu de travail rare & inspirant »)
- Bouton « Découvrir l'expérience » remplacé par « Explorer l'Aqueduc en 3D » :
  - même style que les autres boutons de la page (doré, souligné, sans fond), avec un picto 3D à gauche ;
  - ouvre la visite 3D publique (Spacia) en plein écran ;
  - fenêtre 3D : bouton « Fermer » en caractères blancs, sans arrondi ; fermeture aussi avec Échap.
- Ajout de la mini-carte de positionnement dans Paris au-dessus de l'image de gauche
  (fond blanc, marges intérieures 20 / 20 / 0 / 20 px, 240 px de large).

Section services (images à droite des onglets)
- Carrousel automatique de 3 images par service (12 images ajoutées).
- Chaque image reste affichée 2,5 s, avec une transition de 0,6 s.

Section localisation
- Temps à pied alignés sur la carte Immomap : RER B Gentilly 8 min, T3a Montsouris 10 min,
  RER B / T3a Cité Universitaire 12 min (ajouté), Métro 4 Mairie de Montrouge 15 min.
- « Paris / 3 min. à pied ».
- Ajout de la vignette « Aux portes de Paris » (mini-carte) en bas à droite de l'image :
  bordure blanche, sans arrondi, cliquable vers la page L'emplacement.

Chiffres clés
- Plateaux : 6 600 m² (chiffre de la plaquette ; le site affichait 7 000 m²).
- Divisible à partir de 788 m² (au lieu de 1 200 m²).
- Coworking 370 m², business center 2 500 m².


============================================================
L'EXPÉRIENCE
============================================================

Nouvelle section « Plan du rez-de-chaussée — Un socle de services à explorer »
- Plan du RDC extrait de la plaquette, avec 11 polaroïds cliquables : Business Center, Studio, Wellness,
  Hall C, Cafétéria, Coworking, L'Agora, Eat & Work, Auditorium, Hall B, Restaurant.
- Un clic sur un polaroïd ouvre le service correspondant et fait défiler la page jusqu'à lui.
- Paragraphe « Cliquez sur un espace… » centré, avec plus d'espace dessous.
- Polaroïds réduits pour ne plus se chevaucher ; au survol, ils retrouvent la même taille qu'avant.
- Photo du Hall B remplacée (AQC-050).
- Sur mobile : les noms des espaces s'affichent sous forme de pastilles.
- Bouton fixe « Retour au plan » en bas à droite, visible une fois le plan dépassé.

Liste et détail des services
- Surfaces et capacités reprises de la plaquette (le site affichait « 3000 M2 » / « 270 M2 » partout) :
  - Restauration 2 000 m² : Restaurant 980 m² · 270 places, Eat & Work 750 m² · 170 places,
    Cafétéria 270 m² · 95 places, Terrasses « En extérieur », Room service « Via l'application ».
  - Business center 2 500 m² : L'Agora « Privatisable », Coworking 370 m² avec l'Agora,
    Auditorium 340 m² · 210 places assises, Salles de réunion de 10 à 70 places, Studio 30 m².
  - Espace wellness 40 m² : massage 20 m², soins & beauté 20 m², activités sportives « Par l'Hospitality ».
  - Hospitality & conciergerie : chiffres masqués (aucune surface dans la plaquette).
- Quand un groupe de services arrive à l'écran, son premier item est automatiquement sélectionné.
- Miniatures corrigées pour correspondre aux photos affichées : Eat & Work, Cafétéria, Terrasses,
  Room service (les miniatures de démonstration du gabarit ont disparu).
- Terrasses : ajout d'une 4e photo et de sa miniature.
- Repair shop : image nettoyée (liseré jaune retiré) et agrandie proprement.
- Effet de flou des blocs services recalé (il se déclenchait trop tôt après l'ajout du plan).

Fin de page
- Ajout de la section témoignages (composant partagé avec l'Accueil), juste au-dessus de
  « Organisez une visite ».

Référencement
- Données structurées (JSON-LD) complétées avec les surfaces affichées sur la page.


============================================================
L'EMPLACEMENT
============================================================

Ordre des sections
- Accessibilité → section dorée « expérience mobilité » → vidéo → « Profitez d'un quotidien… » →
  « Un quartier aux nombreux atouts ».
- Ajout sous le hero du même séparateur que sur la page L'expérience.

Section « Une accessibilité plurielle qui favorise la mobilité douce »
- Lignes clés en haut à droite, alignées avec la pastille « La localisation » :
  Emplacement / Gentilly (94) · Paris / 3 min. à pied · Transports / RER B · T3a · Métro 4 ·
  Accès routier / A6.
- Carte statique du quartier (Immomap, version validée) à gauche, texte à droite (empilés sur mobile).
- La carte s'agrandit en plein écran au clic (fermeture par bouton, clic sur le fond ou Échap).
- Mini-carte de positionnement dans Paris au-dessus du texte (mêmes réglages que sur l'Accueil).
- Carte interactive Immomap masquée (remplacée par la carte statique validée).
- Liste des transports conservée en dessous :
  - ajout de « RER B - Gentilly, 8 minutes à pied » ;
  - temps à pied alignés sur la carte Immomap (Cité U 12 min, Montsouris 10 min,
    Mairie de Montrouge 15 min) ;
  - correction « à pieds » → « à pied ».

Section « Profitez d'un quotidien intégré à la vie parisienne & connecté au Grand Paris »
- Nouvelle mise en page sur trois colonnes : titre et texte à gauche, petite image avec léger parallax
  au centre, grande image à droite. Légendes conservées sous les photos.
- Ancienne mini-carte retirée de cette section.
- Espacements haut / bas alignés sur la section dorée.

Section « Un quartier aux nombreux atouts »
- Photo du Chalet du Parc recadrée (elle était agrandie et l'enseigne coupée).
- Espace vide sous le carrousel réduit (les cartes prennent la hauteur de leur contenu).
- Carrousel de fin : « La promenade des Aqueducs » en majuscules.


============================================================
L'IMMEUBLE
============================================================

- Carrousel de fin réparé : les images s'affichent et défilent (elles étaient invisibles).


============================================================
LES PLATEAUX
============================================================

- « Surfaces à partir de 788 m² » (au lieu de 1 200 m²).
- « Nombre de postes par plateau : 600 » (au lieu de « Nombre de poste par plateau 600 m² »).
- Textes corrigés : espaces manquants (« cesplateaux », « etfluide »…), « de grandes fenêtres »,
  « au confort », « vos futurs bureaux ».
- Tableau des disponibilités interactif (tableau + vue 3D par étage + fiche de chaque lot) à la place
  de la capture d'écran fixe. Mis à jour depuis l'outil Dispo, sans intervention sur le site.
  Dans l'intégration du site :
  - masqués : contact e-mail et téléphone, numéro de version, photos du détail des lots,
    liste « Services de l'immeuble », bouton de téléchargement du plan par lot ;
  - conservées : les cases Services du rez-de-chaussée dans le tableau.
- Deux boutons « Télécharger le cahier de plans » (PDF compressé) : sous le titre de la section
  disponibilités et sous le tableau.


============================================================
CONTACT ET MENTIONS LÉGALES
============================================================

- Contact commercialisation : « Michaël Teyssonneau » (nom corrigé), lien téléphone vers son numéro
  (il appelait le numéro de David Codazzi), e-mail corrigé (michael.teyssonneau@cushwake.com).
- Mentions légales : propriétaire mis à jour, Gentilly Property Holdings SAS, RCS Paris 885 182 394,
  37 avenue Pierre Ier de Serbie, TVA FR19 885 182 394 (au lieu de Polaris Operating Partners).
- Logo Polaris retiré des mentions légales (l'image était cassée).


============================================================
POINTS EN ATTENTE CÔTÉ CLIENT
============================================================

- Contenus des services Community, Coups de pouce et Repair shop.
- Validations :
  - surface d'un plateau affichée ;
  - surfaces du business center et du wellness (deux valeurs différentes dans la plaquette) ;
  - temps de RER depuis Gentilly ;
  - mention « for Polaris OP » dans le pied de page ;
  - mentions légales à compléter (capital social, directeur de la publication, e-mail de contact).
- Relecture de la version anglaise (Weglot) après la mise en ligne.
