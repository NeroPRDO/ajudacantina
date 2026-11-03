export const measurementId='G-SVH473JREE';
const key='ajuda-cantina-analytics-v1';
let enabled=false, loaded=false, lastPage='';
const routes=new Set(['catalog','favorites','planner','hours','about','privacy','wall']);
export function analyticsRoute(hash){const route=String(hash).replace(/^#/,'');return routes.has(route)?route:'catalog';}
export function trackPage(){
  if(!enabled||!loaded)return;
  const route=analyticsRoute(location.hash);
  if(lastPage===route)return;lastPage=route;
  window.gtag('event','page_view',{page_title:document.title,page_location:location.origin+location.pathname+'#'+route,page_referrer:location.origin+location.pathname});
}
function consent(value){
  enabled=value;window['ga-disable-'+measurementId]=!value;
  if(value&&!loaded){
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    window.gtag('consent','update',{analytics_storage:'granted'});
    window.gtag('js',new Date());
    window.gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false});
    const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;
    document.head.append(script);loaded=true;
  }else if(loaded)window.gtag('consent','update',{analytics_storage:value?'granted':'denied'});
  if(!value){
    lastPage='';
    for(const entry of document.cookie.split(';')){
      const name=entry.trim().split('=')[0];if(!/^_ga(?:_|$)/.test(name))continue;
      for(const path of ['/',location.pathname])for(const domain of ['',`; domain=${location.hostname}`])document.cookie=`${name}=; Max-Age=0; path=${path}${domain}; SameSite=Lax`;
    }
  }
  trackPage();
}
export function startAnalytics(t){
  let choice=null;try{choice=localStorage.getItem(key);}catch{}
  consent(choice==='accepted');
  const banner=document.getElementById('analytics-consent');banner.hidden=choice!==null;
  document.addEventListener('click',event=>{
    const action=event.target.closest('[data-analytics]')?.dataset.analytics;if(!action)return;
    if(action==='settings'){banner.hidden=false;banner.querySelector('button')?.focus();return;}
    const accepted=action==='accept';
    try{localStorage.setItem(key,accepted?'accepted':'rejected');}catch{}
    consent(accepted);banner.hidden=true;

  });
  window.addEventListener('storage',event=>{if(event.key===key)consent(event.newValue==='accepted');});
}
