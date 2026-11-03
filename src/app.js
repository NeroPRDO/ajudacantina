import { formatDate } from './locale-dates.mjs';
import { normalize, moneyToCents, calculateBudget, lisbonParts, dateKey, isServiceDay, openingStatus, minutesUntilOpening, filterDishes, cleanPreferences } from './core.mjs';
import { crowdForDay, averageIntensity } from './crowd.mjs';
import { watchSelects } from './selects.mjs';
import { startAnalytics, trackPage } from './analytics.mjs';
import { translate, countLabel } from './i18n.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const storageKey = 'ajuda-cantina-v1';
const categories = { all:'🍽️', meat:'🍗', fish:'🐟', vegetarian:'🌱', eggs:'🥚', pasta:'🍝', soup:'🥣', dessert:'🍮', other:'🔎' };
let subtype='all', minRating=0, pageLimit=24, crowdDay=lisbonParts().weekday;
const subtypeKeys=['chicken','turkey','beef','pork','lamb','duck','tofu','soy','seitan','chickpeas','beans','mushrooms','vegetables','eggs','seafood','salmon','hake','cod','fillet','grilled','baked'];
let dishes = [], wall = [], site, prefs, route = 'catalog', category = 'all', search = '', sort = 'recent', deferredInstall, registration;
let calendarMonth = lisbonParts().month, calendarYear = lisbonParts().year;
let mealSelection = { lunch:true, dinner:false }, toastTimer, detailId;
const t = key => translate(prefs?.locale || 'pt-PT',key);
const formatLocale = () => Intl.DateTimeFormat.supportedLocalesOf([prefs.locale]).length ? prefs.locale : 'pt-CV';
const currency = cents => new Intl.NumberFormat(formatLocale(),{style:'currency',currency:'EUR'}).format(cents / 100);
const dateLabel = key => formatDate(prefs.locale,{dateStyle:'medium',timeZone:'UTC'},new Date(`${key}T12:00:00Z`));
const languageCode = () => prefs.locale.startsWith('pt') ? 'pt' : prefs.locale;
const dishName = dish => dish.translations?.[languageCode()] || dish.name;

