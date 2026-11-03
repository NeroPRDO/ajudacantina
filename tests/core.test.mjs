import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { moneyToCents, calculateBudget, lisbonParts, openingStatus, minutesUntilOpening, filterDishes, cleanPreferences, isServiceDay } from '../src/core.mjs';
import { dictionaries } from '../src/i18n.js';
const site=JSON.parse(readFileSync(new URL('../data/site.json',import.meta.url)));
const catalogue=JSON.parse(readFileSync(new URL('../data/dishes.json',import.meta.url)));
const dishes=[{id:'almondegas',name:'Almôndegas',categories:['meat']},{id:'soja',name:'Soja',translations:{en:'Soya'},categories:['vegetarian']},{id:'lasanha',name:'Lasanha',translations:{en:'Lasagna'},categories:['pasta']}];
test('money parsing preserves cents and rejects ambiguous or invalid input',()=>{
  assert.equal(moneyToCents('2,85'),285);assert.equal(moneyToCents(' 3.1 '),310);assert.equal(moneyToCents('0'),0);
  for(const value of ['',null,undefined,'-1','Infinity','NaN','2.855','1.000,00','1e3'])assert.equal(moneyToCents(value),null);
});
test('meal budget uses integer arithmetic with different lunch/dinner prices',()=>{
  const result=calculateBudget(1000,285,310,{'2026-11-02':{lunch:true,dinner:true},'2026-11-03':{lunch:true,dinner:true}});
  assert.deepEqual(result,{lunches:2,dinners:2,meals:4,total:1190,topUp:190,remaining:0,lunchCapacity:3,dinnerCapacity:3});
  assert.equal(calculateBudget(0,285,310,{}).topUp,0);
  assert.equal(calculateBudget(100,0,310,{}),null);
  assert.equal(calculateBudget(null,285,310,{}),null);
  assert.equal(calculateBudget(1000,100,100,{'a':{lunch:true}}).remaining,900);
});
test('opening status obeys Lisbon summer time and exact closing boundaries',()=>{
  assert.equal(lisbonParts(new Date('2026-07-06T11:00:00Z')).minutes,720);
  assert.equal(lisbonParts(new Date('2026-11-02T12:00:00Z')).minutes,720);
  assert.equal(openingStatus(site.venues[0],new Date('2026-11-02T12:00:00Z')).open,true);
  assert.deepEqual(openingStatus(site.venues[0],new Date('2026-11-02T14:30:00Z')),{open:false,next:'19:30'});
  assert.equal(openingStatus(site.venues[0],new Date('2026-11-02T21:30:00Z')).open,false);
  assert.equal(openingStatus(site.venues[0],new Date('2026-11-01T12:30:00Z')).open,false);
  assert.equal(openingStatus(site.venues[0],new Date('2026-11-02T12:30:00Z'),['2026-11-02']).open,false);
});
test('calendar excludes Sundays, invalid dates and recorded closures',()=>{
  assert.equal(isServiceDay('2026-11-01',site.venues[0]),false);
  assert.equal(isServiceDay('2026-11-07',site.venues[0]),true);
  assert.equal(isServiceDay('2026-11-07',site.venues[1]),false);
  assert.equal(isServiceDay('2026-02-31',site.venues[0]),false);
  assert.equal(isServiceDay('bad',site.venues[0]),false);
  assert.equal(isServiceDay('2026-11-02',site.venues[0],['2026-11-02']),false);
});
test('search ignores accents and combines category and favourites filters',()=>{
  assert.equal(filterDishes(dishes,{query:'ALMONDEGAS'})[0].id,'almondegas');
  assert.equal(filterDishes(dishes,{query:'soya',category:'vegetarian'})[0].id,'soja');
  assert.equal(filterDishes(dishes,{query:'soja',category:'meat'}).length,0);
  assert.deepEqual(filterDishes(dishes,{onlyFavorites:true,favorites:['lasanha'],query:'lasagna'}).map(d=>d.id),['lasanha']);
  assert.equal(filterDishes(dishes,{sort:'rating',ratings:{soja:5}})[0].id,'soja');
});
test('stored preferences discard stale identifiers and invalid ratings and dates',()=>{
  const clean=cleanPreferences({favorites:['soja','soja','missing'],ratings:{soja:6,lasanha:5,missing:4},locale:'xx',plan:{'2026-11-01':{lunch:true},'2026-11-02':{dinner:true},bad:{lunch:true}},balance:'-10',lunch:'0'},dishes.map(d=>d.id),site);
  assert.deepEqual(clean.favorites,['soja']);assert.deepEqual(clean.ratings,{lasanha:5});assert.equal(clean.locale,'pt-PT');assert.equal(clean.balance,'0');assert.equal(clean.lunch,'');assert.deepEqual(clean.plan,{'2026-11-02':{lunch:false,dinner:true}});
  assert.equal(cleanPreferences(null,[],site).locale,'pt-PT');
});
test('every supported language has a complete interface dictionary',()=>{
  const keys=Object.keys(dictionaries['pt-PT']).sort();
  for(const dictionary of Object.values(dictionaries)){assert.deepEqual(Object.keys(dictionary).sort(),keys);assert.ok(Object.values(dictionary).every(value=>typeof value==='string'&&value.length));}
});
test('catalogue has traceable sources and no fabricated recipes',()=>{
  assert.equal(new Set(dishes.map(d=>d.id)).size,dishes.length);
  for(const dish of catalogue){assert.equal(dish.credit,"@comidasdoipb");assert.ok(dish.source.startsWith('https://www.instagram.com/'));assert.ok(dish.credit);assert.equal(dish.verifiedRecipe,false);assert.equal(dish.allergens,null);}
});

test('next opening crosses nights, weekends, closures and Lisbon DST',()=>{
const v=site.venues[0];
assert.equal(minutesUntilOpening(v,new Date('2026-11-02T18:55:00Z')),35);
assert.equal(minutesUntilOpening(v,new Date('2026-11-02T12:05:00Z')),0);
assert.equal(minutesUntilOpening(v,new Date('2026-11-07T22:00:00Z')),2280);
assert.equal(minutesUntilOpening(v,new Date('2026-03-28T22:00:00Z')),2220);
assert.equal(minutesUntilOpening(v,new Date('2026-10-24T21:00:00Z')),2340);
assert.equal(minutesUntilOpening(v,new Date('2026-11-02T11:00:00Z'),['2026-11-02']),1500);
});
