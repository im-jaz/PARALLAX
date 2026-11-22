import { useMemo, useState } from 'react'
import { INITIAL_ZONES, simulate } from '../utils/simulation'
import { scenarioStore } from '../services/scenarioStore'
import { useAuth } from '../context/useAuth'
import MetricCard from '../components/MetricCard'

export default function DashboardPage() {
  const { logout } = useAuth()
  const [growth, setGrowth] = useState(12)
  const [roadCapacity, setRoadCapacity] = useState(0)
  const [saved, setSaved] = useState(() => scenarioStore.list())

  const result = useMemo(
    () => simulate(INITIAL_ZONES, growth, roadCapacity),
    [growth, roadCapacity],
  )

  const saveScenario = () => {
    const scenario = scenarioStore.create({
      name: `${growth}% growth`,
      growth,
      roadCapacity,
      result,
    })

    setSaved((current) => [scenario, ...current])
  }

  const removeScenario = (id) => {
    scenarioStore.remove(id)
    setSaved((current) => current.filter((item) => item.id !== id))
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
              Scenario workspace
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Regional Growth Model
            </h1>
          </div>

          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Logout
          </button>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Population"
            value={result.totalPopulation.toLocaleString()}
            detail={`+${growth}%`}
            tone="blue"
          />

          <MetricCard
            label="Congestion"
            value={`${result.congestionPercent}%`}
            detail={result.status}
            tone={result.status === 'Critical' ? 'red' : 'orange'}
          />

          <MetricCard
            label="Facilities needed"
            value={result.infrastructureDemand}
            detail="Estimated"
            tone="green"
          />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Population growth: {growth}%
              <input
                type="range"
                min="0"
                max="60"
                value={growth}
                onChange={(event) => setGrowth(Number(event.target.value))}
                className="mt-3 block w-full accent-blue-600"
              />
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Road capacity: {roadCapacity.toLocaleString()}
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={roadCapacity}
                onChange={(event) => setRoadCapacity(Number(event.target.value))}
                className="mt-3 block w-full accent-orange-500"
              />
            </label>

            <div className="sm:col-span-2 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
              <p><strong>Population:</strong> {result.totalPopulation.toLocaleString()}</p>
              <p><strong>Trips:</strong> {result.totalTrips.toLocaleString()}</p>
              <p><strong>Congestion:</strong> {result.congestionPercent}%</p>
              <p><strong>Facilities:</strong> {result.infrastructureDemand}</p>
              <p><strong>Status:</strong> {result.status}</p>
              <p>
                <strong>Bottlenecks:</strong>{' '}
                {result.bottlenecks.join(', ') || 'None'}
              </p>
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Simulation status
            </p>
            <p className="mt-3 text-2xl font-bold">{result.status}</p>
            <p className="mt-2 text-sm text-slate-300">
              {result.bottlenecks.length
                ? `Pressure detected in ${result.bottlenecks.join(', ')}.`
                : 'No major bottlenecks detected.'}
            </p>

            <button
              type="button"
              onClick={saveScenario}
              className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Save scenario
            </button>
          </aside>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Saved scenarios</h2>

          {saved.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No saved scenarios.
            </p>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {saved.map((scenario) => (
                <article
                  key={scenario.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <strong className="truncate text-sm">{scenario.name}</strong>

                  <button
                    type="button"
                    onClick={() => removeScenario(scenario.id)}
                    className="shrink-0 rounded-md px-2 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}