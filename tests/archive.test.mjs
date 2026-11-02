import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {filterDishes} from '../core.mjs';
import {crowdForDay,averageIntensity} from '../crowd.mjs';
const dishes=JSON.parse(readFileSync(new URL('../data/dishes.json',import.meta.url)));
test('all historical photo publications retain sources and unknown dates',()=>{
 const archive=dishes.filter(d=>d.credit==='@comidasdoipb');
 assert.equal(archive.length,189);
 assert.equal(new Set(archive.map(d=>d.source)).size,189);
 for(const dish of archive){assert.equal(dish.date,null);assert.ok(dish.image.startsWith('assets/archive/'));assert.ok(dish.name);}
});
test('nested filters combine subtype, rating and favourites without losing unknown dates',()=>{
 const tofu=dishes.find(d=>d.subtypes?.includes('tofu'));
 assert.ok(tofu);
 assert.deepEqual(filterDishes(dishes,{category:'vegetarian',subtype:'tofu',minRating:4,ratings:{[tofu.id]:5},onlyFavorites:true,favorites:[tofu.id]}).map(d=>d.id),[tofu.id]);
 assert.equal(filterDishes(dishes,{category:'meat',subtype:'tofu'}).length,0);
 assert.equal(filterDishes(dishes,{sort:'recent'}).at(-1).date,null);
 assert.equal(filterDishes(dishes,{sort:'rating',ratings:{[tofu.id]:5}})[0].id,tofu.id);
});
test('crowd default covers service days only, with stated peaks and bounded weighted averages',()=>{
 assert.deepEqual(crowdForDay(0),[]);assert.deepEqual(crowdForDay(7),[]);
 for(let day=1;day<=6;day++){
  const [lunch,dinner]=crowdForDay(day);
  assert.equal(lunch.points.find(([time])=>time==='12:20')[1],90);
  assert.equal(lunch.points.find(([time])=>time==='13:45')[1],90);
  assert.equal(dinner.points.find(([time])=>time==='20:00')[1],65);
  assert.equal(dinner.points.find(([time])=>time==='20:30')[1],65);
  for(const slot of [lunch,dinner])assert.ok(averageIntensity(slot.points)>0&&averageIntensity(slot.points)<100);
 }
 assert.equal(averageIntensity([['12:00',0],['13:00',100]]),50);
});
