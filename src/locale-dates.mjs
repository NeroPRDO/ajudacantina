// Cape Verdean Creole calendar names from Node/ICU locale data.
// Some browsers omit kea, so keep calendar output consistent across devices.
const weekdays=["dumingu","sigunda-fera","tersa-fera","kuarta-fera","kinta-fera","sesta-fera","sábadu"];
const shortDays=["dum","sig","ter","kua","kin","ses","sab"];
const months=["Janeru","Febreru","Marsu","Abril","Maiu","Junhu","Julhu","Agostu","Setenbru","Otubru","Nuvenbru","Dizenbru"];
export function formatDate(locale,options,date){
 if(locale!=='kea-CV')return new Intl.DateTimeFormat(locale,options).format(date);
 if(options.weekday)return (options.weekday==='short'?shortDays:weekdays)[date.getUTCDay()];
 if(options.month&&!options.dateStyle)return months[date.getUTCMonth()]+' di '+date.getUTCFullYear();
 return date.getUTCDate()+' di '+months[date.getUTCMonth()]+' di '+date.getUTCFullYear();
}
