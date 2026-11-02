// Approximate bar heights transcribed visually from six user-supplied screenshots.
// Indices are illustrative, NOT Google percentages, occupancy or people counts.
// Screenshot scales may differ. Interpolated points are editorial estimates.
export const weeklyReference = {
  1:{lunch:[70,68,42],dinner:[37,43,37]},
  2:{lunch:[77,81,53],dinner:[42,47,35]},
  3:{lunch:[86,95,62],dinner:[48,59,48]},
  4:{lunch:[63,67,42],dinner:[39,48,42]},
  5:{lunch:[49,52,34],dinner:[35,42,35]},
  6:{lunch:[20,28,29],dinner:[30,38,34]},
};
const minutes = time => { const [h,m] = time.split(':').map(Number); return h*60+m; };
export function averageIntensity(points) {
  let area=0;
  for(let i=1;i<points.length;i++) area+=(minutes(points[i][0])-minutes(points[i-1][0]))*(points[i][1]+points[i-1][1])/2;
  return Math.round(area/(minutes(points.at(-1)[0])-minutes(points[0][0])));
}
export function crowdForDay(day) {
  const reference=weeklyReference[day];if(!Number.isInteger(day)||!reference)return [];
  const [a,b,c]=reference.lunch, [d,e,f]=reference.dinner;
  return [
    {meal:'lunch',points:[['12:00',Math.round(a*.4)],['12:20',a],['12:30',a],['13:00',b],['13:30',b],['13:45',Math.round((b+c)/2)],['14:00',c],['14:15',Math.round(c*.5)],['14:30',0]]},
    {meal:'dinner',points:[['19:30',d],['19:45',Math.round((d+e)/2)],['20:00',e],['20:15',e],['20:30',e],['20:45',Math.round((e+f)/2)],['21:00',f],['21:15',Math.round(f*.5)],['21:30',0]]},
  ];
}
