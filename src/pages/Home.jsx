import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="py-12 text-center">
      <h1 className="text-4xl font-bold">Rent a car in minutes</h1>
      <p className="mt-4 text-slate-600">
        Browse available cars, pick your dates and book with confidence.
      </p>
        <Link
        to="/cars"
        className="mt-6 inline-block rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-500"
      >
        Browse cars
      </Link>
    </section>
  );
}