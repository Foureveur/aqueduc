# auditorium.laqueduc.work

Landing de location de l'auditorium de L'Aqueduc, tirée des pages 1-2 du flyer Canva
« L'Auditorium — Flyer A4 recto verso », avec le design system du site vitrine (couleurs,
polices Bw Gradual / Satoshi / DM Mono, boutons). Site statique (`public/`) + une fonction
Vercel (`api/contact.js`) qui envoie les demandes du formulaire par e-mail via Brevo.

Variables d'environnement Vercel :
- `BREVO_API_KEY` : clé API Brevo dédiée « auditorium » (accès restreint : emails transactionnels uniquement ; expire après 90 jours sans utilisation)
- `MAIL_TO` : destinataires, séparés par des virgules
- `MAIL_FROM` : expéditeur vérifié dans Brevo
- `MAIL_FROM_NAME` : nom affiché (facultatif)

Domaine : enregistrement CNAME `auditorium` → `cname.vercel-dns.com` dans la zone OVH de laqueduc.work.
