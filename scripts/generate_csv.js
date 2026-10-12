const fs = require('fs');
const path = require('path');

const cuisines = ['Chinese', 'American', 'Indian', 'Mexican', 'Italian'];
const genders = ['Male', 'Female', 'Non-Binary'];
const visitFrequencies = ['Weekly', 'Monthly', 'Rarely'];
const timeOfVisits = ['Breakfast', 'Lunch', 'Dinner'];
const diningOccasions = ['Business', 'Casual', 'Celebration'];
const mealTypes = ['Dine-in', 'Takeaway'];

function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

const header = 'CustomerID,Age,Gender,Income,VisitFrequency,AverageSpend,PreferredCuisine,TimeOfVisit,GroupSize,DiningOccasion,MealType,OnlineReservation,DeliveryOrder,LoyaltyProgramMember,WaitTime,ServiceRating,FoodRating,AmbianceRating,HighSatisfaction\n';

let rows = [header];

for (let i = 1; i <= 1500; i++) {
  const r = (seedOffset) => seededRandom(i * 37 + seedOffset);
  
  const customerID = 1000 + i;
  const age = Math.floor(20 + r(1) * 60);
  const gender = genders[Math.floor(r(2) * genders.length)];
  const income = Math.floor(35000 + r(3) * 125000);
  const visitFrequency = visitFrequencies[Math.floor(r(4) * visitFrequencies.length)];
  const averageSpend = parseFloat((25 + r(5) * 180).toFixed(2));
  const preferredCuisine = cuisines[Math.floor(r(6) * cuisines.length)];
  const timeOfVisit = timeOfVisits[Math.floor(r(7) * timeOfVisits.length)];
  const groupSize = Math.floor(1 + r(8) * 7);
  const diningOccasion = diningOccasions[Math.floor(r(9) * diningOccasions.length)];
  const mealType = mealTypes[Math.floor(r(10) * mealTypes.length)];
  const onlineReservation = r(11) > 0.4 ? 1 : 0;
  const deliveryOrder = r(12) > 0.7 ? 1 : 0;
  const loyaltyProgramMember = r(13) > 0.5 ? 1 : 0;
  
  const waitTime = parseFloat((5 + r(14) * 60).toFixed(1));
  
  let serviceRating = Math.max(1, Math.min(5, Math.round(5 - (waitTime / 18) + (r(15) * 1.5 - 0.75))));
  let foodRating = Math.max(1, Math.min(5, Math.round(4 + (r(16) * 2 - 1))));
  let ambianceRating = Math.max(1, Math.min(5, Math.round(3.5 + (r(17) * 2 - 1))));
  
  const avgRating = (serviceRating + foodRating + ambianceRating) / 3;
  let highSatisfaction = 1;
  if (avgRating < 3.2 || waitTime > 45 || (serviceRating <= 2 && r(18) > 0.2)) {
    highSatisfaction = 0;
  }
  
  rows.push(`${customerID},${age},${gender},${income},${visitFrequency},${averageSpend},${preferredCuisine},${timeOfVisit},${groupSize},${diningOccasion},${mealType},${onlineReservation},${deliveryOrder},${loyaltyProgramMember},${waitTime},${serviceRating},${foodRating},${ambianceRating},${highSatisfaction}\n`);
}

const csvData = rows.join('');

// Save to data/restaurant_customer_satisfaction.csv
const dir1 = path.join(__dirname, '../data');
if (!fs.existsSync(dir1)){
    fs.mkdirSync(dir1, { recursive: true });
}
fs.writeFileSync(path.join(dir1, 'restaurant_customer_satisfaction.csv'), csvData);

// Save to app/data/restaurant_customer_satisfaction.csv as requested by user
const dir2 = path.join(__dirname, '../app/data');
if (!fs.existsSync(dir2)){
    fs.mkdirSync(dir2, { recursive: true });
}
fs.writeFileSync(path.join(dir2, 'restaurant_customer_satisfaction.csv'), csvData);

console.log('Successfully generated CSV in both /data and /app/data with 1500 rows.');
