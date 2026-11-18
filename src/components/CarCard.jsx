export default function CarCard({ car }) {
  return (
    <article className="overflow-hidden rounded-lg bg-white shadow">
      <div
        className="flex h-36 items-center justify-center bg-slate-200 text-5xl"
        aria-hidden="true"
      >
        {car.image ? (
          <img src={car.image} alt="" className="h-full w-full object-cover" />
        ) : (
          '🚗'
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold">{`${car.make} ${car.model}`}</h2>
        <p className="text-sm text-slate-600">
          {`${car.year} · ${car.type} · ${car.seats} seats`}
        </p>
        <p className="mt-2 font-bold">
          {`KES ${car.pricePerDay.toLocaleString('en-US')}`}
          <span className="text-sm font-normal text-slate-500"> / day</span>
        </p>
      </div>
    </article>
  );
}