function toast(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; },5500);
}
function save() {
  try { localStorage.setItem(storageKey,JSON.stringify(prefs)); return true; }
  catch { toast(t('storageError')); return false; }
}
function translatePage(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  root.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label',t(el.dataset.i18nAria)));
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
}
function applyPreferences() {
  document.documentElement.lang = prefs.locale;
  document.documentElement.classList.toggle('large-text',prefs.largeText);
  document.documentElement.classList.toggle('high-contrast',prefs.contrast);
  $('#language').value = prefs.locale;
  translatePage();
}
function statusText(venue) {
  const status = openingStatus(venue,new Date(),site.closures);
  const minutes=minutesUntilOpening(venue,new Date(),site.closures);
  if(!status.open && minutes!==null) return `${t('opensIn')} ${Math.floor(minutes/60)}h ${minutes%60}min`;
  return status.open ? `${t('openUntil')} ${status.next}` : status.next ? `${t('opensAt')} ${status.next}` : t('closed');
}
function renderStatus() { if (site) $('#quick-status').textContent = statusText(site.venues[0]); }
function renderFilters() {
  const choices=dishes.filter(d=>category==='all'||d.categories.includes(category));
  const available=subtypeKeys.filter(key=>choices.some(d=>d.subtypes?.includes(key)));
  $('#category-chips').innerHTML=Object.entries(categories).map(([key,icon])=>`<button type="button" class="category-chip" data-category="${key}" aria-pressed="${category===key}"><span aria-hidden="true">${icon}</span>${t(key)}</button>`).join('');
  $('#filters').innerHTML = '<label for="subtype-select">'+t('refine')+'<select id="subtype-select"><option value="all">'+t('allTypes')+'</option>'+available.map(key=>'<option value="'+key+'" '+(subtype===key?'selected':'')+'>'+t(key)+'</option>').join('')+'</select></label><label for="rating-filter">'+t('myRating')+'<select id="rating-filter">'+[0,1,2,3,4,5].map(n=>'<option value="'+n+'" '+(minRating===n?'selected':'')+'>'+(n?'★ '+n+'+':t('allRatings'))+'</option>').join('')+'</select></label>';
}
function renderCatalog() {
  const favoriteView = route === 'favorites';
  $('.hero').hidden = favoriteView; $('.quick-info').hidden = favoriteView;
  $('.section-heading').style.marginTop = favoriteView ? '40px' : '';
  $('#catalog-heading').textContent = t(favoriteView ? 'favorites' : 'whatLooksGood');
  $('#catalog-subtitle').hidden=!favoriteView;
  $('#catalog-subtitle').textContent = t(favoriteView ? 'favoritesSubtitle' : 'catalogSubtitle');
  const count = favoriteView ? prefs.favorites.length : dishes.length;
  $('#catalog-total').textContent = `${count} ${countLabel(prefs.locale,'dishes',count)}`;
  const visible = filterDishes(dishes,{query:search, category, subtype, minRating, onlyFavorites:favoriteView, favorites:prefs.favorites, sort, ratings:prefs.ratings, locale:prefs.locale});
  $('#results-count').textContent = `${visible.length} ${countLabel(prefs.locale,'results',visible.length)}`;
  $('#dish-grid').innerHTML = visible.slice(0,pageLimit).map(dish => {
    const name = escape(dishName(dish)); const favorite = prefs.favorites.includes(dish.id);
    return `<article class="dish-card"><div class="dish-image-wrap"><button class="dish-link" data-detail="${dish.id}" aria-label="${t('details')}: ${name}"><img src="${escape(dish.image)}" alt="${name} · ${escape(dish.credit)}" style="object-position:${escape(dish.imagePosition || 'center')}" width="480" height="640" loading="lazy" decoding="async"></button><span class="category-tag">${t(dish.categories[0])}</span><button class="favorite-btn" data-favorite="${dish.id}" aria-pressed="${favorite}" aria-label="${t(favorite ? 'favoriteRemove' : 'favoriteAdd')}: ${name}"><span aria-hidden="true">${favorite ? '♥' : '♡'}</span></button></div><div class="card-body"><h3><button class="card-title" data-detail="${dish.id}">${name}</button></h3><p class="card-description">${escape(dish.description[languageCode()] || dish.description.pt)}</p><div class="card-bottom"><span>${escape(dish.credit)}</span><span class="rating-small">${prefs.ratings[dish.id] ? `★ ${prefs.ratings[dish.id]}/5 · ${t('myRating')}` : t('noRating')}</span><span class="card-arrow" aria-hidden="true">↗</span></div></div></article>`;
  }).join('');
  $('#load-more').hidden=visible.length<=pageLimit;
  $('#load-more').textContent=t('loadMore').replace('24',String(Math.min(24,Math.max(0,visible.length-pageLimit))));
  $('#empty-state').hidden = visible.length > 0;
  $('#empty-description').textContent = t(favoriteView && !prefs.favorites.length ? 'emptyFavorites' : 'emptySearch');
  renderFilters();
}
function toggleFavorite(id) {
  const removing = prefs.favorites.includes(id);
  prefs.favorites = removing ? prefs.favorites.filter(item => item !== id) : [...prefs.favorites,id];
  if (save()) toast(t(removing ? 'removed' : 'saved'));
  const active = document.activeElement?.dataset.favorite;
  renderCatalog();
  if (active) document.querySelector(`[data-favorite="${active}"]`)?.focus();
  if ($('#detail-dialog').open) {
    const btn = $('#detail-favorite'); btn.textContent = t(removing ? 'favoriteAdd' : 'favoriteRemove'); btn.setAttribute('aria-pressed',String(!removing));
  }
}
function openDetail(id) {
  const dish = dishes.find(d => d.id === id); if (!dish) return; detailId = id;
  const name = dishName(dish), rated = prefs.ratings[id] || 0;
  $('#detail-content').innerHTML = `<button class="dialog-close" data-close="detail-dialog" aria-label="${t('close')}">×</button><div class="detail-layout"><img class="detail-photo" src="${escape(dish.image)}" alt="${escape(name)} · ${escape(dish.credit)}"><div class="detail-text"><span class="count-pill">${dish.categories.map(c=>t(c)).join(' · ')}</span><h2 id="detail-title">${escape(name)}</h2>${name !== dish.name ? `<p>${t('originalName')}: <span lang="pt">${escape(dish.name)}</span></p>` : ''}<p>${escape(dish.description[languageCode()] || dish.description.pt)}</p>${dish.verifiedRecipe && dish.ingredients?.length ? `<h3>${t('ingredients')}</h3><p>${escape(dish.ingredients.join(', '))}</p>` : ''}<p class="help">${t('communitySoon')}</p><label class="rating-select" for="personal-rating"><strong>${t('personalRating')}</strong><select id="personal-rating">${[0,1,2,3,4,5].map(n=>`<option value="${n}" ${rated === n ? 'selected' : ''}>${n ? '★'.repeat(n) + ` · ${n} ${t('ratingStars')}` : t('noRating')}</option>`).join('')}</select></label><p class="help">${t('ratingHelp')}</p><button class="text-button" id="clear-rating">${t('clearRating')}</button><div class="detail-actions"><button id="detail-favorite" class="primary-button" aria-pressed="${prefs.favorites.includes(id)}">${t(prefs.favorites.includes(id) ? 'favoriteRemove' : 'favoriteAdd')}</button><a class="secondary-button" href="${escape(dish.source)}" target="_blank" rel="noopener noreferrer">${t('sourcePost')}</a></div><div class="detail-credit">${t('photoCredit')}: ${escape(dish.credit)}<br>${dish.date ? t('published')+' '+dateLabel(dish.date) : t('unknownDate')}</div></div></div>`;
  if (!$('#detail-dialog').open) $('#detail-dialog').showModal();
}
function renderPlanner() {
  $('#planner-view').innerHTML = `<div class="page-heading"><p class="eyebrow">${t('budgetEyebrow')}</p><h1>${t('budgetTitle')}</h1><p>${t('budgetIntro')}</p></div><div class="planner-grid"><div><section class="panel"><div class="field-grid"><label for="balance">${t('balance')}<input id="balance" type="text" inputmode="decimal" maxlength="10" value="${escape(prefs.balance)}" aria-describedby="price-help budget-validation"></label><label for="lunch-price">${t('lunchPrice')}<input id="lunch-price" type="text" inputmode="decimal" maxlength="10" value="${escape(prefs.lunch)}" placeholder="0,00" aria-describedby="price-help budget-validation"></label><label for="dinner-price">${t('dinnerPrice')}<input id="dinner-price" type="text" inputmode="decimal" maxlength="10" value="${escape(prefs.dinner)}" placeholder="0,00" aria-describedby="price-help budget-validation"></label></div><aside class="price-notice"><strong>${t('priceTimingTitle')}</strong><p>${t('priceTimingBody')}</p></aside><p class="help" id="price-help">${t('priceHelp')}</p><a href="${site.pricesUrl}" target="_blank" rel="noopener noreferrer" class="inline-link">${t('priceSource')}</a></section><section class="panel"><h2>${t('selectDays')}</h2><div class="meal-toggle"><label><input type="checkbox" id="meal-lunch" ${mealSelection.lunch ? 'checked' : ''}>${t('lunch')}</label><label><input type="checkbox" id="meal-dinner" ${mealSelection.dinner ? 'checked' : ''}>${t('dinner')}</label></div><div id="calendar-area"></div><p class="help">${t('calendarHelp')}</p></section></div><aside class="panel summary-panel" aria-labelledby="summary-title"><h2 id="summary-title">${t('summary')}</h2><div id="budget-summary" aria-live="polite" aria-atomic="true"></div><p class="help">${t('allMonths')}</p><ul id="scheduled-days" class="scheduled-days"></ul><button class="text-button" id="clear-plan">${t('clearPlan')}</button><a class="secondary-button" href="${site.bookingUrl}" target="_blank" rel="noopener noreferrer">${t('officialMenu')}</a></aside></div>`;
  renderCalendar(); renderBudget();
}
function renderCalendar() {
  const first = (new Date(Date.UTC(calendarYear,calendarMonth,1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(calendarYear,calendarMonth + 1,0)).getUTCDate();
  const title = formatDate(prefs.locale,{month:'long',year:'numeric',timeZone:'UTC'},new Date(Date.UTC(calendarYear,calendarMonth,1)));
  let cells = Array.from({length:7},(_,i) => `<span class="weekday">${escape(formatDate(prefs.locale,{weekday:'short',timeZone:'UTC'},new Date(Date.UTC(2024,0,i+1))))}</span>`).join('');
  cells += '<span aria-hidden="true"></span>'.repeat(first);
  for(let day=1; day<=days; day++) {
    const key = dateKey(calendarYear,calendarMonth,day), row = prefs.plan[key];
    const enabled = isServiceDay(key,site.venues[0],site.closures);
    const meals = row ? [row.lunch && t('lunch'),row.dinner && t('dinner')].filter(Boolean).join(' + ') : '';
    cells += `<button class="day ${key === lisbonParts().key ? 'today' : ''}" data-day="${key}" aria-label="${dateLabel(key)}${meals ? ': ' + meals : ''}" aria-pressed="${Boolean(row)}" ${enabled ? '' : 'disabled'} ${key === lisbonParts().key ? 'aria-current="date"' : ''}>${day}<small aria-hidden="true">${row ? (row.lunch ? '☀' : '') + (row.dinner ? ' ☾' : '') : '&nbsp;'}</small></button>`;
  }
  $('#calendar-area').innerHTML = `<div class="calendar-header"><button id="previous-month" aria-label="${t('previousMonth')}">‹</button><h3 id="month-title" aria-live="polite">${title}</h3><button id="next-month" aria-label="${t('nextMonth')}">›</button></div><div class="calendar" role="group" aria-labelledby="month-title">${cells}</div><div class="calendar-actions"><button id="select-weekdays">${t('weekdays')}</button><button id="clear-month">${t('clearMonth')}</button></div>`;
}
function renderBudget() {
  const values = [prefs.balance,prefs.lunch,prefs.dinner].map(moneyToCents);
  const result = calculateBudget(...values,prefs.plan);
  [['balance',0],['lunch-price',1],['dinner-price',2]].forEach(([id,index]) => {
    const valid = values[index] !== null && (index === 0 ? values[index] >= 0 : values[index] > 0);
    $(`#${id}`)?.setAttribute('aria-invalid',String(!valid));
  });
  if (!result) $('#budget-summary').innerHTML = `<p class="validation" id="budget-validation">${t('invalidPrices')}</p>`;
  else {
    const lunchPercent = result.total ? result.lunches * values[1] / result.total * 100 : 0;
    $('#budget-summary').innerHTML = `<span id="budget-validation" class="sr-only"></span><div class="summary-number">${result.meals}</div><p class="summary-label">${countLabel(prefs.locale,'meals',result.meals)}</p><div class="budget-bars" aria-hidden="true"><span style="width:${lunchPercent}%"></span><span style="width:${result.total ? 100-lunchPercent : 0}%"></span></div><div class="bar-legend"><span><i class="dot"></i>${result.lunches} ${countLabel(prefs.locale,'lunches',result.lunches)}</span><span><i class="dot mint"></i>${result.dinners} ${countLabel(prefs.locale,'dinners',result.dinners)}</span></div><dl class="summary-rows"><div><dt>${t('total')}</dt><dd>${currency(result.total)}</dd></div><div class="topup"><dt>${t('topUp')}</dt><dd>${currency(result.topUp)}</dd></div><div><dt>${t('remaining')}</dt><dd>${currency(result.remaining)}</dd></div></dl><div class="capacity"><small>${t('capacity')}</small><strong>${result.lunchCapacity} ${countLabel(prefs.locale,'lunches',result.lunchCapacity)}</strong> ${t('or')} <strong>${result.dinnerCapacity} ${countLabel(prefs.locale,'dinners',result.dinnerCapacity)}</strong></div>`;
  }
  $('#scheduled-days').innerHTML = Object.entries(prefs.plan).sort(([a],[b])=>a.localeCompare(b)).map(([key,row])=>`<li><span>${dateLabel(key)}</span><span>${[row.lunch && t('lunch'),row.dinner && t('dinner')].filter(Boolean).join(' + ')}</span></li>`).join('');
}
function changePlan(key) {
  if (!isServiceDay(key,site.venues[0],site.closures)) return;
  if (prefs.plan[key]) delete prefs.plan[key];
  else if (!mealSelection.lunch && !mealSelection.dinner) return toast(t('chooseMeal'));
  else prefs.plan[key] = {...mealSelection};
  save(); renderCalendar(); renderBudget(); document.querySelector(`[data-day="${key}"]`)?.focus();
}
function changeMonth(offset) {
  const next = new Date(Date.UTC(calendarYear,calendarMonth + offset,1)); calendarYear = next.getUTCFullYear(); calendarMonth = next.getUTCMonth();
  renderCalendar(); $(offset > 0 ? '#next-month' : '#previous-month')?.focus();
}
function crowdMarkup() {
  const slots=crowdForDay(crowdDay);
  const dayName=formatDate(prefs.locale,{weekday:'long',timeZone:'UTC'},new Date(Date.UTC(2024,0,crowdDay===0?7:crowdDay)));
  return '<section class="panel crowd-panel"><span class="count-pill">'+t('estimate')+'</span><h2>'+t('crowdTitle')+'</h2><p class="help">'+t('crowdCompact')+'</p><div class="crowd-comparison"><div class="crowd-charts">'+(slots.length?slots.map(slot=>'<figure><figcaption><strong>'+t(slot.meal)+'</strong> · '+t('modelMean')+' '+averageIntensity(slot.points)+'/100</figcaption><div class="crowd-bars" aria-hidden="true">'+slot.points.map(([time,value])=>'<div class="crowd-column"><span style="height:'+value+'%"></span><small>'+time+'</small></div>').join('')+'</div><details><summary>'+t('chartTable')+'</summary><table><thead><tr><th>'+t('hours')+'</th><th>'+t('intensity')+'</th></tr></thead><tbody>'+slot.points.map(([time,value])=>'<tr><th scope="row">'+time+'</th><td>'+value+'/100</td></tr>').join('')+'</tbody></table></details></figure>').join(''):'<p>'+t('closed')+'</p>')+'</div><div class="day-carousel"><button id="previous-day" aria-label="'+t('previousDay')+'">←</button><strong role="status">'+dayName+'</strong><button id="next-day" aria-label="'+t('nextDay')+'">→</button></div></div><details class="crowd-method"><summary>'+t('crowdDetails')+'</summary><p>'+t('crowdMethod')+'</p><p>'+t('crowdPeaks')+'</p></details><p class="help">'+t('crowdNoCounts')+'</p><a class="inline-link" href="https://www.google.com/maps/search/Cantina+IPB+Bragan%C3%A7a" target="_blank" rel="noopener noreferrer">Google Maps ↗</a> · <a class="inline-link" href="https://pt.restaurantguru.com/Cantina-IPB-Braganca" target="_blank" rel="noopener noreferrer">Restaurant Guru ↗</a></section>';
}
function renderHours() {
  $('#hours-view').innerHTML = `<div class="page-heading"><p class="eyebrow">${t('hoursEyebrow')}</p><h1>${t('hoursTitle')}</h1><p>${t('hoursIntro')}</p></div><div class="hours-grid">${site.venues.map(venue=>`<section class="panel"><span class="status-pill ${openingStatus(venue).open ? 'open' : ''}">${statusText(venue)}</span><h2>${escape(venue.name)}</h2><p class="help">${t(venue.days.includes(6) ? 'monSat' : 'monFri')}</p>${venue.slots.map(([from,to],i)=>`<div class="time-row"><span>${t(i === 0 ? 'lunch' : 'dinner')}</span><strong>${from} – ${to}</strong></div>`).join('')}</section>`).join('')}</div><div class="hours-note"><p class="help">${t('exceptions')}</p><p class="help">${t('verifiedOn')} ${dateLabel(site.verifiedOn)} · <a class="inline-link" href="${site.officialUrl}" target="_blank" rel="noopener noreferrer">${t('officialHours')}</a></p></div><section class="panel"><h2>${t("takeaway")}</h2><p>${t("takeawayBody")}</p><p class="help">${t("takeawayHistory")}</p><a class="inline-link" href="https://webdocs.ipb.pt/portal/download?docId=23072">Despacho 109/IPB/2020 ↗</a> · <a class="inline-link" href="${site.officialUrl}">SAS ↗</a> · <a class="inline-link" href="${site.bookingUrl}">${t("officialMenu")}</a></section>${crowdMarkup()}`;
}
function renderAbout(){
 $('#about-view').innerHTML='<div class="page-heading"><p class="eyebrow">ajuda.cantina</p><h1>'+t('aboutTitle')+'</h1><p>'+t('aboutBody')+'</p></div><div class="about-layout"><section class="panel"><h2>'+t('communityTitle')+'</h2><p>'+t('independent')+'</p><p>'+t('supportBody')+'</p><a class="inline-link" href="mailto:ajuda.cantina.unipb@proton.me">ajuda.cantina.unipb@proton.me</a></section><section class="panel"><h2>'+t('thanksSources')+'</h2><p>'+t('thanksSourcesBody')+'</p><div class="source-links"><a href="https://www.instagram.com/comidasdoipb/" target="_blank" rel="noopener noreferrer">@comidasdoipb ↗</a></div><p>'+t('rightsBody')+'</p></section><section class="panel"><h2>'+t('officialInfo')+'</h2><p>'+t('priceTimingBody')+'</p><div class="source-links"><a href="'+site.officialUrl+'" target="_blank" rel="noopener noreferrer">SAS-IPB ↗</a><a href="'+site.bookingUrl+'" target="_blank" rel="noopener noreferrer">'+t('officialMenu')+'</a></div></section><section class="panel"><h2>'+t('crowdTitle')+'</h2><p>'+t('crowdMethod')+'</p><p>'+t('crowdNoCounts')+'</p><a class="inline-link" href="#hours">'+t('seeHours')+'</a></section></div>';
}
function renderPrivacy(){
 $('#privacy-view').innerHTML='<div class="page-heading"><p class="eyebrow">ajuda.cantina</p><h1>'+t('privacy')+'</h1><p>'+t('privacyIntro')+'</p></div><div class="about-layout"><section class="panel"><h2>'+t('analyticsTitle')+'</h2><p>'+t('analyticsPrivacy')+'</p><button class="secondary-button" data-analytics="settings">'+t('analyticsSettings')+'</button><h2>'+t('onDevice')+'</h2><p>'+t('privacyBody')+'</p><p>'+t('privacyCache')+'</p><button class="secondary-button" id="delete-data">'+t('clearData')+'</button></section><section class="panel"><h2>'+t('externalServices')+'</h2><p>'+t('privacyExternal')+'</p><a class="inline-link" href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub · '+t('privacy')+'</a></section><section class="panel"><h2>'+t('contactUs')+'</h2><p>'+t('privacyEmail')+'</p><a class="inline-link" href="mailto:ajuda.cantina.unipb@proton.me">ajuda.cantina.unipb@proton.me</a></section></div>';
}
window.addEventListener('scroll',()=>{ $('#back-top').hidden=window.scrollY<600; },{passive:true});
function navigate({scroll = false} = {}) {
  const requested = location.hash.slice(1);
  route = ['catalog','favorites','planner','hours','about','privacy','wall'].includes(requested) ? requested : 'catalog';
  $$('.view').forEach(el => { el.hidden = true; });
  $(`#${route === 'favorites' ? 'catalog' : route}-view`).hidden = false;
  $$('[data-route]').forEach(el => route === el.dataset.route ? el.setAttribute('aria-current','page') : el.removeAttribute('aria-current'));
  document.title = route==='catalog'?'ajuda.cantina | Cantina IPB em Bragança — pratos e horários':`${t(route)} · ajuda.cantina`;
  trackPage();
  if (route === 'catalog' || route === 'favorites') renderCatalog();
  if (route === 'planner') renderPlanner();
  if (route === 'hours') renderHours();
  if (route === 'about') renderAbout();
  if (route === 'privacy') renderPrivacy();
  if (route === 'wall') $('#wall-view').innerHTML='<div class="page-heading"><h1>'+t('wall')+'</h1><p>'+t('wallBody')+'</p><a class="inline-link" href="mailto:ajuda.cantina.unipb@proton.me">ajuda.cantina.unipb@proton.me</a></div><section class="panel">'+(wall.length?'<ul>'+wall.map(entry=>'<li>'+escape(entry.name)+'</li>').join('')+'</ul>':'<p>'+t('wallEmpty')+'</p>')+'</section>';
  if (scroll) { window.scrollTo({top:0,behavior:'instant'}); $('#main').focus({preventScroll:true}); }
}
function utility(title,body) {
  $('#utility-content').innerHTML = `<div class="utility-content"><button class="dialog-close" data-close="utility-dialog" aria-label="${t('close')}">×</button><h2 id="utility-title">${title}</h2>${body}</div>`;
  $('#utility-dialog').showModal();
}
function resetFilters() { search=''; category='all'; subtype='all'; minRating=0; pageLimit=24; sort='recent'; $('#dish-search').value=''; $('#sort').value='recent'; renderCatalog(); }

document.addEventListener('click',async event => {
  if(event.target.closest('.skip-link')) { event.preventDefault(); $('#main').focus(); return; }
  const close = event.target.closest('[data-close]'); if (close) return $(`#${close.dataset.close}`).close();
  if (!prefs) return;
  const detail = event.target.closest('[data-detail]'); if (detail) return openDetail(detail.dataset.detail);
  const favorite = event.target.closest('[data-favorite]'); if (favorite) return toggleFavorite(favorite.dataset.favorite);
  const filter = event.target.closest('[data-category]'); if (filter) { category=filter.dataset.category; subtype='all'; pageLimit=24; renderCatalog(); document.querySelector(`[data-category="${category}"]`)?.focus(); return; }
  const day = event.target.closest('[data-day]'); if (day) return changePlan(day.dataset.day);
  switch(event.target.closest('[id]')?.id) {
    case 'explore': event.preventDefault(); $('#dish-search').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); $('#dish-search').focus({preventScroll:true}); break;
    case 'clear-search': search=''; $('#dish-search').value=''; pageLimit=24; renderCatalog(); $('#dish-search').focus(); break;
    case 'previous-day':
    case 'next-day': { const id=event.target.closest('[id]').id; crowdDay=(crowdDay+(id==='next-day'?1:6))%7; renderHours(); $('#'+id).focus({preventScroll:true}); $('.crowd-comparison').scrollIntoView({block:'center',behavior:'instant'}); break; }
    case 'load-more': { const previous=pageLimit; pageLimit+=24; renderCatalog(); $$('.dish-link')[previous]?.focus(); break; }
    case 'back-top': window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); $('.brand').focus({preventScroll:true}); break;
    case 'reset-filters': resetFilters(); $('#dish-search').focus(); break;
    case 'empty-reset': resetFilters(); if(route === 'favorites') location.hash='catalog'; break;
    case 'detail-favorite': toggleFavorite(detailId); break;
    case 'clear-rating': delete prefs.ratings[detailId]; if(save()) toast(t('saved')); $('#personal-rating').value='0'; renderCatalog(); break;
    case 'previous-month': changeMonth(-1); break;
    case 'next-month': changeMonth(1); break;
    case 'select-weekdays': {
      if (!mealSelection.lunch && !mealSelection.dinner) return toast(t('chooseMeal'));
      const count = new Date(Date.UTC(calendarYear,calendarMonth+1,0)).getUTCDate();
      for(let d=1;d<=count;d++) { const key=dateKey(calendarYear,calendarMonth,d); const weekday=new Date(`${key}T12:00:00Z`).getUTCDay(); if(weekday >= 1 && weekday <= 5 && isServiceDay(key,site.venues[0],site.closures)) prefs.plan[key]={...mealSelection}; }
      save(); renderCalendar(); renderBudget(); $('#select-weekdays').focus(); break;
    }
    case 'clear-month': Object.keys(prefs.plan).filter(key=>key.startsWith(dateKey(calendarYear,calendarMonth,1).slice(0,7))).forEach(key=>delete prefs.plan[key]); save(); renderCalendar(); renderBudget(); $('#clear-month').focus(); break;
    case 'clear-plan': prefs.plan={}; save(); renderCalendar(); renderBudget(); break;
    case 'accessibility': utility(t('accessibility'),`<p>${t('accessibilityBody')}</p><label><input id="large-text" type="checkbox" ${prefs.largeText?'checked':''}>${t('largeText')}</label><label><input id="high-contrast" type="checkbox" ${prefs.contrast?'checked':''}>${t('highContrast')}</label>`); break;
    case 'install-hero':
    case 'install-promo':
    case 'install':
      if (deferredInstall) { await deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall=null; }
      else utility(t('install'),`<p>${t('installBody')}</p>`);
      break;
    case 'delete-data': utility(t('clearData'),`<p>${t('clearConfirm')}</p><div class="dialog-actions"><button class="primary-button" id="confirm-delete">${t('clearData')}</button><button class="secondary-button" data-close="utility-dialog">${t('cancel')}</button></div>`); break;
    case 'confirm-delete': {
      try { localStorage.removeItem(storageKey); } catch { toast(t('storageError')); return; }
      prefs=cleanPreferences({},dishes.map(d=>d.id),site); $('#utility-dialog').close(); applyPreferences(); navigate(); break;
    }
    case 'update-app': registration?.waiting?.postMessage({type:'SKIP_WAITING'}); break;
  }
});
document.addEventListener('input',event => {
  if (!prefs) return;
  if(event.target.id === 'dish-search') { search=event.target.value; pageLimit=24; renderCatalog(); }
  const property = {'balance':'balance','lunch-price':'lunch','dinner-price':'dinner'}[event.target.id];
  if(property) { prefs[property]=event.target.value; save(); renderBudget(); }
});
document.addEventListener('change',event => {
  if (!prefs) return;
  switch(event.target.id) {
    case 'language': prefs.locale=event.target.value; save(); applyPreferences(); renderStatus(); navigate(); break;
    case 'category-select': category=event.target.value; subtype='all'; pageLimit=24; renderCatalog(); $('#category-select').focus(); break;
    case 'subtype-select': subtype=event.target.value; pageLimit=24; renderCatalog(); $('#subtype-select').focus(); break;
    case 'rating-filter': minRating=Number(event.target.value); pageLimit=24; renderCatalog(); $('#rating-filter').focus(); break;
    case 'crowd-day': crowdDay=Number(event.target.value); renderHours(); $('#crowd-day').focus(); break;
    case 'sort': pageLimit=24; sort=event.target.value; renderCatalog(); break;
    case 'personal-rating': { const rating=+event.target.value; if(rating) prefs.ratings[detailId]=rating; else delete prefs.ratings[detailId]; if(save()) toast(t('saved')); renderCatalog(); break; }
    case 'meal-lunch': mealSelection.lunch=event.target.checked; break;
    case 'meal-dinner': mealSelection.dinner=event.target.checked; break;
    case 'large-text': prefs.largeText=event.target.checked; save(); applyPreferences(); break;
    case 'high-contrast': prefs.contrast=event.target.checked; save(); applyPreferences(); break;
  }
});
document.addEventListener('keydown',event => {
  if(event.key === '/' && prefs && !['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName) && !document.querySelector('dialog[open]')) { event.preventDefault(); if(route!=='catalog' && route!=='favorites') { location.hash='catalog'; setTimeout(()=>$('#dish-search').focus(),0); } else $('#dish-search').focus(); }
});
window.addEventListener('hashchange',()=>{ if(prefs) navigate({scroll:true}); });
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;});
window.addEventListener('storage',event=>{
  if(event.key !== storageKey || !site) return;
  try { prefs=cleanPreferences(JSON.parse(event.newValue || '{}'),dishes.map(d=>d.id),site); applyPreferences(); navigate(); if($('#detail-dialog').open) openDetail(detailId); } catch { /* Ignore malformed external changes. */ }
});
const syncConnection = () => { $('#offline-banner').hidden=navigator.onLine; };
window.addEventListener('online',()=>{syncConnection(); registration?.update().catch(()=>{});});
window.addEventListener('offline',syncConnection);
$('#retry').addEventListener('click',()=>location.reload());
$('#detail-dialog').addEventListener('close',()=>{ document.querySelector(`[data-detail="${detailId}"]`)?.focus({preventScroll:true}); });
document.addEventListener('error',event=>{ if(event.target.tagName==='IMG') event.target.alt=t('unavailablePhoto'); },true);

