import { Link } from 'react-router-dom';
import { business } from '../config/business';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{business.name}</p>
          <p className="mt-2 text-sm">{business.tagline}</p>
        </div>

        <div>
          <h2 className="font-semibold text-white">Contact us</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <a href={`tel:${business.phone.replace(/\s/g, '')}`} className="hover:underline">
                {business.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${business.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${business.email}`} className="hover:underline">
                {business.email}
              </a>
            </li>
            <li>{business.address}</li>
            <li>{business.hours}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-white">Quick links</h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link to="/cars" className="hover:underline">
                Cars
              </Link>
            </li>
            <li>
              <Link to="/policy" className="hover:underline">
                Rental policy
              </Link>
            </li>
            <li>
              <Link to="/bookings" className="hover:underline">
                My bookings
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <p className="border-t border-slate-700 py-4 text-center text-xs">
        &copy; {year} {business.name}. All rights reserved.
      </p>
    </footer>
  );
}