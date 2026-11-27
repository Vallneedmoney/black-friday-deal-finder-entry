// FridayProof filtering — pure functions, no DOM here. main.js owns the page;
// this file only decides which deals a set of controls shows, and in what order.

export function discountOf(deal) {
  return Math.round((1 - deal.sale / deal.was) * 100);
}

export function savedOf(deal) {
  return +(deal.was - deal.sale).toFixed(2);
}

// Reads the page's address (?q=airpods&cat=Audio&store=Amazon&min=40&
// verdict=real&sort=saving) so a filtered view is a link you can share —
// and so a screenshot can show a filter actually working.
export function readControlsFromUrl(search) {
  const p = new URLSearchParams(search);
  return {
    q: (p.get('q') || '').trim(),
    cat: p.get('cat') || 'All',
    store: p.get('store') || 'All',
    min: Number(p.get('min') || 0),
    verdict: p.get('verdict') || 'All',
    sort: p.get('sort') || 'discount',
  };
}

export function applyFilters(deals, c) {
  const needle = c.q.toLowerCase();
  return deals.filter((d) => {
    if (needle) {
      const hay = `${d.name} ${d.brand} ${d.store} ${d.category} ${d.blurb}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    if (c.cat !== 'All' && d.category !== c.cat) return false;
    if (c.store !== 'All' && d.store !== c.store) return false;
    if (c.min > 0 && discountOf(d) < c.min) return false;
    if (c.verdict !== 'All' && d.verdict !== c.verdict) return false;
    return true;
  });
}

const SORTERS = {
  discount: (a, b) => discountOf(b) - discountOf(a) || a.sale - b.sale,
  saving: (a, b) => savedOf(b) - savedOf(a) || discountOf(b) - discountOf(a),
  price: (a, b) => a.sale - b.sale,
  name: (a, b) => a.name.localeCompare(b.name),
};

export function applySort(deals, sort) {
  return [...deals].sort(SORTERS[sort] || SORTERS.discount);
}

export function boardStats(deals) {
  const totalSaved = deals.reduce((s, d) => s + savedOf(d), 0);
  const avgDiscount = deals.length
    ? Math.round(deals.reduce((s, d) => s + discountOf(d), 0) / deals.length)
    : 0;
  const realCount = deals.filter((d) => d.verdict === 'real').length;
  return { totalSaved, avgDiscount, realCount, count: deals.length };
}
