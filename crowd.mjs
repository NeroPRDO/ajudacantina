// Illustrative relative intensity, not observed people, waiting times or Google percentages.
// Same default for every service day: no evidence supports differences between weekdays.
export const crowdSlots = [
  { meal: 'lunch', points: [['12:00',20],['12:15',55],['12:20',90],['12:30',100],['13:00',100],['13:30',100],['13:45',90],['14:00',40],['14:15',15],['14:30',0]] },
  { meal: 'dinner', points: [['19:30',15],['19:45',40],['20:00',65],['20:15',65],['20:30',65],['20:45',35],['21:00',20],['21:15',10],['21:30',0]] },
];
const minutes = time => { const [h,m] = time.split(':').map(Number); return h*60+m; };
export function averageIntensity(points) {
  let area=0;
  for(let i=1;i<points.length;i++) area+=(minutes(points[i][0])-minutes(points[i-1][0]))*(points[i][1]+points[i-1][1])/2;
  return Math.round(area/(minutes(points.at(-1)[0])-minutes(points[0][0])));
}
export function crowdForDay(day) { return Number.isInteger(day) && day>=1 && day<=6 ? crowdSlots : []; }
