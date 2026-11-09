const BASES = {
  site: 'https://site.api.espn.com/apis/site/v2/sports/',
  v2: 'https://site.api.espn.com/apis/v2/sports/',
  common: 'https://site.web.api.espn.com/apis/common/v3/sports/',
};
module.exports = async (req, res) => {
  const p = String(req.query.p || '');
  const base = BASES[String(req.query.b || 'site')];
  if (!base || !/^[a-z0-9\/_-]+$/i.test(p) || !p.startsWith('basketball/nba/')) {
    return res.status(400).json({ error: 'bad path' });
  }
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(req.query)) if (k !== 'p' && k !== 'b') q.set(k, String(v));
  try {
    const r = await fetch(`${base}${p}?${q}`);
    const text = await r.text();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=20');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(502).json({ error: 'upstream failed' });
  }
};