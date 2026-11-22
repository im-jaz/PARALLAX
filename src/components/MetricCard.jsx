export default function MetricCard({ label, value, detail, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-emerald-50 text-emerald-700',
  }

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <strong className="text-2xl text-slate-900">
          {value}
        </strong>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
        >
          {detail}
        </span>
      </div>
    </article>
  )
}