function syncInstall(){const installed=['standalone','fullscreen','minimal-ui'].some(mode=>matchMedia('(display-mode: '+mode+')').matches)||navigator.standalone===true; document.querySelectorAll('.install-banner,#install,#install-hero').forEach(el=>el.hidden=installed);}
window.addEventListener('appinstalled',()=>{document.querySelectorAll('.install-banner,#install,#install-hero').forEach(el=>el.hidden=true);deferredInstall=null;});
for(const mode of ['standalone','fullscreen','minimal-ui']) matchMedia('(display-mode: '+mode+')').addEventListener('change',syncInstall);
$('#search-form').addEventListener('submit',event=>{event.preventDefault();$('#dish-search').blur();});
async function start() {
  try {
    const responses=await Promise.all([fetch('./data/dishes.json'),fetch('./data/site.json'),fetch('./data/wall.json')]);
    if(responses.some(response=>!response.ok)) throw new Error('Unable to fetch data');
    [dishes,site,wall]=await Promise.all(responses.map(response=>response.json()));
    let raw={}; try {raw=JSON.parse(localStorage.getItem(storageKey) || '{}');} catch { /* Defaults also handle disabled storage. */ }
    prefs=cleanPreferences(raw,dishes.map(d=>d.id),site);
    applyPreferences(); renderStatus(); navigate(); syncConnection(); watchSelects(); syncInstall(); startAnalytics();
    setInterval(()=>{ renderStatus(); if(route==='hours') $$('.hours-grid .status-pill').forEach((el,i)=>{el.textContent=statusText(site.venues[i]);el.classList.toggle('open',openingStatus(site.venues[i],new Date(),site.closures).open);}); },60000);
    if('serviceWorker' in navigator && window.isSecureContext) {
      registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
      const showUpdate=()=>{if(registration.waiting) $('#update-banner').hidden=false;};
      showUpdate();
      registration.addEventListener('updatefound',()=>{
        const worker=registration.installing;
        worker?.addEventListener('statechange',()=>{if(worker.state==='installed') { if(navigator.serviceWorker.controller) showUpdate(); else toast(t('offlineReady')); }});
      });
      let reloading=false;
      navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloading){reloading=true;location.reload();}});
      registration.update().catch(()=>{});
    }
  } catch(error) {
    if(!prefs) { $$('.view').forEach(el=>{el.hidden=true;}); $('#load-error').hidden=false; }
    console.error('ajuda.cantina:',error);
  }
}
start();
