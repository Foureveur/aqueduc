// Fonction Vercel : reçoit une demande du formulaire et l'envoie par e-mail via l'API Brevo.
// Variables d'environnement : BREVO_API_KEY, MAIL_TO (adresses séparées par des virgules),
// MAIL_FROM (expéditeur vérifié chez Brevo), MAIL_FROM_NAME (facultatif).

const clean = (v, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  const body = typeof req.body === "string" ? safeJson(req.body) : req.body || {};

  // Champ piège invisible : un robot le remplit, un humain non. On répond « ok » sans rien envoyer.
  if (clean(body.site_web)) return res.status(200).json({ ok: true });

  const f = {
    nom: clean(body.nom, 120),
    societe: clean(body.societe, 120),
    email: clean(body.email, 160),
    telephone: clean(body.telephone, 40),
    formule: clean(body.formule, 40),
    configuration: clean(body.configuration, 40),
    date: clean(body.date, 20),
    participants: clean(String(body.participants ?? ""), 6),
    type: clean(body.type, 60),
    message: clean(body.message, 3000),
  };
  if (!f.nom || !f.societe || !EMAIL.test(f.email)) return res.status(400).json({ error: "Nom, société et e-mail valide obligatoires" });
  if (body.consent !== true) return res.status(400).json({ error: "Consentement requis" });

  const key = process.env.BREVO_API_KEY;
  const to = (process.env.MAIL_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.MAIL_FROM;
  if (!key || !to.length || !from) return res.status(503).json({ error: "Le formulaire n'est pas encore configuré" });

  const rows = [
    ["Nom", f.nom], ["Société", f.societe], ["E-mail", f.email], ["Téléphone", f.telephone],
    ["Formule", f.formule], ["Configuration", f.configuration], ["Date souhaitée", f.date],
    ["Participants", f.participants], ["Type d'événement", f.type], ["Message", f.message],
  ].filter(([, v]) => v);
  const html =
    `<p>Nouvelle demande de location reçue depuis auditorium.laqueduc.work :</p><table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">` +
    rows.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${k}</td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("") +
    `</table><p style="color:#666;font-size:12px">Répondre à ce message écrit directement à ${esc(f.email)}.</p>`;
  const text = rows.map(([k, v]) => `${k} : ${v}`).join("\n");

  try {
    const r = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": key, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        sender: { email: from, name: process.env.MAIL_FROM_NAME || "L'Auditorium · L'Aqueduc" },
        to: to.map((email) => ({ email })),
        replyTo: { email: f.email, name: f.nom },
        subject: `Demande auditorium : ${f.societe}${f.formule ? " · " + f.formule : ""}${f.date ? " · " + f.date : ""}`,
        htmlContent: html,
        textContent: text,
      }),
    });
    if (!r.ok) {
      console.error("[contact] Brevo", r.status, await r.text());
      return res.status(502).json({ error: "L'envoi a échoué" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact]", err);
    return res.status(502).json({ error: "L'envoi a échoué" });
  }
};

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
