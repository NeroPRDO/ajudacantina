import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const file of [...(await readdir(join(root,'src'))).filter(f=>/\.m?js$/.test(f)).map(f=>'src/'+f),...(await readdir(join(root,'scripts'))).filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)])execFileSync(process.execPath,['--check',join(root,file)],{stdio:'inherit'});
const output=join(root,'dist');
const html=await readFile(join(output,'index.html'),'utf8');
for(const [,json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(json);
if(html.includes('src="https://www.googletagmanager.com/'))throw new Error('Analytics must remain behind consent');
const sitemap=await readFile(join(output,'sitemap.xml'),'utf8');
for(const [,address] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)){
 const url=new URL(address);if(url.hash)throw new Error('Sitemap must not contain fragment routes');
 await stat(join(output,url.pathname.replace(/^\/ajudacantina\//,'')||'index.html'));
}
const guide=await readFile(join(output,'guia-cantina-ipb.html'),'utf8');
if(!guide.includes('<h1>Cantina do IPB em Bragança</h1>'))throw new Error('Missing static guide content');
for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 if(/^(https?:|mailto:|#)/.test(url))continue;
 const path=resolve(output,url);
 if(relative(output,path).startsWith('..'))throw new Error(`Path escapes build: ${url}`);
 await stat(path);
}
const dishes=JSON.parse(await readFile(join(output,'data/dishes.json'),'utf8'));
const sources=new Set();
for(const dish of dishes){
 if(sources.has(dish.source))throw new Error(`Repeated publication: ${dish.source}`);
 sources.add(dish.source);
 const image=await readFile(join(output,dish.image));
 if(image[0]!==255||image[1]!==216||image.length<1000)throw new Error(`Invalid JPEG: ${dish.image}`);
 if(dish.date===null&&!dish.collectedOn)throw new Error(`Archive provenance missing: ${dish.id}`);
}
for(const excluded of ['imports','.qa','.git','.env']){
 try {await stat(join(output,excluded));}catch(error){if(error.code==='ENOENT')continue;throw error;}
 throw new Error(`Private build input exposed: ${excluded}`);
}
const manifest=JSON.parse(await readFile(join(output,'manifest.webmanifest'),'utf8'));
for(const icon of manifest.icons)await stat(join(output,icon.src));
console.log(`Validated JavaScript, build links, manifest and ${dishes.length} source-linked JPEGs.`);

const wall=JSON.parse(await readFile(join(output,'data/wall.json'),'utf8'));
if(!Array.isArray(wall)||wall.some(entry=>typeof entry.name!=='string'||!entry.name.trim()||entry.name.length>100))throw new Error('Invalid community wall entries');
if(dishes.some(d=>d.credit!=='@comidasdoipb'||!d.image.startsWith('assets/archive/')))throw new Error('Unexpected catalogue source');
