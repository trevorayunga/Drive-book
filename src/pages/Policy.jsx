import { business } from '../config/business';
import { policySections } from '../config/policy';

export default function Policy() {
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Rental policy</h1>
      <p className="mt-2 text-slate-600">
        Please read these terms before you book. By booking a car you agree to them.
      </p>

      {policySections.map((section) => (
        <div key={section.title} className="mt-6 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      <p className="mt-6 text-sm text-slate-600">
        {`Questions? Call ${business.phone} or email ${business.email}.`}
      </p>
    </section>
  );
}