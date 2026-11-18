import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const cars = [
  { id: 'toyota-vitz', make: 'Toyota', model: 'Vitz', year: 2018, type: 'Hatchback', pricePerDay: 3000, seats: 4, image: '' },
  { id: 'mazda-demio', make: 'Mazda', model: 'Demio', year: 2019, type: 'Hatchback', pricePerDay: 3200, seats: 5, image: '' },
  { id: 'honda-fit', make: 'Honda', model: 'Fit', year: 2017, type: 'Hatchback', pricePerDay: 3300, seats: 5, image: '' },
  { id: 'toyota-corolla', make: 'Toyota', model: 'Corolla', year: 2020, type: 'Sedan', pricePerDay: 4500, seats: 5, image: '' },
  { id: 'mercedes-c200', make: 'Mercedes-Benz', model: 'C200', year: 2019, type: 'Sedan', pricePerDay: 18000, seats: 5, image: '' },
  { id: 'nissan-xtrail', make: 'Nissan', model: 'X-Trail', year: 2018, type: 'SUV', pricePerDay: 8500, seats: 5, image: '' },
  { id: 'subaru-forester', make: 'Subaru', model: 'Forester', year: 2019, type: 'SUV', pricePerDay: 9000, seats: 5, image: '' },
  { id: 'toyota-prado', make: 'Toyota', model: 'Land Cruiser Prado', year: 2018, type: 'SUV', pricePerDay: 15000, seats: 7, image: '' },
  { id: 'toyota-noah', make: 'Toyota', model: 'Noah', year: 2017, type: 'Van', pricePerDay: 7000, seats: 8, image: '' },
  { id: 'toyota-hiace', make: 'Toyota', model: 'Hiace', year: 2018, type: 'Van', pricePerDay: 12000, seats: 14, image: '' },
];

for (const { id, ...data } of cars) {
  await setDoc(doc(db, 'cars', id), data);
  console.log(`Seeded ${id}`);
}
process.exit(0);