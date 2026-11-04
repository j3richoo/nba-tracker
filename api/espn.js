module.exports = async (req, res) => {
  const p = String(req.query.p || '');
  if (!/^[a-z0-9\/_-]+$/i.test(p) || !p.startsWith('basketball/nba/')) {
    return res.status(400).json({ error: 'bad path' });
  }
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) if (k !== 'p') q.set(k, String(v));
  const url = `https://site.api.espn.com/apis/site/v2/sports/${p}?${q}`;
  try {
    const r = await fetch(url);
    const text = await r.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(502).json({ error: 'upstream failed' });
  }
};
