// FridayProof page — renders the deal ledger and wires the controls.
// All data lives in data.js; all filter rules live in filters.js.

import { DEALS, VERDICTS, CATEGORIES, STORES, CHECKED_AT, CHECKED_NOTE } from './data.js';
import {
  discountOf,
  savedOf,
  readControlsFromUrl,
  applyFilters,
  applySort,
  boardStats,
} from './filters.js';

const $ = (sel) => document.querySelector(sel);
const money = (n) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const controls = readControlsFromUrl(location.search);

function verdictPill(deal) {
  const v = VERDICTS[deal.verdict];
  return `<span class="verdict verdict-${deal.verdict}" title="${v.hint}">${v.label}</span>`;
}

function dealCard(deal) {
  const pct = discountOf(deal);
  return `
  <article class="card" data-id="${deal.id}">
    <div class="card-top">
      <span class="tag">${deal.category}</span>
      <span class="store">${deal.store}</span>
    </div>
    <h3>${deal.name}</h3>
    <p class="blurb">${deal.blurb}</p>
    <div class="prices">
      <span class="sale">${money(deal.sale)}</span>
      <span class="was">${money(deal.was)}</span>
      <span class="pct">−${pct}%</span>
    </div>
    <p class="saved">You save ${money(savedOf(deal))}</p>
    ${verdictPill(deal)}
    <p class="why">${deal.verdictNote}</p>
    <p class="proof">Checked ${CHECKED_AT} · Source: ${deal.source}</p>
    <a class="go" href="${deal.url}" target="_blank" rel="noopener">View at ${deal.store} →</a>
  </article>`;
}

function renderStats() {
  const s = boardStats(DEALS);
  $('#stat-deals').textContent = s.count;
  $('#stat-stores').textContent = STORES.length;
  $('#stat-avg').textContent = s.avgDiscount + '%';
  $('#stat-saved').textContent = money(s.totalSaved);
  $('#stat-real').textContent = s.realCount;
}

function renderChips() {
  const wrap = $('#cat-chips');
  const cats = ['All', ...CATEGORIES];
  wrap.innerHTML = cats
    .map(
      (c) =>
        `<button type="button" class="chip${controls.cat === c ? ' active' : ''}" data-cat="${c}" aria-pressed="${controls.cat === c}">${c}</button>`,
    )
    .join('');
  wrap.querySelectorAll('.chip').forEach((b) =>
    b.addEventListener('click', () => {
      controls.cat = b.dataset.cat;
      syncUrl();
      render();
    }),
  );
}

function render() {
  const list = applySort(applyFilters(DEALS, controls), controls.sort);
  $('#grid').innerHTML = list.length
    ? list.map(dealCard).join('')
    : `<p class="empty">No deals match those filters. Loosen one and try again.</p>`;
  $('#result-count').textContent =
    list.length === DEALS.length
      ? `Showing all ${list.length} deals`
      : `Showing ${list.length} of ${DEALS.length} deals`;
  document.querySelectorAll('#cat-chips .chip').forEach((b) => {
    const on = b.dataset.cat === controls.cat;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
}

function syncUrl() {
  const p = new URLSearchParams();
  if (controls.q) p.set('q', controls.q);
  if (controls.cat !== 'All') p.set('cat', controls.cat);
  if (controls.store !== 'All') p.set('store', controls.store);
  if (controls.min > 0) p.set('min', String(controls.min));
  if (controls.verdict !== 'All') p.set('verdict', controls.verdict);
  if (controls.sort !== 'discount') p.set('sort', controls.sort);
  const next = p.toString();
  history.replaceState(null, '', next ? `?${next}` : location.pathname);
}

function fillSelect(id, options, current) {
  const el = $(id);
  el.innerHTML = options
    .map((o) => `<option value="${o.value}"${o.value === current ? ' selected' : ''}>${o.label}</option>`)
    .join('');
}

function initControls() {
  const q = $('#q');
  q.value = controls.q;
  q.addEventListener('input', () => {
    controls.q = q.value.trim();
    syncUrl();
    render();
  });

  fillSelect('#store', [{ value: 'All', label: 'All stores' }, ...STORES.map((s) => ({ value: s, label: s }))], controls.store);
  $('#store').addEventListener('change', (e) => {
    controls.store = e.target.value;
    syncUrl();
    render();
  });

  fillSelect(
    '#min',
    [
      { value: '0', label: 'Any discount' },
      { value: '20', label: '20% off or more' },
      { value: '40', label: '40% off or more' },
      { value: '50', label: '50% off or more' },
    ],
    String(controls.min),
  );
  $('#min').addEventListener('change', (e) => {
    controls.min = Number(e.target.value);
    syncUrl();
    render();
  });

  fillSelect(
    '#verdict',
    [
      { value: 'All', label: 'Any verdict' },
      { value: 'real', label: 'Real deals only' },
      { value: 'strong', label: 'Strong prices' },
      { value: 'modest', label: 'Modest cuts' },
    ],
    controls.verdict,
  );
  $('#verdict').addEventListener('change', (e) => {
    controls.verdict = e.target.value;
    syncUrl();
    render();
  });

  fillSelect(
    '#sort',
    [
      { value: 'discount', label: 'Biggest discount first' },
      { value: 'saving', label: 'Biggest saving ($) first' },
      { value: 'price', label: 'Lowest price first' },
      { value: 'name', label: 'Name A–Z' },
    ],
    controls.sort,
  );
  $('#sort').addEventListener('change', (e) => {
    controls.sort = e.target.value;
    syncUrl();
    render();
  });

  $('#reset').addEventListener('click', () => {
    controls.q = '';
    controls.cat = 'All';
    controls.store = 'All';
    controls.min = 0;
    controls.verdict = 'All';
    controls.sort = 'discount';
    q.value = '';
    $('#store').value = 'All';
    $('#min').value = '0';
    $('#verdict').value = 'All';
    $('#sort').value = 'discount';
    syncUrl();
    render();
  });
}

$('#checked-note').textContent = CHECKED_NOTE;
renderStats();
renderChips();
initControls();
render();
