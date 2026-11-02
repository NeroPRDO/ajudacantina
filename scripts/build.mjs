import { readFile, writeFile, mkdir, cp, readdir, stat } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createIcons } from './icons.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,'dist');
const dishes=JSON.parse(await readFile(join(root,'data/dishes.json'),'utf8'));
const site=JSON.parse(await readFile(join(root,'data/site.json'),'utf8'));
const ids=new Set();
for(const dish of dishes) {
  if(!/^[a-z0-9-]+$/.test(dish.id)||ids.has(dish.id))throw new Error(`Invalid/duplicate dish ID: ${dish.id}`);
  ids.add(dish.id);
  if(!dish.name||!dish.credit||!dish.categories?.length||!/^\d{4}-\d{2}-\d{2}$/.test(dish.date))throw new Error(`Incomplete dish: ${dish.id}`);
  if(!dish.categories.every(cat=>['meat','fish','vegetarian','pasta','soup','dessert'].includes(cat)))throw new Error(`Unknown category: ${dish.id}`);
  if(!dish.image.startsWith('assets/')||dish.image.includes('..')||dish.image.includes('\\'))throw new Error('Image must be inside assets/');
  await stat(join(root,dish.image));
  if(new URL(dish.source).protocol!=='https:')throw new Error('Source must use HTTPS');
  if(!['pt','en','fr','es'].every(lang=>typeof dish.description?.[lang]==='string'))throw new Error(`Missing translations: ${dish.id}`);
}
if(site.timeZone!=='Europe/Lisbon')throw new Error('Expected Europe/Lisbon timezone');
createIcons(join(root,'assets'));
await mkdir(output,{recursive:true});
for(const name of ['index.html','styles.css','app.js','core.mjs','i18n.js','manifest.webmanifest','assets','data']) await cp(join(root,name),join(output,name),{recursive:true});
await writeFile(join(output,'.nojekyll'),'');
await writeFile(join(output,'404.html'),'<!doctype html><html lang="pt"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Página não encontrada · Ajuda Cantina</title><body style="background:#15121e;color:#f7f3ff;font:20px system-ui;padding:8vw"><h1>Esta página não está na ementa.</h1><p>Page not found.</p><a style="color:#b49aff" href="/ajudacantina/">Voltar à Ajuda Cantina / Back to home</a></body></html>');
await writeFile(join(output,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://neroprdo.github.io/ajudacantina/sitemap.xml\n');
await writeFile(join(output,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://neroprdo.github.io/ajudacantina/</loc></url></urlset>');
async function walk(directory) { const files=[];for(const entry of await readdir(directory,{withFileTypes:true})){if(entry.name==='sw.js')continue;const path=join(directory,entry.name);if(entry.isDirectory())files.push(...await walk(path));else files.push(path);}return files.sort(); }
const files=await walk(output);
const hash=createHash('sha256');
for(const file of files){hash.update(relative(output,file));hash.update(await readFile(file));}
const version=hash.digest('hex').slice(0,16);
const assets=files.filter(file=>!['robots.txt','sitemap.xml','.nojekyll','404.html'].includes(relative(output,file))).map(file=>'./'+relative(output,file).replaceAll('\\','/'));
const worker=`// Generated from the content hash; do not edit dist directly.
const PREFIX='ajuda-cantina-'+new URL(self.registration.scope).pathname+'-';
const CACHE=PREFIX+'${version}';
const ASSETS=${JSON.stringify(assets)};
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const home=new URL('./',self.registration.scope).pathname;
   if(event.request.mode==='navigate'&&(url.pathname===home||url.pathname===home+'index.html'))return (await cache.match('./index.html'))||fetch(event.request);
   const hit=await cache.match(event.request,{ignoreSearch:true});
   if(hit)return hit;
   try{return await fetch(event.request);}catch{return new Response('Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}
 })());
});
`;
await writeFile(join(output,'sw.js'),worker);
console.log(`Built ${dishes.length} verified dish records, ${assets.length} offline assets. Version ${version}. Output: ${output}`);
