import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const file of ['app.js','core.mjs','crowd.mjs','i18n.js',...(await readdir(join(root,'scripts'))).filter(f=>f.endsWith('.mjs')).map(f=>'scripts/'+f)])execFileSync(process.execPath,['--check',join(root,file)],{stdio:'inherit'});
const output=join(root,'dist');
const html=await readFile(join(output,'index.html'),'utf8');
for(const [,url] of html.matchAll(/(?:src|href)="([^"#]+)"/g)){
 if(/^(https?:|#)/.test(url))continue;
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
