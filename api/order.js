// api/order.js - serverless function to forward orders to Discord (Vercel)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) return res.status(500).json({ error: 'Webhook not configured on server' });
  try {
    const { item, orderId, payer } = req.body;
    const payload = {
      content: null,
      embeds: [
        {
          title: "🧾 Neue Bestellung (Yuji's Mega Service)",
          color: 3447003,
          fields: [
            { name: "Item", value: item?.name || 'unbekannt', inline: true },
            { name: "Preis", value: `${item?.price} €`, inline: true },
            { name: "OrderID", value: orderId || 'n/a', inline: false },
            { name: "Käufer", value: payer?.email || (payer?.name || 'unbekannt'), inline: false }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };
    const r = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) {
      const text = await r.text();
      console.error('Discord responded:', r.status, text);
      return res.status(502).json({ error: 'Discord webhook failed', status: r.status, text });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Order handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
