export function generateInitialSoilHistory() {
const now = new Date();
const arr = [];
for (let i = 0; i < 20; i++) {
arr.push({ time: `${now.getHours()}:${String(now.getMinutes() - (19 - i)).padStart(2, '0')}`, top: 40 + Math.round(Math.random() * 4 - 2), mid: 30 + Math.round(Math.random() * 6 - 3), bottom: 45 + Math.round(Math.random() * 5 - 2) });
}
return arr;
}


export function generateInitialTankHistory() {
const now = new Date();
const arr = [];
for (let i = 0; i < 24; i++) {
arr.push({ time: `${now.getHours()}:${String(now.getMinutes() - (23 - i)).padStart(2, '0')}`, level: 70 + Math.round(Math.random() * 6 - 3) });
}
return arr;
}