// Tâche planifiée Vercel (voir vercel.json, chaque lundi) : un appel de lecture à Brevo
// pour que la clé API « auditorium » ne soit jamais considérée comme inactive.
// Brevo désactive une clé après 90 jours sans utilisation ; aucun e-mail n'est envoyé ici.
module.exports = async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ ok: false });
  const key = process.env.BREVO_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: "BREVO_API_KEY manquante" });
  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/statistics/aggregatedReport?days=7", {
      headers: { "api-key": key, Accept: "application/json" },
    });
    if (!r.ok) console.error("[keepalive] Brevo", r.status, await r.text());
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok, brevo: r.status });
  } catch (err) {
    console.error("[keepalive]", err);
    return res.status(502).json({ ok: false });
  }
};
