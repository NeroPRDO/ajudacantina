export const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
export function moneyToCents(value) {
  const input = String(value).trim().replace(',', '.');
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(input)) return null;
  const [whole, decimal = ''] = input.split('.');
  return Number(whole) * 100 + Number(decimal.padEnd(2, '0'));
}
export function calculateBudget(balance, lunch, dinner, plan) {
  if (![balance, lunch, dinner].every(Number.isSafeInteger) || balance < 0 || lunch <= 0 || dinner <= 0) return null;
  const rows = Object.values(plan);
  const lunches = rows.filter(row => row.lunch === true).length;
  const dinners = rows.filter(row => row.dinner === true).length;
  const total = lunches * lunch + dinners * dinner;
  return { lunches, dinners, meals: lunches + dinners, total, topUp: Math.max(0, total - balance), remaining: Math.max(0, balance - total), lunchCapacity: Math.floor(balance / lunch), dinnerCapacity: Math.floor(balance / dinner) };
}
export function lisbonParts(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(p => [p.type, p.value]));
  const key = `${parts.year}-${parts.month}-${parts.day}`;
  return { key, year: +parts.year, month: +parts.month - 1, day: +parts.day, weekday: new Date(`${key}T12:00:00Z`).getUTCDay(), minutes: +parts.hour * 60 + +parts.minute };
}
export const dateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
export function isServiceDay(key, venue, closures = []) {
  const date = new Date(`${key}T12:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(key) && !Number.isNaN(+date) && date.toISOString().startsWith(key) && venue.days.includes(date.getUTCDay()) && !closures.includes(key);
}
export function openingStatus(venue, date = new Date(), closures = []) {
  const now = lisbonParts(date);
  if (!isServiceDay(now.key, venue, closures)) return { open: false, next: null };
  const toMinutes = time => time.split(':').map(Number).reduce((h,m) => h * 60 + m);
  const current = venue.slots.find(([start,end]) => now.minutes >= toMinutes(start) && now.minutes < toMinutes(end));
  return { open: Boolean(current), next: current ? current[1] : venue.slots.find(([start]) => toMinutes(start) > now.minutes)?.[0] ?? null };
}
export function filterDishes(dishes, { query = '', category = 'all', subtype = 'all', minRating = 0, onlyFavorites = false, favorites = [], sort = 'recent', ratings = {}, locale = 'pt-PT' } = {}) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return dishes.filter(dish => (category === 'all' || dish.categories.includes(category)) && (subtype === 'all' || dish.subtypes?.includes(subtype)) && (ratings[dish.id] || 0) >= minRating && (!onlyFavorites || favorites.includes(dish.id)) && terms.every(term => normalize([dish.name, ...Object.values(dish.translations || {}), ...(dish.ingredients || []), ...(dish.tags || [])].join(' ')).includes(term)))
    .sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name,locale) : sort === 'rating' ? (ratings[b.id] || 0) - (ratings[a.id] || 0) || (b.date || '').localeCompare(a.date || '') : (b.date || '').localeCompare(a.date || ''));
}
export function cleanPreferences(raw, ids, site) {
  const valid = new Set(ids);
  const favorites = Array.isArray(raw?.favorites) ? [...new Set(raw.favorites.filter(id => valid.has(id)))] : [];
  const ratings = Object.fromEntries(Object.entries(raw?.ratings || {}).filter(([id,n]) => valid.has(id) && Number.isInteger(n) && n >= 1 && n <= 5));
  const plan = Object.fromEntries(Object.entries(raw?.plan || {}).filter(([key,row]) => row && typeof row === 'object' && isServiceDay(key,site.venues[0],site.closures)).map(([key,row]) => [key,{lunch:row.lunch === true,dinner:row.dinner === true}]).filter(([,row]) => row.lunch || row.dinner));
  return { favorites, ratings, plan, locale: ['pt-PT','pt-BR','en','fr','es'].includes(raw?.locale) ? raw.locale : 'pt-PT', largeText: raw?.largeText === true, contrast: raw?.contrast === true, balance: moneyToCents(raw?.balance) !== null ? String(raw.balance) : '0', lunch: moneyToCents(raw?.lunch) > 0 ? String(raw.lunch) : '', dinner: moneyToCents(raw?.dinner) > 0 ? String(raw.dinner) : '' };
}
