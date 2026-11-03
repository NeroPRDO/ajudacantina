const root=new URL(process.env.SITE_URL || 'https://neroprdo.github.io/ajudacantina/');
if(root.protocol!=='https:'||root.hostname!=='neroprdo.github.io')throw new Error('Unexpected deployment destination');
async function get(path){
 const response=await fetch(new URL(path,root),{signal:AbortSignal.timeout(15000),cache:'no-store'});
 if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);
 return response;
}
let lastError;
for(let attempt=1;attempt<=6;attempt++){
 try {
  const release=await (await get(`release.json?attempt=${attempt}`)).json();
  if(process.env.EXPECTED_SHA && release.commit!==process.env.EXPECTED_SHA)throw new Error('CDN still serving previous release');
  const dishes=await (await get('data/dishes.json')).json();
  if(dishes.some(d=>d.credit!=='@comidasdoipb'))throw new Error('Unexpected catalogue source');
  if(dishes.length!==release.records)throw new Error('Published catalogue and release counts differ');
  const html=await (await get('')).text();
  if(!html.includes(root.href))throw new Error('Canonical URL mismatch');
  for(const path of ['app.js','core.mjs','crowd.mjs','selects.mjs','analytics.mjs','guia-cantina-ipb.html','sitemap.xml','data/wall.json','i18n.js','locales-extra.mjs','locale-dates.mjs','styles.css','sw.js','manifest.webmanifest',dishes[0].image,dishes.at(-1).image])await get(path);
  console.log(`Verified live release ${release.commit}: ${dishes.length} records and essential assets at ${root.href}`);
  process.exit(0);
 }catch(error){lastError=error;console.log(`Verification attempt ${attempt}: ${error.message}`);if(attempt<6)await new Promise(resolve=>setTimeout(resolve,10000));}
}
throw lastError;
