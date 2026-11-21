import { business } from './business';
import { DEPOSIT_PERCENT } from '../lib/deposit';

// Sample terms. Adjust them to match the real rental business.
export const policySections = [
  {
    title: 'Who can rent',
    items: [
      'Drivers must be at least 21 years old.',
      'A valid driving licence held for at least 2 years must be shown at pickup.',
      'A national ID or passport is required at pickup.',
      'Only drivers named on the booking may drive the car.',
    ],
  },
  {
    title: 'Security deposit',
    items: [
      `A refundable security deposit of ${DEPOSIT_PERCENT}% of the rental total is paid at pickup.`,
      'The deposit covers extra charges if something goes wrong, such as damage, fines, fuel and cleaning.',
      'If the car comes back on time, undamaged and with the same fuel level, the deposit is refunded within 7 days.',
      'If the charges are higher than the deposit, the renter pays the difference.',
    ],
  },
  {
    title: 'Pickup and return',
    items: [
      'Collect and return the car at the agreed time and place.',
      'Returns more than 1 hour late are charged as an extra half day. Returns more than 4 hours late are charged as a full extra day.',
      'The car must be returned with the same fuel level it had at pickup.',
      'Please inspect the car at pickup and note any existing marks or damage.',
    ],
  },
  {
    title: 'Extra charges',
    items: [
      'Missing fuel is charged at the pump price plus a refuelling fee.',
      'A cleaning fee applies if the car is returned unusually dirty or smells of smoke.',
      'Lost or damaged keys, documents, tools and accessories are charged at replacement cost.',
      'Traffic fines, parking fees and tolls during the rental are paid by the renter.',
      'Any extra charges are deducted from the security deposit first.',
    ],
  },
  {
    title: 'Accidents and damage',
    items: [
      'Stop safely, make sure everyone is safe and call emergency services if anyone is hurt.',
      `Call us immediately on ${business.phone}.`,
      'Report the accident to the police and obtain a police abstract within 24 hours.',
      'Do not admit fault or agree to pay anything at the scene.',
      'Take photos of the vehicles, the scene and the other driver details.',
      'Our insurance covers damage when the renter follows these terms. The renter pays the insurance excess, up to the amount of the security deposit.',
      'Insurance cover does not apply, and the renter pays the full repair cost, if the driver was drunk, on drugs, unlicensed, racing, driving off-road or breaking these terms.',
    ],
  },
  {
    title: 'Cancellations',
    items: [
      'Cancel at least 48 hours before pickup for no charge.',
      'Cancellations within 48 hours of pickup are charged one day of rental.',
      'No-shows are charged one day of rental.',
    ],
  },
  {
    title: 'Rules of use',
    items: [
      'No smoking in the car.',
      'No sub-letting, and no use for hire, racing or towing.',
      'Do not take the car outside Kenya without written permission.',
      'Keep to the daily mileage limit agreed at pickup.',
      'Carry no more passengers than the number of seats.',
    ],
  },
    {
    title: 'Your information',
    items: [
      'We collect your phone number only to contact you about your booking.',
      'Your contact details are visible only to you and our staff, and are never sold or shared for advertising.',
    ],
  },
];

