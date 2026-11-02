import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { normalize } from '../src/core.mjs';
const root = new URL('../', import.meta.url);
const archive = JSON.parse(await readFile(new URL('imports/comidasdoipb/catalogue.json', root), 'utf8'));
const existing = JSON.parse(await readFile(new URL('data/dishes.json', root), 'utf8')).filter(d => d.credit !== '@comidasdoipb');
await mkdir(new URL('assets/archive/', root), { recursive: true });
function classify(name) {
  const text = normalize(name);
  const types = [];
  const rules = [
    ['chicken', /frango/], ['turkey', /peru/], ['beef', /vitela/], ['pork', /porco|entremeada|febras|bacon|fiambre/], ['lamb', /cordeiro/], ['duck', /pato/],
    ['tofu', /tofu/], ['soy', /soja/], ['seitan', /seitan/], ['chickpeas', /grao/], ['beans', /favas|feij/], ['mushrooms', /cogumelo/], ['vegetables', /legumes|brocol|pimentos/],
    ['eggs', /ovos/], ['seafood', /lulas|marisco/], ['salmon', /salmao/], ['hake', /pescada/], ['cod', /bacalhau/], ['fillet', /filete/], ['grilled', /grelhad/], ['baked', /forno|assad/],
  ];
  for (const [key, pattern] of rules) if (pattern.test(text)) types.push(key);
  const meat = /frango|peru|vitela|porco|cordeiro|pato|entremeada|febras|churrasco|carne|almondegas|hamburguer|salsicheiro|transmontana|bife a ipb/.test(text);
  const fish = /salm[aã]o|pescada|peixe|bacalhau|badejo|solha|abrotea|tamboril|dourada|raia|carapau|perca|robalo|marujinho|marinheiro|lulas/.test(text);
  const vegetarian = /vegetarian|vegan|tofu|seitan|soja|legumes|favas|grao|cogumelo|brocol|pimentos|napolitana|alfredo/.test(text);
  const categories = [fish ? 'fish' : meat ? 'meat' : types.includes('eggs') ? 'eggs' : vegetarian ? 'vegetarian' : 'other'];
  if (/massa|macarr|fetuccine|esparguete|espaguete|lasanha|fusili|bolonhesa/.test(text)) categories.push('pasta');
  return { categories, subtypes: types };
}
for (const dish of existing) Object.assign(dish, classify(dish.name), { categories: dish.categories });
for (const record of archive.records.filter(r => r.type === 'photo')) {
  if (!record.localImage || !record.name) throw new Error(`Incomplete archive record ${record.id}`);
  const image = `assets/archive/${record.id}.jpg`;
  await copyFile(new URL(`imports/comidasdoipb/${record.localImage}`, root), new URL(image, root));
  existing.push({ id: `archive-${record.id.toLowerCase()}`, name: record.name, translations: {}, ...classify(record.name), tags: [], description: {pt:'',en:'',fr:'',es:''}, image, date: null,
    collectedOn: archive.collectedOn, source: record.source, credit: '@comidasdoipb', ingredients: null, preparation: null, allergens: null, verifiedRecipe: false });
}
await writeFile(new URL('data/dishes.json', root), JSON.stringify(existing, null, 2) + '\n');
console.log(`Imported ${existing.length} photographic records, including ${existing.length - 4} historical records. Unknown publication dates remain null.`);
